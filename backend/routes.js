const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken, upload  } = require('./middlewares/auth');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const router = express.Router();
const fs = require('fs');
const { procesarArchivoCV, procesarCV } = require('./cvService');
const { pool, 
    insertarUsuario, 
    getUserById, 
    getEmpresaByUserId,
    getFreelancerByUserId, 
    getRepresentanteByUserId, 
    checkDuplicateProject,
    guardarPerfilEnDB,
} = require('./db');

// Clave secreta JWT (puedes usar directamente process.env.JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET;
console.log('JWT_SECRET:', JWT_SECRET);
if (!JWT_SECRET) throw new Error('JWT_SECRET no está configurado');

// Registro de usuarios
router.post('/register', async (req, res) => {
    const { correo, contraseña, tipo_usuario } = req.body;
  
    try {
      // Verificar si el correo ya existe
      const [result] = await pool.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
      if (result.length > 0) {
        return res.status(400).json({ error: 'Correo ya registrado' });
      }
  
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      console.log('Contraseña hasheada:', hashedPassword);

  
      // Insertar usuario usando la función creada
      console.log('Correo:', correo, 'Tipo de usuario:', tipo_usuario);
      const id_usuario = await insertarUsuario(correo, hashedPassword, tipo_usuario);
      console.log('ID Usuario insertado:', id_usuario);

      // Crear perfil dependiendo del tipo de usuario
      if (tipo_usuario === 'empresa') {
        await pool.query('INSERT INTO empresa (id_usuario) VALUES (?)', [id_usuario]);
        res.status(201).json({ message: 'Usuario empresa registrado exitosamente' });
      } else if (tipo_usuario === 'freelancer') {
        await pool.query('INSERT INTO freelancer (id_usuario) VALUES (?)', [id_usuario]);
        res.status(201).json({ message: 'Usuario freelancer registrado exitosamente' });
      } else {
        res.status(400).json({ error: 'Tipo de usuario no válido' });
      }
    } catch (error) {
      console.error('Error en /register:', error.message);
      res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.post('/login', async (req, res) => {
    const { correo, contraseña } = req.body;
    console.log('Correo recibido:', correo);
  
    try {
      // Verificar si el correo existe
      const [result] = await pool.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      const user = result[0];
      console.log('Hash almacenado:', user.contraseña);
  
      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
      console.log('¿Contraseña válida?', isPasswordValid);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
  
      // Generar token JWT
      const token = jwt.sign({ id_usuario: user.id_usuario, tipo_usuario: user.tipo_usuario }, JWT_SECRET, {
        expiresIn: '2h',
      });
  
      res.status(200).json({ message: 'Inicio de sesión exitoso', token, tipo_usuario: user.tipo_usuario });
    } catch (error) {
      console.error('Error en /login:', error.message);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });  

// Crear proyecto
router.post('/create-project', verifyToken, async (req, res) => {
    const { projectData, id_usuario } = req.body;
  
    if (!id_usuario) {
      console.error('Error: id_usuario es undefined o null');
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }
  
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction(); // Inicia la transacción
  
      // Verificar usuario
      const userCheckResults = await getUserById(id_usuario);
      if (userCheckResults.length === 0) {
        await connection.rollback(); // Revierte la transacción si ocurre un error
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      const tipo_usuario = userCheckResults[0].tipo_usuario;
      if (tipo_usuario !== 'empresa') {
        await connection.rollback();
        return res.status(403).json({ error: 'Acceso no autorizado' });
      }
  
      // Obtener `id_empresa`
      const empresaResults = await getEmpresaByUserId(id_usuario);
      if (empresaResults.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Empresa no encontrada' });
      }
  
      const id_empresa = empresaResults[0].id_empresa;
  
      // Verificar duplicados
      const projectCheckResults = await checkDuplicateProject(id_empresa, projectData);
      if (projectCheckResults.length > 0) {
        await connection.rollback();
        return res.status(409).json({ error: 'Proyecto duplicado encontrado' });
      }
  
      // Insertar proyecto
      const [insertProjectResult] = await connection.query(
        `INSERT INTO proyecto 
           (id_empresa, titulo, descripcion, categoria, habilidades_requeridas, presupuesto, 
            duracion_estimada, fecha_limite, ubicacion, tipo_contratacion, metodologia_trabajo)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
  
      const id_proyecto = insertProjectResult.insertId;
  
      // Crear publicación
      await connection.query(
        `INSERT INTO publicacion_proyecto (id_proyecto, fecha_publicacion, estado_publicacion)
         VALUES (?, CURDATE(), 'activo')`,
        [id_proyecto]
      );
  
      await connection.commit(); // Confirma la transacción
      console.log('Proyecto y publicación creados con éxito');
      res.status(201).json({
        message: 'Proyecto y publicación creados con éxito',
        projectId: id_proyecto,
      });
    } catch (err) {
      console.error('Error al crear el proyecto:', err);
      if (connection) await connection.rollback();
      res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
      if (connection) await connection.release();
    }
  });  

  router.put('/api/proyecto/estado/:id_proyecto', async (req, res) => {
    const { id_proyecto } = req.params;
    const { nuevoEstado } = req.body; // El estado al que se desea cambiar

    try {
        await pool.query('UPDATE proyectos SET estado_publicacion = ? WHERE id_proyecto = ?', [nuevoEstado, id_proyecto]);
        res.status(200).json({ message: 'Estado del proyecto actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar el estado:', error);
        res.status(500).json({ message: 'Error al actualizar el estado del proyecto' });
    }
});


// Ruta para traer los proyectos con su estado de publicación
router.get('/proyectos/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    console.log('id_usuario:', id_usuario);

    if (!id_usuario) {
      console.error('Error: id_usuario es undefined o null');
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    try {
      // Verificar usuario
      const userCheckResults = await getUserById(id_usuario);
      if (userCheckResults.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const tipo_usuario = userCheckResults[0].tipo_usuario;
      if (tipo_usuario !== 'empresa') {
        return res.status(403).json({ error: 'Acceso no autorizado' });
      }

      // Obtener `id_empresa`
      const empresaResults = await getEmpresaByUserId(id_usuario);
      if (empresaResults.length === 0) {
        return res.status(404).json({ error: 'Empresa no encontrada' });
      }

      const id_empresa = empresaResults[0].id_empresa;

      // Obtener los proyectos asociados a la empresa
      const [projectResults] = await pool.query(
        'SELECT * FROM proyecto WHERE id_empresa = ?',
        [id_empresa]
      );

      if (projectResults.length === 0) {
        console.log('No se encontraron proyectos');
        return res.status(404).json({ error: 'No se encontraron proyectos' });
      }

      // Obtener los estados de publicación de los proyectos
      const projectIds = projectResults.map(proyecto => proyecto.id_proyecto);
      const [publicationResults] = await pool.query(
        'SELECT id_proyecto, estado_publicacion FROM publicacion_proyecto WHERE id_proyecto IN (?)',
        [projectIds]
      );

      // Mapear los estados de publicación a sus respectivos proyectos
      const publicationMap = new Map(publicationResults.map(pub => [pub.id_proyecto, pub.estado_publicacion]));
      const projectsWithStatus = projectResults.map(proyecto => ({
        ...proyecto,
        estado_publicacion: publicationMap.get(proyecto.id_proyecto) || 'Desconocido',
      }));

      res.json(projectsWithStatus);
    } catch (error) {
      console.error('Error al obtener proyectos:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

// Ruta para traer las publicaciones
router.get('/publicacion', async (req, res) => {
    try {
        const getProjectsQuery = 'SELECT * FROM proyecto';
        
        // Consultar los proyectos
        const [projectResults] = await pool.query(getProjectsQuery);

        if (projectResults.length === 0) {
            return res.status(404).json({ error: 'No se encontraron proyectos' });
        }

        // Obtener los IDs de los proyectos
        const projectIds = projectResults.map(proyecto => proyecto.id_proyecto);
        const getPublicationsQuery = `
            SELECT id_proyecto, estado_publicacion 
            FROM publicacion_proyecto 
            WHERE id_proyecto IN (?)
        `;

        // Consultar los estados de publicación
        const [publicationResults] = await pool.query(getPublicationsQuery, [projectIds]);

        // Mapear los estados de publicación a sus respectivos proyectos
        const projectsWithStatus = projectResults.map(proyecto => {
            const publicacion = publicationResults.find(pub => pub.id_proyecto === proyecto.id_proyecto);
            return {
                ...proyecto,
                estado_publicacion: publicacion ? publicacion.estado_publicacion : 'Desconocido'
            };
        });

        res.json(projectsWithStatus);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
});

// Ruta para eliminar proyecto
router.delete('/proyecto/:id_proyecto', async (req, res) => {
    const { id_proyecto } = req.params;
    console.log('id_proyecto:', id_proyecto);

    let connection;
    try {
        connection = await pool.getConnection();

        // Verificar si el proyecto existe antes de eliminarlo
        const [projectResults] = await connection.query(
            'SELECT * FROM proyecto WHERE id_proyecto = ?',
            [id_proyecto]
        );

        if (projectResults.length === 0) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        console.log('Proyecto encontrado, listo para eliminar:', projectResults[0]);

        // Iniciar transacción
        await connection.beginTransaction();

        // Eliminar la publicación relacionada en la tabla `publicacion_proyecto`
        const [deletePublicationResult] = await connection.query(
            'DELETE FROM publicacion_proyecto WHERE id_proyecto = ?',
            [id_proyecto]
        );
        console.log('Publicación eliminada correctamente:', deletePublicationResult);

        // Eliminar el proyecto de la tabla `proyecto`
        const [deleteProjectResult] = await connection.query(
            'DELETE FROM proyecto WHERE id_proyecto = ?',
            [id_proyecto]
        );
        console.log('Proyecto eliminado correctamente:', deleteProjectResult);

        // Confirmar los cambios
        await connection.commit();

        res.status(200).json({ message: 'Proyecto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);

        if (connection) {
            // Revertir los cambios en caso de error
            await connection.rollback();
        }

        res.status(500).json({ error: 'Error al eliminar el proyecto' });
    } finally {
        if (connection) {
            await connection.release();
        }
    }
});

// Ruta para Editar proyecto


// Ruta para ver si existe perfil empresa
router.get('/empresa/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    try {
        // Verificar usuario
        const userCheckResults = await getUserById(id_usuario);
        if (userCheckResults.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        console.log('Usuario encontrado');

        const { tipo_usuario } = userCheckResults[0];
        if (tipo_usuario !== 'empresa') {
            return res.status(403).json({ error: 'Acceso no autorizado' });
        }

        // Obtener datos de la empresa
        const [empresaResults] = await pool.query(
            `SELECT nombre_empresa, identificacion_fiscal, direccion, telefono_contacto, 
                    correo_empresa, pagina_web, descripcion, sector_industrial 
             FROM empresa 
             WHERE id_usuario = ?`,
            [id_usuario]
        );

        if (empresaResults.length === 0) {
            return res.status(404).json({ error: 'Datos no encontrados' });
        }

        const perfilEmpresa = empresaResults[0];
        const isPerfilIncompleto = Object.values(perfilEmpresa).some(value => !value);

        res.json({ isPerfilIncompleto });
    } catch (error) {
        console.error('Error al verificar el perfil de la empresa:', error);
        res.status(500).json({ error: 'Error al verificar el perfil de la empresa' });
    }
});

// Ruta para ver si existe perfil freelancer
router.get('/freelancer/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    try {
        // Verificar usuario
        const userCheckResults = await getUserById(id_usuario);
        if (userCheckResults.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Obtener `id_freelancer`
        const freelancerResults = await getFreelancerByUserId(id_usuario);
        if (freelancerResults.length === 0) {
            return res.status(404).json({ error: 'Freelancer no encontrado' });
        }

        const id_freelancer = freelancerResults[0].id_freelancer;

        // Verificar antecedentes personales
        const [antecedentesResults] = await pool.query(
            'SELECT * FROM antecedentes_personales WHERE id_freelancer = ?',
            [id_freelancer]
        );

        const isPerfilIncompleto = antecedentesResults.length === 0;

        res.json({ isPerfilIncompleto });
    } catch (error) {
        console.error('Error al verificar el perfil del freelancer:', error);
        res.status(500).json({ error: 'Error al verificar el perfil del freelancer' });
    }
});

// Ruta para ...
router.post('/upload-cv', upload.single('cv'), async (req, res) => {
    const file = req.file;
    const id_usuario = req.body.id_usuario;

    console.log('Archivo recibido:', req.file);
    console.log('Cuerpo de la solicitud (req.body):', req.body);

    if (!file) {
        return res.status(400).json({ error: 'No se ha proporcionado ningún archivo.' });
    }

    try {
        const cv_url = `/uploads/cvs/${file.filename}`;
        let extractedText = "";

        // Procesar PDF
        if (file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(file.path);
            const pdfData = await pdfParse(dataBuffer);
            extractedText = pdfData.text;
        }
        // Procesar archivos Word
        else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype === 'application/msword') {
            const dataBuffer = fs.readFileSync(file.path);
            const docData = await mammoth.extractRawText({ buffer: dataBuffer });
            extractedText = docData.value;
        }
        // Formato no soportado
        else {
            // Limpia el archivo subido
            fs.unlinkSync(file.path);
            return res.status(400).json({ error: 'Formato de archivo no soportado.' });
        }

        // Obtener `id_freelancer`
        const freelancerResults = await getFreelancerByUserId(id_usuario);
        if (freelancerResults.length === 0) {
            return res.status(404).json({ error: 'Freelancer no encontrado' });
        }

        const id_freelancer = freelancerResults[0].id_freelancer;

        console.log('Texto extraído del archivo:', extractedText);

        // Procesar el texto extraído
        const perfilData = await procesarCV(extractedText);
        perfilData.cv_url = cv_url;
        perfilData.id_freelancer = id_freelancer;

        console.log('Datos procesados para guardar en la DB:', perfilData);

        // Guardar en la base de datos
        await guardarPerfilEnDB(perfilData);

        console.log('Perfil creado exitosamente:', perfilData);

        // Enviar la respuesta final
        return res.status(201).json({ message: 'Perfil creado exitosamente.', cv_url });
    } catch (error) {
        console.error("Error al procesar el CV:", error);

        // Limpia el archivo subido en caso de error
        if (file && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        // Enviar la respuesta de error
        return res.status(500).json({ error: 'Error al procesar el archivo.' });
    }
});

// Recuperar la URL del CV desde la base de datos
router.get('/freelancer/:id/cv', async (req, res) => {
    const idFreelancer = req.params.id;

    try {
        const [result] = await pool.query(
            'SELECT cv_url FROM freelancer WHERE id_freelancer = ?',
            [idFreelancer]
        );

        if (result.length > 0) {
            res.status(200).json({ cv_url: result[0].cv_url });
        } else {
            res.status(404).json({ error: 'Freelancer no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener la URL del CV:', error);
        res.status(500).json({ error: 'Error al obtener el CV' });
    }
});

// Función para crear el perfil de freelancer en múltiples tablas
router.post('/create-perfil-freelancer', verifyToken, async (req, res) => {
    const {
        freelancer, 
        antecedentes_personales, 
        inclusion_laboral, 
        emprendimiento, 
        trabajo_practica, 
        nivel_educacional, 
        educacion_superior, 
        educacion_basica_media, 
        idiomas, 
        habilidades, 
        curso, 
        pretensiones,
        id_usuario
    } = req.body;

    console.log("Datos enviados al backend:", req.body);

    // Verificar que id_usuario no sea undefined o null
    if (!id_usuario) {
        console.log('Error: id_usuario es undefined o null');
        return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    try {
        // Verificar usuario
        const userCheckResults = await getUserById(id_usuario);
        if (userCheckResults.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        console.log('Usuario encontrado');

        // Obtener id_freelancer
        const freelancerResults = await getFreelancerByUserId(id_usuario);
        if (freelancerResults.length === 0) {
            return res.status(404).json({ error: 'Freelancer no encontrado' });
        }

        const id_freelancer = freelancerResults[0].id_freelancer;
        console.log('ID de freelancer obtenido:', id_freelancer);

        // Actualizar descripción en la tabla freelancer
        await pool.query('UPDATE freelancer SET descripcion = ? WHERE id_freelancer = ?', [freelancer.descripcion_freelancer, id_freelancer]);

        // Insertar en la tabla 'antecedentes_personales'
        await pool.query(`
            INSERT INTO antecedentes_personales (id_freelancer, nombres, apellidos, fecha_nacimiento, identificacion, nacionalidad, ciudad, comuna, estado_civil)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        , [
            id_freelancer, antecedentes_personales.nombres, antecedentes_personales.apellidos,
            antecedentes_personales.fecha_nacimiento, antecedentes_personales.identificacion,
            antecedentes_personales.nacionalidad, antecedentes_personales.ciudad_freelancer,
            antecedentes_personales.comuna, antecedentes_personales.estado_civil
        ]);

        // Insertar en la tabla 'inclusion_laboral'
        await pool.query(`
            INSERT INTO inclusion_laboral (id_freelancer, discapacidad, registro_nacional, pension_invalidez, ajuste_entrevista, tipo_discapacidad)
            VALUES (?, ?, ?, ?, ?, ?)`
        , [
            id_freelancer, inclusion_laboral.discapacidad, inclusion_laboral.registro_nacional,
            inclusion_laboral.pension_invalidez, inclusion_laboral.ajuste_entrevista,
            inclusion_laboral.tipo_discapacidad
        ]);

        // Insertar en la tabla 'emprendimiento'
        await pool.query(`
            INSERT INTO emprendimiento (id_freelancer, emprendedor, interesado, ano_inicio, mes_inicio, sector_emprendimiento)
            VALUES (?, ?, ?, ?, ?, ?)`
        , [
            id_freelancer, emprendimiento.emprendedor, emprendimiento.interesado,
            emprendimiento.ano_inicio_emprendimiento, emprendimiento.mes_inicio_emprendimiento,
            emprendimiento.sector_emprendimiento
        ]);

        // Insertar en la tabla 'trabajo_practica'
        await pool.query(`
            INSERT INTO trabajo_practica (id_freelancer, experiencia_laboral, experiencia, empresa, cargo, area_trabajo, tipo_cargo, ano_inicio, mes_inicio, descripcion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        , [
            id_freelancer, trabajo_practica.experiencia_laboral, trabajo_practica.experiencia,
            trabajo_practica.empresa, trabajo_practica.cargo, trabajo_practica.area_trabajo,
            trabajo_practica.tipo_cargo, trabajo_practica.ano_inicio_trabajo, trabajo_practica.mes_inicio_trabajo,
            trabajo_practica.descripcion_trabajo
        ]);

        // Insertar en la tabla 'nivel_educacional'
        await pool.query(`
            INSERT INTO nivel_educacional (id_freelancer, nivel_academico, estado)
            VALUES (?, ?, ?)`
        , [
            id_freelancer, nivel_educacional.nivel_academico, nivel_educacional.estado_educacional
        ]);

        // Insertar en la tabla 'educacion_superior'
        await pool.query(`
            INSERT INTO educacion_superior (id_freelancer, institucion, carrera, carrera_afin, estado, ano_inicio, ano_termino)
            VALUES (?, ?, ?, ?, ?, ?, ?)`
        , [
            id_freelancer, educacion_superior.institucion_superior, educacion_superior.carrera,
            educacion_superior.carrera_afin, educacion_superior.estado_superior,
            educacion_superior.ano_inicio_superior, educacion_superior.ano_termino_superior
        ]);

        // Insertar en la tabla 'educacion_basica_media'
        await pool.query(`
            INSERT INTO educacion_basica_media (id_freelancer, institucion, tipo, pais, ciudad, ano_inicio, ano_termino)
            VALUES (?, ?, ?, ?, ?, ?, ?)`
        , [
            id_freelancer, educacion_basica_media.institucion_basica_media, educacion_basica_media.tipo,
            educacion_basica_media.pais, educacion_basica_media.ciudad_basica_media,
            educacion_basica_media.ano_inicio_basica_media, educacion_basica_media.ano_termino_basica_media
        ]);

        // Insertar múltiples idiomas en la tabla 'idiomas'
        const idiomaPromises = idiomas.map(idioma => {
            return pool.query(`INSERT INTO idiomas (id_freelancer, idioma, nivel) VALUES (?, ?, ?)`, [
                id_freelancer, idioma.idioma, idioma.nivel_idioma
            ]);
        });
        await Promise.all(idiomaPromises);

        // Insertar múltiples habilidades en la tabla 'habilidades'
        const habilidadPromises = habilidades.map(habilidad => {
            return pool.query(`INSERT INTO habilidades (id_freelancer, categoria, habilidad, nivel) VALUES (?, ?, ?, ?)`, [
                id_freelancer, habilidad.categoria, habilidad.habilidad, habilidad.nivel_habilidad
            ]);
        });
        await Promise.all(habilidadPromises);

        // Insertar en la tabla 'curso'
        await pool.query(`
            INSERT INTO curso (id_freelancer, nombre_curso, institucion, ano_inicio, mes_inicio) VALUES (?, ?, ?, ?, ?)`, [
            id_freelancer, curso.nombre_curso, curso.institucion_curso, curso.ano_inicio_curso, curso.mes_inicio_curso
        ]);

        // Insertar en la tabla 'pretensiones'
        await pool.query(`
            INSERT INTO pretensiones (id_freelancer, disponibilidad, renta_esperada) VALUES (?, ?, ?)`, [
            id_freelancer, pretensiones.disponibilidad, pretensiones.renta_esperada
        ]);

        console.log("Perfil freelancer creado exitosamente");
        res.status(201).json({ message: "Perfil de freelancer creado exitosamente" });

    } catch (err) {
        console.error('Error al crear el perfil:', err);
        res.status(500).json({ error: 'Error al crear el perfil de freelancer' });
    }
});

// Ruta para crear el perfil empresa
router.post('/create-perfil-empresa', verifyToken, async (req, res) => {
    const { empresaData, representanteData, id_usuario } = req.body;
  
    console.log("empresaData:", empresaData);
    console.log("representanteData:", representanteData);
    console.log("ID Usuario:", id_usuario);
  
    if (!id_usuario) {
      console.log('Error: id_usuario es undefined o null');
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }
  
    try {
      // Verificar usuario
      const userCheckResults = await getUserById(id_usuario);
      if (userCheckResults.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      console.log('Usuario encontrado');
  
      // Obtener `id_empresa`
      const empresaResults = await getEmpresaByUserId(id_usuario);
      if (empresaResults.length === 0) {
        return res.status(404).json({ error: 'Empresa no encontrada' });
      }
  
      const id_empresa = empresaResults[0].id_empresa;
      console.log('ID de Empresa obtenido:', id_empresa);
  
      // Actualizar descripción en la tabla empresa
      const updateEmpresaQuery = `
        UPDATE empresa
        SET nombre_empresa = ?, 
            identificacion_fiscal = ?, 
            direccion = ?, 
            telefono_contacto = ?, 
            correo_empresa = ?, 
            pagina_web = ?, 
            descripcion = ?, 
            sector_industrial = ?
        WHERE id_empresa = ?;
      `;
      await pool.query(updateEmpresaQuery, [
        empresaData.nombre_empresa, empresaData.identificacion_fiscal,
        empresaData.direccion, empresaData.telefono_contacto, empresaData.correo_empresa,
        empresaData.pagina_web, empresaData.descripcion, empresaData.sector_industrial, id_empresa
      ]);
  
      const insertRepresentanteQuery = `
        INSERT INTO representante_empresa (id_empresa, nombre_completo, cargo, correo_representante, telefono_representante)
        VALUES (?, ?, ?, ?, ?)
      `;
      await pool.query(insertRepresentanteQuery, [
        id_empresa, representanteData.nombre_completo, representanteData.cargo, 
        representanteData.correo_representante, representanteData.telefono_representante
      ]);
  
      console.log("Perfil empresa creado exitosamente");
      res.status(201).json({ message: "Perfil de empresa creado exitosamente" });
  
    } catch (err) {
      console.error('Error al crear el perfil de la empresa:', err);
      res.status(500).json({ error: 'Error al crear el perfil de empresa' });
    }
  });

// Ruta para traer el perfil de la empresa y el representante
router.get('/perfil-empresa/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    console.log('id_usuario:', id_usuario);

    if (!id_usuario) {
        console.log('Error: id_usuario es undefined o null');
        return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    try {
        // Verificar usuario
        const perfilUsuarioResults = await getUserById(id_usuario);
        if (perfilUsuarioResults.length === 0) {
            return res.status(404).json({ error: 'No se encontró el perfil usuario' });
        }

        // Obtener el perfil de la empresa
        const perfilEmpresaResults = await getEmpresaByUserId(id_usuario);
        if (perfilEmpresaResults.length === 0) {
            return res.status(404).json({ error: 'No se encontró el perfil de la empresa' });
        }

        const id_empresa = perfilEmpresaResults[0].id_empresa;
        console.log('id_empresa:', id_empresa);

        // Obtener el perfil del representante
        const perfilRepresentanteResults = await getRepresentanteByUserId(id_empresa);
        if (perfilRepresentanteResults.length === 0) {
            return res.status(404).json({ error: 'No se encontró el perfil representante' });
        }
        console.log('pefil:', perfilUsuarioResults[0],perfilEmpresaResults[0],perfilRepresentanteResults[0]);

        // Enviar ambos perfiles en la respuesta
        res.json({
            perfilUsuario: perfilUsuarioResults[0],
            perfilEmpresa: perfilEmpresaResults[0],
            perfilRepresentante: perfilRepresentanteResults[0],
        });
    } catch (error) {
        console.log('Error al obtener los perfiles:', error);
        res.status(500).json({ error: 'Error al obtener los perfiles' });
    }
});

// Ruta para obtener el perfil del freelancer
router.get('/perfil-freelancer/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;

  // Validar que el id_usuario sea válido
  if (!id_usuario || isNaN(id_usuario)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
  }

  try {
      // Verificar usuario
      const perfilUsuarioResults = await getUserById(id_usuario);
      if (perfilUsuarioResults.length === 0) {
          return res.status(404).json({ error: 'No se encontró el usuario' });
      }

      // Obtener freelancer
      const perfilFreelancerResults = await getFreelancerByUserId(id_usuario);
      if (perfilFreelancerResults.length === 0) {
          return res.status(404).json({ error: 'No se encontró el freelancer' });
      }
      const id_freelancer = perfilFreelancerResults[0].id_freelancer;

      // Consultar datos adicionales de las tablas relacionadas (opcional)
      const [antecedentes] = await pool.query(`
          SELECT * FROM antecedentes_personales WHERE id_freelancer = ?
      `, [id_freelancer]);

      const [inclusionLaboral] = await pool.query(`
          SELECT * FROM inclusion_laboral WHERE id_freelancer = ?
      `, [id_freelancer]);

      const [emprendimiento] = await pool.query(`
          SELECT * FROM emprendimiento WHERE id_freelancer = ?
      `, [id_freelancer]);

      const [trabajoPractica] = await pool.query(`
          SELECT * FROM trabajo_practica WHERE id_freelancer = ?
      `, [id_freelancer]);

      const [nivelEducacional] = await pool.query(`
          SELECT * FROM nivel_educacional WHERE id_freelancer = ?
      `, [id_freelancer]);

      const [educacionSuperior] = await pool.query(`
          SELECT * FROM educacion_superior WHERE id_freelancer = ?
      `, [id_freelancer]);

      const [educacionBasica] = await pool.query(`
          SELECT * FROM educacion_basica_media WHERE id_freelancer = ?
      `, [id_freelancer]);

      const [idiomas] = await pool.query(`
          SELECT * FROM idiomas WHERE id_freelancer = ?
      `, [id_freelancer]);

      const [habilidades] = await pool.query(`
          SELECT * FROM habilidades WHERE id_freelancer = ?
      `, [id_freelancer]);

      const [cursos] = await pool.query(`
          SELECT * FROM curso WHERE id_freelancer = ?
      `, [id_freelancer]);

      const [pretensiones] = await pool.query(`
          SELECT * FROM pretensiones WHERE id_freelancer = ?
      `, [id_freelancer]);

      // Consolidar los datos en una sola respuesta
      res.json({
          usuario: perfilUsuarioResults[0],
          freelancer: perfilFreelancerResults[0],
          antecedentesPersonales: antecedentes[0],
          inclusionLaboral: inclusionLaboral[0],
          emprendimiento: emprendimiento[0],
          trabajoPractica: trabajoPractica[0],
          nivelEducacional: nivelEducacional[0],
          educacionSuperior: educacionSuperior[0],
          educacionBasicaMedia: educacionBasica[0],
          idiomas: idiomas,
          habilidades: habilidades,
          curso: cursos[0],
          pretensiones: pretensiones[0]
      });
  } catch (error) {
      console.error('Error al obtener el perfil del freelancer:', error);
      res.status(500).json({ error: 'Error al obtener el perfil del freelancer' });
  }
});

// Ruta para buscar freelancers
router.get('/freelancer', async (req, res) => {
    const getFreelancerQuery = `
        SELECT 
            f.id_freelancer AS id_freelancer,
            ap.nombres AS nombres,
            ap.apellidos AS apellidos,
            ap.nacionalidad AS nacionalidad,
            ap.ciudad AS ciudad,
            ap.comuna AS comuna,
            f.calificacion_promedio AS calificacion_promedio,
            f.descripcion AS descripcion
        FROM freelancer AS f
        JOIN antecedentes_personales AS ap ON f.id_freelancer = ap.id_freelancer
    `;

    try {
        // Usar el pool para ejecutar la consulta
        const [results] = await pool.query(getFreelancerQuery);  // Cambié 'db' a 'pool'

        if (results.length === 0) {
            return res.status(404).json({ error: 'No se encontraron freelancers' });
        }

        // Procesar los resultados para solo enviar el primer nombre y apellido
        const freelancers = results.map(freelancer => ({
            id_freelancer: freelancer.id_freelancer,
            nombre: freelancer.nombres,
            apellido: freelancer.apellidos,
            nacionalidad: freelancer.nacionalidad,
            ciudad: freelancer.ciudad,
            comuna: freelancer.comuna,
            calificacion_promedio: freelancer.calificacion_promedio,
            descripcion: freelancer.descripcion
        }));

        res.json(freelancers);
    } catch (error) {
        console.log('Error al obtener los freelancers:', error);
        return res.status(500).json({ error: 'Error al obtener los freelancers' });
    }
});

module.exports = router;