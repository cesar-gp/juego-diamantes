/**
 *	Práctica 4.1. Juego de los diamantes.
 *	
 *	Lenguajes de marca
 *	Grado Superior en Desarrollo de Aplicaciones Multiplataforma
 *	Curso 1º (2025-2026)
 * 
 *	César Gutiérrez
 */

// Constantes

/**
 *	Posibles colores de un diamante, definidos como clases CSS.
 */
const colores = [
	'color-rojo',
	'color-verde',
	'color-azul',
	'color-amarillo',
	'color-naranja',
	'color-morado'
];

// Variables globales

/**
 *	Número de columnas del tablero.
 */
let cols = 0;

/**
 *	Número de filas del tablero.
 */
let rows = 0;

// Funciones

/**
 *	Devuelve el diamante ubicado en la posición
 *	proporcionada.
 */
function getDiamante(x, y) {
	return document.getElementById("diamante-" + x + "-" + y);
}

/**
 *	Devuelve el color del diamante ubicado en la
 *	posición proporcionada.
 */
function getColorDiamante(x, y) {
	return getDiamante(x, y).classList[1];
}

/**
 *	Devuelve un color aleatorio de entre los que
 *	se incluyen en la lista 'colores'.
 */
function getColorAleatorio() {
	return colores[Math.floor(Math.random() * colores.length)];
}

/**
 *	Devuelve un color aleatorio válido para el
 *	diamante situado en las coordenadas proporcionadas.
 * 
 *	Se entiende como "válido" un color incluido en
 *	la lista 'colores' que no coincida con un color
 *	que compartan los dos bloques hacia arriba o los
 *	dos bloques hacia la derecha.
 * 
 *	Esta función previene que el tablero se cree
 *	con trios formados al principio del juego.
 */
function obtenerColorValidoAleatorio(x, y) {
	// Validar coordenadas.
	if((x < 0 || x >= rows) ||
		(y < 0 || y >= cols)) return null;
	
	// Obtener color aleatorio.
	color = getColorAleatorio();

	// Comprobar las dos casillas a la izquierda.
	if(x >= 2 &&
		getColorDiamante(x - 1, y) == color &&
		getColorDiamante(x - 2, y) == color)
		return obtenerColorValidoAleatorio(x, y);
	
	// Comprobar las dos casillas hacia arriba.
	if(y >= 2 &&
		getColorDiamante(x, y - 1) == color &&
		getColorDiamante(x, y - 2) == color)
		return obtenerColorValidoAleatorio(x, y);

	// Devolver color.
	return color;
}

/**
 *	Devuelve un <div> con la clase 'diamante'
 *	y todas las propiedades que posibilitan su
 *	funcionamiento como parte del tablero.
 */
function initDiamante(x, y) {
	// Validar coordenadas.
	if((x < 0 || x >= rows) ||
		(y < 0 || y >= cols)) return null;

	// Crear el elemento <div>.
	out = document.createElement("div");

	// Asignar atributos del elemento.
	out.classList.add("diamante");
	out.dataset.col = x;
	out.dataset.fila = y;
	out.id = "diamante-" + x + "-" + y;

	// Asignar propiedades CSS.
	out.classList.add(obtenerColorValidoAleatorio(x, y));

	// Devolver el elemento.
	return out;
}

/**
 *	Limpia el tablero y lo llena de diamantes,
 *	respetando los números de columnas y filas
 *	proporcionados en los argumentos.
 */
function resetTablero(newCols, newRows) {
	// Asignar propiedades globales.
	cols = newCols;
	rows = newRows;

	// Conseguir el tablero.
	tablero = document.getElementById("tablero");

	// Asignar propiedades CSS.
	tablero.style.gridTemplateColumns = "repeat(" + cols + ", 60px)";
	tablero.style.gridTemplateRows = "repeat(" + rows + ", 60px)";

	// Recorrer usando un 'for' anidado.
	for(let y = 0; y < rows; y++)
		for(let x = 0; x < cols; x++)
			tablero.appendChild(initDiamante(x, y));
}

// Script

resetTablero(8, 8);