let currentCard = null;
let correctLetter = '';
let correctWord = '';

function startGame() {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = ''; // Limpiar el contenedor

    // Lista de apóstoles y las imágenes que corresponden a cada letra
    const apostles = [
        { id: 'Pedro1', name: 'Pedro', images: ['Piedra', 'Llave', 'Dios', 'Red', 'Papa'] },
        { id: 'Santiago1', name: 'Santiago', images: ['Sol', 'Arbol', 'Caballo', 'Trueno', 'Iglesia', 'Ancla', 'Trigo', 'Ola'] },
        { id: 'Juan1', name: 'Juan', images: ['Jesus', 'Uvas', 'Aguila', 'Nube'] },
        { id: 'Andres1', name: 'Andrés', images: ['Arbol', 'Barco', 'Delfin', 'Remo', 'Espada', 'Soga'] },
        { id: 'Felipe1', name: 'Felipe', images: ['Flor', 'Espiga', 'Linterna', 'Iglesia', 'Pan', 'Estrella'] },
        { id: 'JudasIscariote1', name: 'Judas Iscariote', images: ['Jarra', 'Dinero', 'Daga', 'Arbol seco', 'Sombra'] },
        { id: 'Mateo1', name: 'Mateo', images: ['Moneda', 'Altar', 'Tabla', 'Escritura', 'Ojos'] },
        { id: 'Tomas1', name: 'Tomás', images: ['Tierra', 'Ojos', 'Mano', 'Arco', 'Simbolo'] },
        { id: 'SantiagoAlfeo1', name: 'Santiago Hijo de Alfeo', images: ['Sierra', 'Agua', 'Nieve', 'Iglesia', 'Incienso', 'Antorcha', 'Trigo', 'Olivo'] },
        { id: 'Bartolome1', name: 'Bartolomé', images: ['Biblia', 'Arbol', 'Rama', 'Tunica', 'Oveja', 'Lanza', 'Ola', 'Montaña', 'Espada'] },
        { id: 'JudasTadeo1', name: 'Judas Tadeo', images: ['Joya', 'Uncion', 'Dios', 'Antorcha', 'Oracion'] },
        { id: 'Simon1', name: 'Simón', images: ['Sol', 'Iglesia', 'Montaña', 'Oro', 'Barco'] }
    ];


    apostles.forEach(apostle => {
        const row = document.createElement('div');
        row.classList.add('card-row');

        apostle.images.forEach((image, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-letter', apostle.name.charAt(index).toUpperCase());
            card.setAttribute('data-id', apostle.id); // Identificador único

            // Insertar la imagen inicial
            const imgElement = document.createElement('img');
            imgElement.src = `Imagenes/${image}.jpg`;
            imgElement.alt = image;
            imgElement.style.width = '100%';
            card.appendChild(imgElement);

            // Añadir función de clic
            card.onclick = () => openModal(image, apostle.name.charAt(index).toUpperCase(), apostle.id);
            row.appendChild(card);
        });

        cardsContainer.appendChild(row);
    });

    document.getElementById('addChildSection').style.display = 'none';
    document.getElementById('gameSection').style.display = 'block';
}

function openModal(image, letter, apostleId) {
    correctLetter = letter;
    correctWord = image.toUpperCase(); // Guardamos la palabra correcta (nombre de la imagen)
    currentCard = apostleId; // Guardamos el identificador único de la carta
    document.getElementById('modalImage').src = `Imagenes/${image}.jpg`;
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('guessInput').value = ''; // Limpiar el input
}

function checkAnswer() {
    const userInput = document.getElementById('guessInput').value.trim().toUpperCase();

    if (userInput === correctWord) {
        alert('¡Correcto! Tienes +1 punto');

        // Cambiar la imagen de la carta a la letra correspondiente
        const selectedCard = document.querySelector(`.card[data-id="${currentCard}"][data-letter="${correctLetter}"]`);
        selectedCard.innerHTML = `<span class="letter">${correctLetter}</span>`;

        closeModal();
    } else {
        alert('Inténtalo de nuevo. Tienes -1 punto');
    }
}