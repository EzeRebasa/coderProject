const iconSearch = document.querySelector('.search__form');

iconSearch.addEventListener('click', getMessage);

greeting();


// Functions

function getMessage () {
    alert(`El búscador no está disponible por el momento. 
            Disculpe las molestias!!`);
}

function greeting() {
    let name = prompt('Bienvenido!! Introduce tu Nombre');
    if(name != '' && name != null){
        alert(`Hola ${name}! Gracias por visitar nuestra tienda.
Esperamos que encuentres lo que estás buscando :D!`)
    }else{
        alert(`No sabemos tu nombre pero esperamos que tengas una
buena experiencia en esta visita por la tienda. `)
    }
}
