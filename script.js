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

/**
 *	Posibles colores de un diamante, definidos
 *	como nombres de clases CSS.
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
 *	Está definido en el document HTML y se
 *	asume que nunca puede estar indefinido
 *	o tener un valor nulo.
 */
const tablero = document.getElementById("tablero");

// Funciones: arreglos para el desastre de tipos de JavaScript.

function numero(str) {
	let out = +str;
	return isNaN(out) ? str : out;
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

// Funciones: trios de diamantes adyacentes.

/**
 *	Comprueba que un trio de diamantes adyacentes
 *	contenga una lista con 3 diamantes y que
 */
function validarTrio(tri) {
	// Comprobar que contenga una lista con 3 diamantes.
	let out = tri != undefined &&
		tri != null &&
		tri.bloques != null &&
		tri.bloques != undefined &&
		tri.bloques.size == 3;

	if(!out) return false;

	// Comprobar que ninguno de los 3 es un bloque vacío.
	let coord;
	for(b of tri.bloques) {
		if(coord == undefined)
			coord = coordenadas(b.dataset.col, b.dataset.fila);

		if(b.dataset.col == coord.x) {
			tri.horizontal = false;
		} else if(b.dataset.fila == coord.y) {
			tri.horizontal = true;
		} else return false;
	}

	// Devolver resultado de la validación.
	return out;
}

/**
 *	Construye un trio de diamantes adyacentes
 *	validado.
 */
function trio(bloques) {
	let out = {
		bloques: bloques
	}

	if(!validarTrio(out)) return null;

	return out;
}

// Funciones: getters para elementos y atributos.

/**
 *	Devuelve un color aleatorio de entre los que
 *	se incluyen en la lista 'colores'.
 */
function colorAleatorio() {
	return colores[Math.floor(Math.random() * colores.length)];
}

/**
 *	Devuelve el diamante ubicado en la posición
 *	proporcionada.
 */
function diamante(coord) {
	return validarCoordenadas(coord) ?
		document.getElementById("diamante-" + coord.x + "-" + coord.y) :
		null;
}

/**
 *	Devuelve las coordenadas de un diamante.
 *	Es decir, su "posición" en el tablero.
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
 *	dos bloques hacia la derecha.
 * 
 *	Esta función previene que el tablero se cree
 *	con trios formados al principio del juego.
 */
function obtenerColorValidoAleatorio(coord) {
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
 */
function aplicarGravedad(coord) {
	// ¿No hay nada por encima? Volver.
	let arriba = mover(coord, DIR_TOP, 1);
	if(arriba == null) return null;

	// ¿Bloque sólido? Volver.
	let dmt = diamante(coord);
	if(dmt.dataset.color != "vacio") return null;

	// Intercambiar con el bloque que
	// tiene justo arriba.
	intercambiarColores(diamante(arriba), dmt);

	// Aplicar gravedad sobre el bloque
	// de arriba también.
	aplicarGravedad(mover(coord, DIR_TOP, 1));
}

/**
 *	Realiza un recorrido de tablero en el eje
 *	indicado y devuelve una lista con todos los
 *	bloques que formen parte de trios de
 *	diamantes adyacentes del mismo color.
 */
function buscarCoincidencias(horizontal) {
	let out = new Set();

	// Sacar longitud de los ejes I y J.
	const lenI = horizontal ? tablero.dataset.rows : tablero.dataset.cols;
	const lenJ = horizontal ? tablero.dataset.cols : tablero.dataset.rows;

	// Recorrer array en el orden deseado.
	let racha = 0;
	for(let i = 0; i < lenI; i++) {
		for(let j = 1; j < lenJ; j++) {
			// Sacar coordenadas actuales y dirección de la
			// pieza anterior según el eje del recorrido.
			const coord = horizontal ? coordenadas(j, i) : coordenadas(i, j);
			const dir = horizontal ? DIR_LEFT : DIR_TOP;

			// Ignorar bloques vacíos.
			if(diamante(coord).dataset.color == "vacio")
				continue;

			// Incrementar racha o romperla.
			if(diamante(coord).dataset.color == diamante(mover(coord, dir, 1)).dataset.color)
				racha++;
			else racha = 0;

			// ¿Racha de 3? Eliminar trio y añadir
			// bloques a la lista a devolver.
			if(racha == 2) {
				let tri = new Set();
				for(let pos = 2; pos >= 0; pos--)
					tri.add(diamante(mover(coord, dir, pos)));

				out.add(trio(tri));
				racha = 0;
			}
		}

		racha = 0;
	}

	// Devolver lista de bloques eliminados.
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
 */
function limpiarCoincidencias(trios) {
	for(const tri of trios) {
		for(dmt of tri.bloques) {
			dmt.style.opacity = 0;
			dmt.classList.remove(dmt.dataset.color);
			dmt.dataset.color = "vacio";
		}

		for(dmt of tri.bloques)
			aplicarGravedad(posicion(dmt));
	}
}

/**
 *	Limpia los trios formados y se ejecuta
 *	recursivamente hasta que no encuentre
 *	ningún trio de diamantes en el tablero.
 */
function actualizarTablero(repetida) {
	// Combinar trios horizontales y verticales.
	let trios = buscarCoincidencias(true).union(buscarCoincidencias(false));

	// Borrar todos los diamantes de la
	// lista combinada.
	limpiarCoincidencias(trios);

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
 */
function intercambiarDiamantes(a, b) {
	// Intercambiar colores de los diamantes.
	intercambiarColores(a, b);

	// Si el intercambio no forma ningún trio,
	// recuperar posición anterior.
	setTimeout(() => {
		if(actualizarTablero(false) == false)
			intercambiarColores(a, b);
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
 *		intercambia sus propiedades.
 */
function manejarClickDiamante(event) {
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
 */
function generarTablero(cols, rows) {
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