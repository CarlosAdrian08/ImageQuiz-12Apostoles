(function () {
    'use strict';

    var currentCard = null;
    var correctLetter = '';
    var correctWord = '';
    var letterIndex = -1;
    var score = 0;
    var totalCorrect = 0;

    var APOSTLES = [
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

    var IMAGE_DIR = 'Imagenes/';

    function $(id) {
        return document.getElementById(id);
    }

    function safeText(element, text) {
        element.textContent = text;
    }

    function safeAttr(element, attr, value) {
        element.setAttribute(attr, value);
    }

    function createImageElement(src, alt) {
        var img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.loading = 'lazy';
        img.onerror = function () {
            this.style.display = 'none';
        };
        return img;
    }

    function updateScoreUI() {
        var els = ['scoreValue', 'scoreValueGame'];
        els.forEach(function (id) {
            var el = $(id);
            if (el) {
                safeText(el, String(score));
                el.classList.add('bump');
                setTimeout(function () {
                    el.classList.remove('bump');
                }, 300);
            }
        });
        var correctEl = $('correctCount');
        if (correctEl) {
            safeText(correctEl, String(totalCorrect));
        }
    }

    function fireConfetti() {
        var canvas = $('confetti-canvas');
        if (!canvas || !canvas.getContext) return;

        var ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var particles = [];
        var colors = ['#fd79a8', '#6C63FF', '#00b894', '#fdcb6e', '#e17055', '#74b9ff', '#a29bfe', '#55efc4'];

        for (var i = 0; i < 80; i++) {
            particles.push({
                x: canvas.width / 2 + (Math.random() - 0.5) * 200,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 12,
                vy: Math.random() * -14 - 4,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 15,
                gravity: 0.3,
                opacity: 1
            });
        }

        var animId;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var alive = false;

            particles.forEach(function (p) {
                p.vy += p.gravity;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;
                p.opacity -= 0.012;

                if (p.opacity > 0) {
                    alive = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                    ctx.restore();
                }
            });

            if (alive) {
                animId = requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animId);
            }
        }

        animate();
    }

    window.startGame = function () {
        var cardsContainer = $('cardsContainer');
        cardsContainer.innerHTML = '';

        APOSTLES.forEach(function (apostle, apostleIdx) {
            var row = document.createElement('div');
            row.className = 'card-row';

            apostle.images.forEach(function (image, index) {
                var card = document.createElement('div');
                card.className = 'card';
                safeAttr(card, 'data-letter', apostle.name.charAt(index).toUpperCase());
                safeAttr(card, 'data-id', apostle.id);
                safeAttr(card, 'data-index', String(index));
                safeAttr(card, 'tabindex', '0');
                safeAttr(card, 'role', 'button');
                safeAttr(card, 'aria-label', 'Carta: ' + image + ' del apóstol ' + apostle.name);

                card.style.animationDelay = (apostleIdx * 0.05 + index * 0.03) + 's';

                var imgElement = createImageElement(IMAGE_DIR + image + '.jpg', image);
                card.appendChild(imgElement);

                card.addEventListener('click', function () {
                    openModal(image, apostle.name.charAt(index).toUpperCase(), apostle.id, index);
                });

                card.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openModal(image, apostle.name.charAt(index).toUpperCase(), apostle.id, index);
                    }
                });

                row.appendChild(card);
            });

            cardsContainer.appendChild(row);
        });

        $('introSection').style.display = 'none';
        $('gameSection').style.display = 'block';
        $('gameSection').className = 'game-section';
    };

    function openModal(image, letter, apostleId, index) {
        correctLetter = letter;
        correctWord = image.toUpperCase();
        currentCard = apostleId;
        letterIndex = index;

        var imgSrc = IMAGE_DIR + image + '.jpg';
        var modalImg = $('modalImage');
        modalImg.src = imgSrc;
        modalImg.alt = image;

        var modal = $('modal');
        modal.className = 'modal is-open';

        setTimeout(function () {
            var input = $('guessInput');
            input.value = '';
            input.focus();
        }, 100);
    }

    window.closeModal = function () {
        var modal = $('modal');
        modal.className = 'modal';
        $('guessInput').value = '';
    };

    window.checkAnswer = function () {
        var input = $('guessInput');
        var userInput = input.value.trim().toUpperCase();

        if (!userInput) {
            input.focus();
            input.style.borderColor = '#d63031';
            setTimeout(function () {
                input.style.borderColor = '';
            }, 1000);
            return;
        }

        var resultModal = $('resultModal');
        var resultMessage = $('resultMessage');
        var resultTitle = $('resultTitle');
        var resultEmoji = $('resultEmoji');

        if (userInput === correctWord) {
            score += 1;
            totalCorrect += 1;

            safeText(resultTitle, '¡Correcto!');
            resultTitle.className = 'result-title correct';
            safeText(resultMessage, '¡Muy bien! +1 punto');
            safeText(resultEmoji, '\uD83C\uDF89');

            var selector = '.card[data-id="' + CSS.escape(currentCard) + '"][data-index="' + letterIndex + '"]';
            var selectedCard = document.querySelector(selector);

            if (selectedCard) {
                selectedCard.setAttribute('data-solved', 'true');
                selectedCard.innerHTML = '';
                var letterSpan = document.createElement('span');
                letterSpan.className = 'letter';
                letterSpan.textContent = correctLetter;
                letterSpan.setAttribute('aria-label', 'Letra: ' + correctLetter);
                selectedCard.appendChild(letterSpan);
            }

            fireConfetti();
        } else {
            score = Math.max(0, score - 1);

            safeText(resultTitle, 'Inténtalo de nuevo');
            resultTitle.className = 'result-title wrong';
            safeText(resultMessage, 'La respuesta correcta era: ' + correctWord + ' (-1 punto)');
            safeText(resultEmoji, '\uD83D\uDE22');
        }

        updateScoreUI();

        resultModal.className = 'modal is-open';
        closeModal();
    };

    window.retry = function () {
        var resultModal = $('resultModal');
        resultModal.className = 'modal';
        $('guessInput').value = '';
    };

    window.closeResult = function () {
        retry();
    };

    window.goHome = function () {
        $('gameSection').style.display = 'none';
        $('introSection').style.display = 'flex';
        $('scoreBoard').style.display = 'flex';
        updateScoreUI();
    };

    document.addEventListener('keydown', function (e) {
        var modal = $('modal');
        if (modal.classList.contains('is-open')) {
            if (e.key === 'Escape') {
                closeModal();
            }
            if (e.key === 'Enter') {
                var input = $('guessInput');
                if (document.activeElement === input) {
                    checkAnswer();
                }
            }
        }

        var resultModal = $('resultModal');
        if (resultModal.classList.contains('is-open')) {
            if (e.key === 'Escape' || e.key === 'Enter') {
                retry();
            }
        }
    });

    window.addEventListener('resize', function () {
        var canvas = $('confetti-canvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });

})();
