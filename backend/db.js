require('dotenv').config();
const mysql = require('mysql2/promise');
const nlp = require('compromise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Función para insertar un usuario
async function insertarUsuario(correo, hashedPassword, tipo_usuario) {
  try {
    const [result] = await pool.query(
      'INSERT INTO usuario (correo, contraseña, tipo_usuario) VALUES (?, ?, ?)',
      [correo, hashedPassword, tipo_usuario]
    );
    return result.insertId; // Retorna el ID del nuevo usuario insertado
  } catch (error) {
    console.error('Error al insertar usuario:', error.message);
    throw error; // Lanza el error para ser manejado por la función que llame
  }
}

// Función para obtener usuario por id 
async function getUserById(id_usuario) {
  const [rows] = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [id_usuario]);
  return rows;
}

// Función para obtener empresa por id usuario
async function getEmpresaByUserId(id_usuario) {
  const [rows] = await pool.query('SELECT * FROM empresa WHERE id_usuario = ?', [id_usuario]);
  return rows;
}

// Función para obtener freelancer por id usuario
async function getFreelancerByUserId(id_usuario) {
  const [rows] = await pool.query('SELECT * FROM freelancer WHERE id_usuario = ?', [id_usuario]);
  return rows;
}

// Función para obtener representante por id empresa
async function getRepresentanteByUserId(id_empresa) {
  const [rows] = await pool.query('SELECT * FROM representante_empresa WHERE id_empresa = ?', [id_empresa]);
  return rows;
}

// Función para verificar que no se dublique el proyecto
async function checkDuplicateProject(id_empresa, projectData) {
  const [rows] = await pool.query(
    `SELECT * FROM proyecto 
     WHERE id_empresa = ? AND titulo = ? AND descripcion = ? AND categoria = ? 
     AND habilidades_requeridas = ? AND presupuesto = ? AND duracion_estimada = ? 
     AND fecha_limite = ? AND ubicacion = ? AND tipo_contratacion = ? 
     AND metodologia_trabajo = ?`,
    [
      id_empresa,
      projectData.titulo,
      projectData.descripcion,
      projectData.categoria,
      projectData.habilidades_requeridas,
      projectData.presupuesto,
      projectData.duracion_estimada,
      projectData.fecha_limite,
      projectData.ubicacion,
      projectData.tipo_contratacion,
      projectData.metodologia_trabajo,
    ]
  );
  return rows;
}

// extraerDato
async function extraerDato(texto, regex) {
    const match = texto.match(regex);
    return match ? match[1]?.trim() || match[0]?.trim() : ''; // Asegura siempre devolver una cadena
}

async function extraerTelefono(texto, regex) {
    const match = texto.match(regex);
    return match ? match[0].trim() : 'No especificado';
  }  

// extraerIdiomas
async function extraerIdiomas(texto) {
  const idiomasMatch = texto.match(/IDIOMAS:\s+([\s\S]*?)(?:\n\n|$)/i);
  if (!idiomasMatch) return [];

  const idiomas = idiomasMatch[1]
      .split('\n')
      .map(line => line.replace(/•\s*/, '').trim()) // Elimina "•" y espacios
      .filter(line => line); // Filtra líneas vacías

  return idiomas.map(line => {
      const parts = line.split(/\s+/); // Divide por espacios
      const idioma = parts[0]; // El primer elemento es el idioma
      const nivel = parts.slice(1).join(' ') || "No especificado"; // El resto es el nivel
      return { idioma: idioma.trim(), nivel: nivel.trim() };
  });
}

// extraerHabilidades
async function extraerHabilidades(texto) {
  const habilidadesSection = texto.match(/CONOCIMIENTOS TÉCNICOS:\s*([\s\S]*?)(?:\n\n|$)/i);
  if (!habilidadesSection) return [];

  const categoriasValidas = [
      "Softwares",
      "Tecnologías de desarrollo Web",
      "Lenguajes de Programación",
      "Motores Web",
      "Motores de Base de Datos",
      "Sistemas Operativos"
  ];

  const habilidades = [];
  const lines = habilidadesSection[1].split('\n').filter(line => line.trim()); // Filtrar líneas vacías

  let currentCategory = "No especificado"; // Categoría por defecto

  for (const line of lines) {
      if (line.startsWith('•')) {
          // Detectar nueva categoría
          const posibleCategoria = line.replace('•', '').trim();
          currentCategory = categoriasValidas.includes(posibleCategoria)
              ? posibleCategoria
              : "No especificado";
      } else if (line.startsWith('o')) {
          // Detectar habilidades bajo la categoría actual
          const habilidad = line.replace('o', '').trim();
          if (habilidad) {
              habilidades.push({
                  habilidad,
                  categoria: currentCategory,
                  nivel: "No especificado", // Nivel no especificado en este caso
              });
          }
      }
  }

  return habilidades;
}

async function extraerDescripcion(texto) {
  const resumenRegex = /RESUMEN EJECUTIVO\s*([\s\S]*?)(?=\n[A-ZÁÉÍÓÚÑ ]+\n|$)/i;
  const acercaRegex = /Acerca de mí\s*([\s\S]*?)(?=\n[A-ZÁÉÍÓÚÑ ]+\n|$)/i;

  // Intentar extraer "RESUMEN EJECUTIVO"
  const resumenMatch = texto.match(resumenRegex);
  if (resumenMatch) return resumenMatch[1].trim();

  // Si no hay "RESUMEN EJECUTIVO", intentar con "Acerca de mí"
  const acercaMatch = texto.match(acercaRegex);
  if (acercaMatch) return acercaMatch[1].trim();

  // Si no se encuentra ninguna sección, retornar mensaje predeterminado
  return "Descripción no especificada";
}

// extraerEducacion
async function extraerEducacion(texto) {
  const antecedentesRegex = /ANTECEDENTES ACADÉMICOS\s*([\s\S]*?)(?:\n\n|$)/i;
  const formacionRegex = /Formación Académica\s*([\s\S]*?)(?:\n\n|$)/i;

  // Intentar extraer "ANTECEDENTES ACADÉMICOS"
  const antecedentesMatch = texto.match(antecedentesRegex);

  // Si no se encuentra, intentar extraer "Formación Académica"
  const formacionMatch = antecedentesMatch ? null : texto.match(formacionRegex);

  // Si no hay coincidencias, retornar valores por defecto
  if (!antecedentesMatch && !formacionMatch) {
      return {
          educacionBasica: "No definida",
          educacionMedia: "No definida",
          educacionSuperior: []
      };
  }

  const educacionText = antecedentesMatch ? antecedentesMatch[1] : formacionMatch[1];
  const lines = educacionText.split('\n').filter(line => line.trim());

  const educacionSuperior = [];

  // Procesar líneas y extraer información
  for (const line of lines) {
      // Caso formato 1: "2022 – 2023             Analista Programador, Universidad Tecnológica de Chile..."
      const matchFormato1 = line.match(/(\d{4})\s+–\s+(Actual|\d{4})\s+(.+?),\s+(.+)/);

      // Caso formato 2: "Análisis de Sistemas / Analista Programador, Universidad..."
      const matchFormato2 = line.match(/(.+?)\s*,\s+(.+?)\s*,?\s*(Presencial|Estudiando|Online)?\s*(\d{4})\s*-\s*(Actual|\d{4}|A la fecha)/i);

      if (matchFormato1) {
          educacionSuperior.push({
              anoInicio: matchFormato1[1],
              anoFin: matchFormato1[2] === "Actual" ? "Actual" : matchFormato1[2],
              carrera: matchFormato1[3].trim(),
              institucion: matchFormato1[4].trim()
          });
      } else if (matchFormato2) {
          educacionSuperior.push({
              anoInicio: matchFormato2[4],
              anoFin: matchFormato2[5] === "A la fecha" ? "Actual" : matchFormato2[5],
              carrera: matchFormato2[1].trim(),
              institucion: matchFormato2[2].trim()
          });
      } else {
          // Si la línea no coincide con ninguno de los formatos conocidos, añadirla como descripción
          educacionSuperior.push({ descripcion: line.trim() });
      }
  }

  return {
      educacionBasica: "No definida",
      educacionMedia: "No definida",
      educacionSuperior
  };
}

// extraerExperiencia
async function extraerExperiencia(texto, regex) {
  const experienciaSection = texto.match(regex);
  if (!experienciaSection) return [];

  const experiencia = [];
  const lines = experienciaSection[1].split('\n');
  for (const line of lines) {
      const match = line.match(/(.+)\s+en\s+(.+)\s+\((\d{4})\)/);
      if (match) {
          experiencia.push({
              cargo: match[1],
              empresa: match[2],
              ano: match[3],
          });
      }
  }
  return experiencia;
}

// Función para guardar los datos en la base de datos
async function guardarPerfilEnDB(data) {
  console.log('data:', data);
  const { 
      descripcion, 
      cv_url, 
      id_freelancer, 
      antecedentes_personales, 
      inclusion_laboral, 
      emprendimiento, 
      trabajo_practica, 
      nivel_educacional, 
      educacion_superior, 
      educacion_basica_media, 
      idiomas, habilidades, 
      curso, 
      pretensiones 
  } = data;

  try {
    await connection.beginTransaction();

    await connection.query(`UPDATE freelancer SET descripcion = ?, cv_url = ? WHERE id_freelancer = ?`, [descripcion, cv_url, id_freelancer]);


    // Actualizar descripción y cv_url en la tabla freelancer
    await pool.query(
        `UPDATE freelancer SET descripcion = ?, cv_url = ? WHERE id_freelancer = ?`,
        [descripcion, cv_url, id_freelancer]
    );

    // Insertar en la tabla 'antecedentes_personales'
    await pool.query(
        `INSERT INTO antecedentes_personales (id_freelancer, nombres, apellidos, fecha_nacimiento, identificacion, nacionalidad, ciudad, comuna, estado_civil)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id_freelancer, antecedentes_personales.nombres, antecedentes_personales.apellidos,
            antecedentes_personales.fecha_nacimiento, antecedentes_personales.identificacion,
            antecedentes_personales.nacionalidad, antecedentes_personales.ciudad_freelancer,
            antecedentes_personales.comuna, antecedentes_personales.estado_civil
        ]
    );

    // Insertar en la tabla 'inclusion_laboral'
    await pool.query(
        `INSERT INTO inclusion_laboral (id_freelancer, discapacidad, registro_nacional, pension_invalidez, ajuste_entrevista, tipo_discapacidad)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            id_freelancer, inclusion_laboral.discapacidad, inclusion_laboral.registro_nacional,
            inclusion_laboral.pension_invalidez, inclusion_laboral.ajuste_entrevista,
            inclusion_laboral.tipo_discapacidad
        ]
    );

    // Insertar en la tabla 'emprendimiento'
    await pool.query(
        `INSERT INTO emprendimiento (id_freelancer, emprendedor, interesado, ano_inicio, mes_inicio, sector_emprendimiento)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            id_freelancer, emprendimiento.emprendedor, emprendimiento.interesado,
            emprendimiento.ano_inicio_emprendimiento, emprendimiento.mes_inicio_emprendimiento,
            emprendimiento.sector_emprendimiento
        ]
    );

    // Insertar en la tabla 'trabajo_practica'
    await pool.query(
        `INSERT INTO trabajo_practica (id_freelancer, experiencia_laboral, experiencia, empresa, cargo, area_trabajo, tipo_cargo, ano_inicio, mes_inicio, descripcion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id_freelancer, trabajo_practica.experiencia_laboral, trabajo_practica.experiencia,
            trabajo_practica.empresa, trabajo_practica.cargo, trabajo_practica.area_trabajo,
            trabajo_practica.tipo_cargo, trabajo_practica.ano_inicio_trabajo, trabajo_practica.mes_inicio_trabajo,
            trabajo_practica.descripcion_trabajo
        ]
    );

    // Insertar en la tabla 'nivel_educacional'
    await pool.query(
        `INSERT INTO nivel_educacional (id_freelancer, nivel_academico, estado)
        VALUES (?, ?, ?)`,
        [
            id_freelancer, nivel_educacional.nivel_academico, nivel_educacional.estado_educacional
        ]
    );

    // Insertar en la tabla 'educacion_superior'
    await pool.query(
        `INSERT INTO educacion_superior (id_freelancer, institucion, carrera, carrera_afin, estado, ano_inicio, ano_termino)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            id_freelancer, educacion_superior.institucion_superior, educacion_superior.carrera,
            educacion_superior.carrera_afin, educacion_superior.estado_superior,
            educacion_superior.ano_inicio_superior, educacion_superior.ano_termino_superior
        ]
    );

    // Insertar en la tabla 'educacion_basica_media'
    await pool.query(
        `INSERT INTO educacion_basica_media (id_freelancer, institucion, tipo, pais, ciudad, ano_inicio, ano_termino)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            id_freelancer, educacion_basica_media.institucion_basica_media, educacion_basica_media.tipo,
            educacion_basica_media.pais, educacion_basica_media.ciudad_basica_media,
            educacion_basica_media.ano_inicio_basica_media, educacion_basica_media.ano_termino_basica_media
        ]
    );

    // Insertar múltiples idiomas en la tabla 'idiomas'
    const idiomaPromises = idiomas.map(idioma => {
        return pool.query(
            `INSERT INTO idiomas (id_freelancer, idioma, nivel) VALUES (?, ?, ?)`,
            [
                id_freelancer, idioma.idioma, idioma.nivel_idioma
            ]
        );
    });
    await Promise.all(idiomaPromises);

    // Insertar múltiples habilidades en la tabla 'habilidades'
    const habilidadPromises = habilidades.map(habilidad => {
        return pool.query(
            `INSERT INTO habilidades (id_freelancer, categoria, habilidad, nivel) VALUES (?, ?, ?, ?)`,
            [
                id_freelancer, habilidad.categoria, habilidad.habilidad, habilidad.nivel_habilidad
            ]
        );
    });
    await Promise.all(habilidadPromises);

    // Insertar en la tabla 'curso'
    await pool.query(
        `INSERT INTO curso (id_freelancer, nombre_curso, institucion, ano_inicio, mes_inicio) VALUES (?, ?, ?, ?, ?)`,
        [
            id_freelancer, curso.nombre_curso, curso.institucion_curso, curso.ano_inicio_curso, curso.mes_inicio_curso
        ]
    );

    // Insertar en la tabla 'pretensiones'
    await pool.query(
        `INSERT INTO pretensiones (id_freelancer, disponibilidad, renta_esperada) VALUES (?, ?, ?)`,
        [
            id_freelancer, pretensiones.disponibilidad, pretensiones.renta_esperada
        ]
    );
    await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function getCvUrlFromDB(idFreelancer) {
  const [result] = await pool.query(
      'SELECT cv_url FROM freelancer WHERE id_freelancer = ?',
      [idFreelancer]
  );
  return result.length > 0 ? result[0].cv_url : null;
}


module.exports = {
  pool,          // Exporta el pool de conexiones
  insertarUsuario, // Exporta la función insertarUsuario
  getUserById,
  getEmpresaByUserId,
  getFreelancerByUserId,
  getRepresentanteByUserId,
  checkDuplicateProject,
  extraerDato,
  extraerTelefono,
  extraerDescripcion,
  extraerIdiomas,
  extraerHabilidades,
  extraerEducacion,
  extraerExperiencia,
  getCvUrlFromDB,
  guardarPerfilEnDB
};
