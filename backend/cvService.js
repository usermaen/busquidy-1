const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { pool, 
    extraerDato, 
    extraerTelefono,
    extraerDescripcion, 
    extraerIdiomas,
    extraerHabilidades, 
    extraerEducacion, 
    extraerExperiencia,
} = require('./db');

async function procesarArchivoCV(file) {
    let extractedText = '';

    if (file.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(file.path);
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
    } else if (
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'application/msword'
    ) {
        const dataBuffer = fs.readFileSync(file.path);
        const docData = await mammoth.extractRawText({ buffer: dataBuffer });
        extractedText = docData.value;
    } else {
        throw new Error('Formato de archivo no soportado.');
    }

    return extractedText;
}

// Función para dividir el nombre completo
function dividirNombreCompleto(nombreCompleto) {
    if (typeof nombreCompleto !== 'string' || !nombreCompleto.trim()) {
        return { nombres: 'No especificado', apellidos: 'No especificado' };
    }

    const partes = nombreCompleto.trim().split(/\s+/); // Divide por cualquier espacio
    if (partes.length < 2) {
        return { nombres: nombreCompleto, apellidos: '' };
    }

    const apellidos = partes.slice(-2).join(' '); // Últimos dos como apellidos
    const nombres = partes.slice(0, -2).join(' '); // Resto como nombres
    return { nombres, apellidos };
}

// Función para procesar el texto extraído del CV
async function procesarCV(texto) {
    // Intenta extraer el nombre completo con una expresión regular más flexible
    const regexNombreCompleto = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s[A-ZÁÉÍÓÚÑa-záéíóúñ]+)+$/m;
    let nombreCompleto = extraerDato(texto, regexNombreCompleto) || 'No especificado';

    if (nombreCompleto === 'No especificado') {
        console.warn('No se pudo extraer un nombre completo válido del texto.');
    }

    // Divide nombres y apellidos
    const { nombres, apellidos } = dividirNombreCompleto(nombreCompleto);

    const linkedIn = extraerDato(texto, /Linkedin:\s*(https?:\/\/[^\s]+)/i);
    const correo = [...texto.matchAll(/[\w.-]+@[\w.-]+\.\w+/g)].map(match => match[0]);
    const descripcion = extraerDescripcion(texto);
    const telefono = extraerTelefono(texto, /(?:\+\d{1,3}\s?)?(?:\(?\d{1,3}\)?\s?)?\d{7,10}/);
    const ciudad = extraerDato(texto, /^Santiago – Lo prado$/m) || 'No especificada';
    const nacionalidad = extraerDato(texto, /Nacionalidad\s+(.+)/i) || 'No especificada';
    const estado_civil = extraerDato(texto, /Estado Civil\s+(.+)/i) || 'No especificado';
    const fecha_nacimiento = extraerDato(texto, /Fecha de Nacimiento\s+(.+)/i) || 'No especificado';
    const identificacion = extraerDato(texto, /RUN\s+(.+)/i) || 'No especificado';
    const disponibilidad = extraerDato(texto, /DISPONIBILIDAD\s+(.+)/i) || 'No especificado';
    const renta_esperada = extraerDato(texto, /RENTA ESPERADA\s+(.+)/i) || 'No especificado';

    const perfilData = {
        freelancer: { correo, telefono, linkedIn, descripcion },
        antecedentesPersonales: { nombres, apellidos, fecha_nacimiento, identificacion, nacionalidad, ciudad, estado_civil },
        idiomas: extraerIdiomas(texto),
        habilidades: extraerHabilidades(texto),
        formacion: extraerEducacion(texto, /ANTECEDENTES ACADÉMICOS\s+([\s\S]*?)(?:\n\n|$)/i),
        experienciaLaboral: extraerExperiencia(texto, /EXPERIENCIA LABORAL\s+([\s\S]*?)(?:\n\n|$)/i),
        inclusionLaboral: extraerDato(texto, /Inclución Laboral\s+(.+)/i) || 'No especificado',
        cursos: extraerDato(texto, /Cursos\s+(.+)/i) || 'No especificado',
        pretensiones: { disponibilidad, renta_esperada }
    };

    console.log('Datos extraídos del CV:', perfilData);
    return perfilData;
}


module.exports = { procesarArchivoCV, procesarCV };
