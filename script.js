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

const DEF_COLS = 8;
const DEF_ROWS = 8;

const DIR_TOP = direccion(0, -1);
const DIR_RIGHT = direccion(1, 0);
const DIR_BOTTOM = direccion(0, 1);
const DIR_LEFT = direccion(-1, 0);

const MAX_PUNTUACION = 1000;

/**
 *	Posibles colores de un diamante, definidos
 *	como nombres de clases CSS.
 *
 *	Este array está incluido forma parte del
 *	enunciado del propio ejercicio.
 * 
 *	Referencia: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/Pr%C3%A1cticas/01/#tarea-1-generar-el-tablero-en-el-dom
 */
const colores = [
	'color-rojo',
	'color-verde',
	'color-azul',
	'color-amarillo',
	'color-naranja',
	'color-morado'
];

/**
 *	Tablero del juego.
 * 
 *	Está definido en el documento HTML y se
 *	asume que nunca puede estar indefinido
 *	o tener un valor nulo.
 * 
 *	Referencia: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/ut4/#manipular-elementos-html
 */
const tablero = document.getElementById("tablero");

/**
 *	Indicador de puntuación.
 * 
 *	Está definido en el documento HTML y se
 *	asume que nunca puede estar indefinido
 *	o tener un valor nulo.
 * 
 *	Referencia: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/ut4/#manipular-elementos-html
 */
const indicadorPuntuacion = document.getElementById("puntuacion");

// Variables globales

/**
 *	Puntuación del jugador.
 * 
 *	Definir esto fuera del DOM va en contra de la
 *	"regla de oro" establecida en el enunciado, pero
 *	el enunciado de la tarea 5 así lo requiere.
 * 
 *	Referencia 1: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/Pr%C3%A1cticas/01/#introduccion
 *	Referencia 2: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/Pr%C3%A1cticas/01/#tarea-5-sistema-de-puntuacion
 */
let puntuacion = 0;

/**
 *	Si el juego está en curso o no.
 * 
 *	Cuando el juego se "apaga", el tablero
 *	deja de recibir clicks del usuario.
 * 
 *	Asumo que si la tarea 5 permite crear una variable
 *	global, definir esto fuera del DOM tampoco va
 *	contra la "regla del oro" del enunciado.
 */
let encendido = true;

// Funciones: arreglos para el desastre de tipos de JavaScript.

/**
 *	Convierte una String a un valor numérico
 *	usando únicamente el operador '+', que
 *	forma parte de JavaScript nativo.
 * 
 *	Este método no está incluido en los apuntes,
 *	pero se prohibió explícitamente el uso de
 *	'parseInt()' en la clase del 12/03/2026.
 *
 *	AVISO: si la String proporcionada no es un
 *	número, el método devolverá simplemente esa
 *	misma String con un símbolo de adición ('+')
 *	delante del texto que contenía.
 *
 *	Referencia externa: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unary_plus
 */
function numero(str) {
	return +str;
}

// Funciones: sistema de coordenadas.

/**
 *	Comprueba si un objeto tiene una estructura
 *	válida para considerarse como coordenadas.
 * 
 *	Debe tener una 'x' y una 'y' mayores que 0
 *	y menores que las columnas y filas del
 *	tablero, respectivamente.
 */
function validarCoordenadas(coord) {
	return coord != null &&
		coord != undefined &&
		coord.x >= 0 &&
		coord.y >= 0 &&
		tablero.dataset.cols != undefined &&
		tablero.dataset.rows != undefined &&
		coord.x < tablero.dataset.cols &&
		coord.y < tablero.dataset.rows;
}

/**
 *	Comprueba si un objeto tiene una estructura
 *	válida para considerarse como dirección.
 * 
 *	Debe tener una 'x' y una 'y' que estén entre
 *	-1 y 1. Además, el valor absoluto de las
 *	mismas no debe coincidir.
 */
function validarDireccion(dir) {
	return dir != null &&
		dir != undefined &&
		dir.x >= -1 &&
		dir.y >= -1 &&
		dir.x <= 1 &&
		dir.y <= 1 &&
		dir.x != dir.y &&
		dir.x != -dir.y;
}

/**
 *	Construye un par de coordenadas validado.
 * 
 *	Referencia: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/ut4/#objeto
 */
function coordenadas(x, y) {
	let out = {
		x: x,
		y: y
	}

	return validarCoordenadas(out) ? out : null;
}

/**
 *	Construye una dirección validada.
 * 
 *	Referencia: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/ut4/#objeto
 */
function direccion(x, y) {
	let out = {
		x: x,
		y: y
	}

	return validarDireccion(out) ? out : null;
}

/**
 *	Devuelve las coordenadas resultantes de
 *	"moverse" desde 'coord' en dirección 'dir'
 *	el número de bloques 'distancia'.
 * 
 *	En otros términos: multiplica las coordenadas
 *	de la dirección por la distancia y suma el
 *	resultado a las coordenadas proporcionadas.
 * 
 *	Si las coordenadas resultantes no son válidas
 *	(es decir, se "sale del tablero"), la función
 *	devolverá un valor nulo.
 */
function mover(coord, dir, distancia) {
	if(!validarCoordenadas(coord)) return null;
	if(!validarDireccion(dir)) return null;

	let out = coordenadas(
		coord.x + (dir.x * distancia),
		coord.y + (dir.y * distancia)
	);

	return out;
}

// Funciones: getters para elementos y atributos del DOM.

/**
 *	Devuelve un color aleatorio de entre los que
 *	se incluyen en la lista 'colores'.
 * 
 *	El cuerpo de esta función forma parte del
 *	propio enunciado del ejercicio.
 * 
 *	Referencia: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/Pr%C3%A1cticas/01/#tarea-1-generar-el-tablero-en-el-dom
 */
function colorAleatorio() {
	return colores[Math.floor(Math.random() * colores.length)];
}

/**
 *	Devuelve el diamante ubicado en la posición
 *	proporcionada.
 * 
 *	El operador ternario ('?') se usa aquí y en
 *	más partes del ejercicio. Es una abreviación
 *	de un bloque if-else y lo hemos dado en Java.
 * 
 *	Referencia externa: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
 */
function diamante(coord) {
	return validarCoordenadas(coord) ?
		document.getElementById("diamante-" + coord.x + "-" + coord.y) :
		null;
}

/**
 *	Devuelve las coordenadas de un diamante.
 *	Es decir, su "posición" en el tablero.
 * 
 *	Si la columna o la fila del diamante no
 *	han sido inicializadas, devuelve un valor
 *	nulo. Además, convierte las propiedades
 *	a su valor numérico usando 'numero()'.
 */
function posicion(diamante) {
	if(diamante.dataset.col == undefined ||
		diamante.dataset.fila == undefined) return null;

	return coordenadas(numero(diamante.dataset.col), numero(diamante.dataset.fila));
}

/**
 *	Devuelve un color aleatorio válido para el
 *	diamante situado en las coordenadas proporcionadas.
 * 
 *	Se entiende como "válido" un color incluido en
 *	la lista 'colores' que no coincida con un color
 *	que compartan los dos bloques hacia arriba o los
 *	dos bloques hacia la izquierda.
 * 
 *	Esta función previene que el tablero se cree
 *	con trios formados al principio del juego.
 * 
 *	Es equivalente a la función
 * 'obtenerColorValidoAleatorio(x, y)' requerida en
 *	el enunciado del ejercicio. Simplemente se añade
 *	una validación previa de las coordenadas.
 * 
 *	Referencia: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/Pr%C3%A1cticas/01/#tarea-1-generar-el-tablero-en-el-dom
 */
function obtenerColorValidoAleatorio(coord) {
	// Validar coordenadas.
	if(!validarCoordenadas(coord)) return null;

	// Obtener color aleatorio.
	color = colorAleatorio();

	// Comprobar las dos casillas a la izquierda
	// y volver a generar color si coincide.
	if(coord.x >= 2 &&
		diamante(mover(coord, DIR_LEFT, 1)).dataset.color == color &&
		diamante(mover(coord, DIR_LEFT, 2)).dataset.color == color)
		return obtenerColorValidoAleatorio(coord);
	
	// Comprobar las dos casillas hacia arriba
	// y volver a generar color si coincide.
	if(coord.y >= 2 &&
		diamante(mover(coord, DIR_TOP, 1)).dataset.color == color &&
		diamante(mover(coord, DIR_TOP, 2)).dataset.color == color)
		return obtenerColorValidoAleatorio(coord);

	// Devolver color.
	return color;
}

// Funciones: lógica del juego.

/**
 *	Intercambia el color y la opacidad de
 *	dos bloques, sin validar trios formados
 *	ni actualizar el tablero posteriormente.
 * 
 *	Se usa internamente como parte de la función
 *	'intercambiarDiamantes()', requerida por el
 *	enunciado del ejercicio.
 */
function intercambiarColores(a, b) {
	// Obtener colores y opacidades de ambos diamantes.
	let colorA = a.dataset.color;
	let colorB = b.dataset.color;
	let opacidadA = a.style.opacity;
	let opacidadB = b.style.opacity;

	// ¿Coinciden los colores? Intercambiar
	// opacidades y cancelar operación.
	if(colorA == colorB) {
		a.style.opacity = opacidadB;
		b.style.opacity = opacidadA;
		return false;
	}

	// Eliminar los antiguos.
	a.classList.remove(colorA);
	b.classList.remove(colorB);

	// Añadir nuevos colores.
	a.classList.add(colorB);
	b.classList.add(colorA);

	// Intercambiar opacidades.
	a.style.opacity = opacidadB;
	b.style.opacity = opacidadA;

	// Intercambiar propiedad 'color'.
	a.dataset.color = colorB;
	b.dataset.color = colorA;

	return true;
}

/**
 *	Comprueba si en las coordenadas que se
 *	proporcionan hay un bloque eliminado.
 *	Si lo hay, lo intercambia con el diamante
 *	que tiene justo arriba.
 * 
 *	El método se invoca recursivamente hasta
 *	llegar a una posición que tenga por encima
 *	coordenadas inválidas (la fila 0).
 * 
 *	Esta función se pide en la tarea 4 del
 *	enunciado del ejercicio.
 * 
 *	Referencia: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/Pr%C3%A1cticas/01/#tarea-4-gravedad-y-relleno-de-vacios
 */
function aplicarGravedad(coord) {
	// ¿No hay nada por encima? Volver.
	let arriba = mover(coord, DIR_TOP, 1);
	if(arriba == null) return null;

	// ¿Bloque sólido? Volver.
	let dmt = diamante(coord);
	if(dmt.dataset.color != "vacio") return null;

	// Intercambiar con el bloque que
	// tiene justo encima.
	intercambiarColores(diamante(arriba), dmt);

	// Aplicar gravedad sobre el bloque
	// de por encima de ese también.
	aplicarGravedad(mover(coord, DIR_TOP, 1));
}

/**
 *	Realiza un recorrido de tablero en el eje
 *	indicado y devuelve una lista con todos los
 *	bloques que formen parte de trios de
 *	diamantes adyacentes del mismo color.
 * 
 *	Esta función se pide en la tarea 3 del
 *	enunciado del ejercicio.
 * 
 *	Referencia: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/Pr%C3%A1cticas/01/#tarea-3-comprobacion-de-combinaciones-match-3
 */
function buscarCoincidencias(horizontal) {
	let out = new Set();

	// Sacar longitud de los ejes I y J, y la dirección
	// en la que se recorrerá el tablero.
	const lenI = horizontal ? tablero.dataset.rows : tablero.dataset.cols;
	const lenJ = horizontal ? tablero.dataset.cols : tablero.dataset.rows;
	const dir = horizontal ? DIR_RIGHT : DIR_BOTTOM;

	// Recorrer array en el orden deseado.
	let racha = 1;
	for(let i = 0; i < lenI; i++) {
		for(let j = 0; j < lenJ; j++) {
			// Sacar coordenadas actuales y los
			// diamantes de esta posición y de la siguiente.
			const coord = horizontal ? coordenadas(j, i) : coordenadas(i, j);
			const actual = diamante(coord);
			const siguiente = diamante(mover(coord, dir, 1));
			
			// ¿Bloque vacío? Ignorar y resetear racha.
			if(actual.dataset.color == "vacio") {
				racha = 1;
				continue;
			}

			// ¿Mismo color que el siguiente en fila? Incrementar racha.
			// ¿Distinto color o último de fila? Romper racha.
			if(siguiente != null && actual.dataset.color == siguiente.dataset.color) {
				racha++;
			} else {
				// ¿Racha de 3 o más? Recorrer diamantes
				// partiendo desde el origen de la racha
				// y añadirlos a la lista de coincidencias.
				if(racha >= 3)
					for(let pos = racha - 1; pos >= 0; pos--)
						out.add(diamante(mover(coord, dir, -pos)));

				// Resetear racha.
				racha = 1;
			}
		}
	}

	// Devolver lista de diamantes eliminados.
	return out;
}

/**
 *	Recibe una lista de diamantes, los borra del
 *	tablero y aplica gravedad para trasladar los
 *	huecos creados a la cima del tablero.
 * 
 *	Las acciones de borrar y aplicar gravedad son
 *	a lo que nos referimos cuando decimos que se
 *	"limpia" un diamante o un grupo de ellos.
 * 
 *	Esta función se pide en la tarea 3 del
 *	enunciado del ejercicio. Además, se piden
 *	funcionalidades extra en la tarea 5.
 * 
 *	Referencia 1: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/Pr%C3%A1cticas/01/#tarea-3-comprobacion-de-combinaciones-match-3
 *	Referencia 2: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/Pr%C3%A1cticas/01/#tarea-5-sistema-de-puntuacion
 */
function limpiarCoincidencias(diamantes) {
	// Recorrer diamantes a limpiar.
	for(const dmt of diamantes) {
		// Borrar el diamante.
		dmt.style.opacity = 0;
		dmt.classList.remove(dmt.dataset.color);
		dmt.dataset.color = "vacio";

		// Sumar 10 puntos al usuario.
		puntuacion += 10;

		// Aplicar gravedad sobre él.
		aplicarGravedad(posicion(dmt));
	}
}

/**
 *	Limpia los trios formados y se ejecuta
 *	recursivamente hasta que no encuentre
 *	ningún trio de diamantes en el tablero.
 * 
 *	Esta función se usa internamente desde
 *	'intercambiarDiamantes(a, b)' y cumple
 *	los requerimientos de la tarea 4.
 * 
 *	Referencia: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/Pr%C3%A1cticas/01/#tarea-4-gravedad-y-relleno-de-vacios
 */
function actualizarTablero(repetida) {
	// Combinar trios horizontales y verticales.
	let trios = buscarCoincidencias(true).union(buscarCoincidencias(false));

	// Borrar todos los diamantes de la
	// lista combinada.
	limpiarCoincidencias(trios);

	// Recorrer el tablero para buscar huecos vacíos.
	for(let y = 0; y < tablero.dataset.rows; y++) {
		for(let x = 0; x < tablero.dataset.cols; x++) {
			const coord = coordenadas(x, y);
			const dmt = diamante(coord);

			// Sustituir diamantes vacíos por nuevos diamantes.
			if(dmt.dataset.color == "vacio") {
				// Asignar nuevo color.
				let color = obtenerColorValidoAleatorio(coord);
				dmt.dataset.color = color;
				dmt.classList.add(color);

				// Devolver opacidad.
				dmt.style.opacity = 1;
			}
		}
	}

	// Devolver lista combinada.
	return trios.size == 0 ? repetida : actualizarTablero(true);
}

/**
 *	Intercambia las propiedades de los dos
 *	diamantes proporcionados y actualiza el
 *	tablero para comprobar si se ha formado
 *	un trio de diamantes nuevo.
 * 
 *	Si el intercambio no produce ningún trio
 *	de diamantes nuevo, se cancela.
 * 
 *	Esta función se pide en las tareas 2 y 4
 *	del ejercicio.
 * 
 *	Referencia 1: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/Pr%C3%A1cticas/01/#tarea-2-logica-de-seleccion-e-intercambio
 *	Referencia 2: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/Pr%C3%A1cticas/01/#tarea-4-gravedad-y-relleno-de-vacios
 */
function intercambiarDiamantes(a, b) {
	// Intercambiar colores de los diamantes.
	intercambiarColores(a, b);

	// Dentro de 300ms, en un proceso aparte...
	setTimeout(() => {
		// Si el intercambio no forma ningún trio,
		// recuperar posición anterior.
		if(actualizarTablero(false) == false) {
			intercambiarColores(a, b);
			return;
		}
	
		// Actualizar indicador de puntuación y
		// terminar el juego cuando ha llegado a
		// la puntuación máxima.
		if(puntuacion >= MAX_PUNTUACION) {
			indicadorPuntuacion.innerText = MAX_PUNTUACION + " 🎉";
			alert("¡Enhorabuena! Has llegado a la puntuación máxima.");

			encendido = false;
		} else {
			indicadorPuntuacion.innerText = puntuacion;
		}
	}, 300);
}

// Funciones: eventos web.

/**
 *	Función ejecutada al hacer click sobre
 *	un diamante.
 * 
 *	Comprueba que el diamante sobre el que
 *	se ha hecho click no esté vacío. Si es
 *	así, hace lo siguiente:
 * 
 *	-	Si no hay ningún diamante seleccionado,
 *		selecciona el que se ha clickado.
 * 
 *	-	Si el diamante clickado ya está
 *		seleccionado, cancela la selección.
 * 
 *	-	Si ya hay un diamante seleccionado y el
 *		diamante clickado es adyacente a este,
 *		los intercambia y actualiza el tablero.
 * 
 *	Esta función se pide en la tarea 2
 *	del ejercicio.
 * 
 *	Referencia: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/Pr%C3%A1cticas/01/#tarea-2-logica-de-seleccion-e-intercambio
 */
function manejarClickDiamante(event) {
	if(!encendido) return;

	let seleccionados = document.getElementsByClassName("seleccionado");

	// ¿El diamante está vacío? Cancelar operación.
	if(event.target.dataset.color == "vacio")
		return;

	// ¿No hay selección? Seleccionar el diamante.
	if(seleccionados.length == 0) {
		event.target.classList.add("seleccionado");
		return;
	}

	// Obtener diamante seleccionado y 'target'
	// del evento.
	let sel = seleccionados[0];
	let tgt = event.target;

	// ¿Coincide con 'target'? Borrar selección.
	if(sel == tgt) {
		tgt.classList.remove("seleccionado");
		return;
	}

	// ¿No es adyacente horizontal o vertical de
	// 'target'? Cancelar operación.
	let difCol = tgt.dataset.col - sel.dataset.col;
	let difFila = tgt.dataset.fila - sel.dataset.fila;
	
	if(difCol == difFila ||
		difCol == -difFila ||
		difFila == -difCol ||
		(difCol < -1 || difCol > 1) ||
		(difFila < -1 || difFila > 1)) return;

	// Intercambiar color de los diamantes y
	// borrar selección.
	intercambiarDiamantes(sel, tgt);
	sel.classList.remove("seleccionado");
}

// Funciones: generación de elementos para el DOM.

/**
 *	Devuelve un <div> con la ID 'diamante'
 *	y todas las propiedades que posibilitan su
 *	funcionamiento como parte del tablero.
 * 
 *	Se usa internamente en 'generarTablero(coord)'
 *	y cumple todos los requerimientos de la tarea 1.
 * 
 *	La devolución de objetos se ha mencionado en
 *	alguna clase de Lenguajes de Marca y, obviamente,
 *	la hemos dado en Programación.
 *	
 *	Referencia 1: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/Pr%C3%A1cticas/01/#tarea-1-generar-el-tablero-en-el-dom
 */
function generarDiamante(coord) {
	// Crear el elemento <div>.
	out = document.createElement("div");

	// Asignar atributos básicos del elemento.
	out.classList.add("diamante");
	out.id = "diamante-" + coord.x + "-" + coord.y;

	// Asignar coordenadas.
	out.dataset.col = coord.x;
	out.dataset.fila = coord.y;

	// Asignar color.
	const color = obtenerColorValidoAleatorio(coord);
	out.dataset.color = color;
	out.classList.add(color);

	// Añadir listeners para eventos.
	out.addEventListener("click", manejarClickDiamante);

	// Devolver el elemento.
	return out;
}

/**
 *	Limpia el tablero y lo llena de diamantes,
 *	respetando los números de columnas y filas
 *	proporcionados en los argumentos.
 * 
 *	Esta función se pide en la tarea 1 del
 *	ejercicio.
 * 
 *	Referencia: https://fjramirez.es/lmsgi/UT4.%20Manipulaci%C3%B3n%20de%20documentos%20web/Pr%C3%A1cticas/01/#tarea-1-generar-el-tablero-en-el-dom
 */
function generarTablero(cols, rows) {
	if(cols <= 2 || rows <= 2) {
		alert("Error: el tablero debe medir 3x3 bloques como mínimo.");
		return;
	}

	// Vaciar tablero.
	tablero.innerHTML = "";

	// Asignar propiedades CSS.
	tablero.style.gridTemplateColumns = "repeat(" + cols + ", 60px)";
	tablero.style.gridTemplateRows = "repeat(" + rows + ", 60px)";

	// Asignar propiedades del 'dataset'
	tablero.dataset.cols = cols;
	tablero.dataset.rows = rows;

	// Insertar un nuevo diamante en cada bloque.
	for(let y = 0; y < rows; y++)
		for(let x = 0; x < cols; x++)
			tablero.appendChild(generarDiamante(coordenadas(x, y)));
}

// Script

generarTablero(DEF_COLS, DEF_ROWS);