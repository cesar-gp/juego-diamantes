# Juego de los Diamantes

Página web básica que permite jugar a una variante del *conecta tres* en el navegador.

## Motivación

Este proyecto es una entrega para la práctica 4.1 de la asignatura *Lenguajes de Marca* del primer curso del Grado Superior en Desarrollo de Aplicaciones Multiplataforma, que se imparte en el IES Albarregas de Mérida, Extremadura.

## ¿Cómo funciona?

La página muestra un tablero de 8x8 con una serie de piezas dentro. Llamaremos a estas piezas *diamantes*.

- Al hacer click en un diamante, se selecciona. Puedes cancelar la selección volviendo a hacer click en él.
- Si ya tienes seleccionado un diamante, puedes hacer click en un diamante adyacente. De esta forma, intercambias sus posiciones.
- Si al intercambiarlos juntos tres o más diamantes del mismo color, se eliminan. Además, sumarás 10 puntos por cada bloque eliminado.

Tienes 30 segundos para conseguir todos los puntos que puedas. Si llegas a 500, podrás cambiar esos puntos por 30 segundos más. El juego acabará cuando el temporizador llegue a cero.

## ¿Cómo lo ejecuto?

Puedes probar el juego tú mismo siguiendo estos pasos:

1. Clona el repositorio (`git clone https://github.com/cesar-gp/juego-diamantes/`).
2. Abre la carpeta del repositorio (`cd juego-diamantes`).
3. Abre el archivo `index.html` con el navegador.

## Demo online

[Haz click aquí](https://merida.party/dam/marca/practicas/diamantes/) para ver una demo del juego. El código de la demo pertenece al commit `dd8bda6`.