// Variables
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

// Funsion 1:

// event listeners

cargarEventListeners();

function cargarEventListeners() {
    // agrega curso al carrito
    listaCursos.addEventListener('click', agregarCurso);
    
    // elimina curso del carrito
    contenedorCarrito.addEventListener('click', eliminarCurso);  

    // Muestra los cursos del carrito 
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];    
        carritoHTML();
    });

    // vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
};

// funsion 2: 
// Leen los datos de la CARD del cruso y llama a la Funsion 3

function agregarCurso(e) {
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leeDatosCurso(cursoSeleccionado);
    }    
};

// funsion 3
// Crea un objeto con los datos del curso, y lo agrega al Array del Carrito, y llama a la funsion 4

function leeDatosCurso(curso) {
    const infoCurso = {
        imagen: curso.querySelector('img').src ,
        titulo: curso.querySelector('h4').textContent ,
        precio: curso.querySelector('.precio span').textContent ,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };

    // revisa si un elemento existe en el carrito y que agrege cantiad en vez de articulo nuevo
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id ); 
    if (existe) {
        // actualizamos la cantidad
        const cursos = articulosCarrito.map( curso => {
            if ( curso.id === infoCurso.id )  {
                curso.cantidad++;
                return curso; // regresa el objeto con cantidad actualizada
            }  else {
                return curso; // regresa le objeto sin duplicado
            }
        });
        articulosCarrito = [...cursos];
    } else {
        // agreamos el curso al carrito
        articulosCarrito = [...articulosCarrito, infoCurso]; 
    }
    
    carritoHTML();
};

// funsion 4
// muestra en el carrito los cursos que vamos agregando al mismo, crea la visualizacion de cada curso

function carritoHTML() {
    //limpia le HTML asi no se duplican los objetos a medida que agregamos nuevos
    limpiarHTML();
    
    // general el HTML de cada curso
    articulosCarrito.forEach( curso => {
        const { imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100" >
            </td>
            <td>
                ${titulo}
            </td>
            <td>
                ${precio}
            </td>
            <td>
                ${cantidad}
            </td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
        `;
        // agrega al HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    } )

    // sinctronizar con Storage
    sincronizarStorage();
};

// funsion 5

function limpiarHTML() {
    // FORMA LENTA:
    //contenedorCarrito.innerHTML = '';
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    };
};

// funsion 6

function eliminarCurso(e) {
    // busca el ID del curso
  if(e.target.classList.contains('borrar-curso')) {
    const cursoId = e.target.getAttribute('data-id');
    // elimina el curso por el ID
    articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);

    //borrar del HTML
    carritoHTML();
  }
};

// funsion 7

function vaciarCarrito() {
    //resete el arreglo
   articulosCarrito = [];

   localStorage.clear();    
   
   limpiarHTML();
};

// funsion 8

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito))
};