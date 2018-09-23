const celeste = document.getElementById('celeste');
const violeta = document.getElementById('violeta');
const naranja = document.getElementById('naranja');
const verde = document.getElementById('verde');
const puntaje = document.getElementById('puntos');
const nivel = document.getElementById('nivel');
const mayor_puntuacion = document.getElementById('mejor_puntuacion');

const btnEmpezar = document.getElementById('btnEmpezar');
const ULTIMO_NIVEL = 50;

if (localStorage.getItem('mayor_puntaje') != null) {
    mayor_puntuacion.innerHTML = `${localStorage.getItem('mayor_puntaje') == 1 ? 'un punto' : localStorage.getItem('mayor_puntaje') + ' puntos'}`;
} else {
    mayor_puntuacion.innerHTML = 'Ninguna';
}

class Juego {
    constructor() {
        this.inicializar();
        this.generarSecuencia();
        this.siguienteNivel();
    }

    inicializar() {
        this.toggleBtnEmpezar();
        this.elegirColor = this.elegirColor.bind(this);
        this.siguienteNivel = this.siguienteNivel.bind(this);
        this.perdioElJuego = this.perdioElJuego.bind(this);
        this.ganoElJuego = this.ganoElJuego.bind(this);
        this.mayorPuntuacion = this.mayorPuntuacion.bind(this);
        this.nivel = 1;
        this.puntos = 0;
        this.colores = {
            celeste,
            violeta,
            naranja,
            verde
        }
    }

    toggleBtnEmpezar() {
        if (btnEmpezar.classList.contains('hide')) {
            btnEmpezar.classList.remove('hide');
        } else {
            btnEmpezar.classList.add('hide');
        }
    }

    generarSecuencia() {
        this.secuencia = new Array(ULTIMO_NIVEL)
            .fill(0)
            .map(n => Math.floor(Math.random() * 4))
    }

    siguienteNivel() {
        this.subnivel = 0
        puntaje.innerHTML = `${this.puntos} puntos`;
        nivel.innerHTML = `${this.nivel}`;
        swal('Preparate!', `Nivel ${this.nivel} con ${this.puntos} puntos`, 'success')
            .then(() => {
                setTimeout(() => {
                    this.iluminarSecuencia()
                    this.agregarEventosClick()
                }, 500)
            })
    }

    transformarNumeroAColor(numero) {
        switch (numero) {
            case 0:
                return 'celeste'
            case 1:
                return 'violeta'
            case 2:
                return 'naranja'
            case 3:
                return 'verde'
        }
    }

    transformarColorANumero(color) {
        switch (color) {
            case 'celeste':
                return 0
            case 'violeta':
                return 1
            case 'naranja':
                return 2
            case 'verde':
                return 3
        }
    }

    iluminarSecuencia() {
        for (let i = 0; i < this.nivel; i++) {

            const color = this.transformarNumeroAColor(this.secuencia[i])

            setTimeout(() => this.iluminarColor(color), 750 * i)
        }
    }

    iluminarColor(color) {
        this.colores[color].classList.add('light')
        setTimeout(() => this.apagarColor(color), 350)
    }

    apagarColor(color) {
        this.colores[color].classList.remove('light')
    }

    agregarEventosClick() {
        this.colores.celeste.addEventListener('click', this.elegirColor)
        this.colores.verde.addEventListener('click', this.elegirColor)
        this.colores.violeta.addEventListener('click', this.elegirColor)
        this.colores.naranja.addEventListener('click', this.elegirColor)
    }

    eliminarEventosCLick() {
        this.colores.celeste.removeEventListener('click', this.elegirColor)
        this.colores.verde.removeEventListener('click', this.elegirColor)
        this.colores.violeta.removeEventListener('click', this.elegirColor)
        this.colores.naranja.removeEventListener('click', this.elegirColor)
    }

    elegirColor(ev) {
        const nombreColor = ev.target.dataset.color;
        const numeroColor = this.transformarColorANumero(nombreColor);
        this.iluminarColor(nombreColor);
        if (numeroColor === this.secuencia[this.subnivel]) {
            this.subnivel++;
            this.puntos++;
            if (this.subnivel === this.nivel) {
                this.nivel++;
                this.eliminarEventosCLick();
                if (this.nivel === (ULTIMO_NIVEL + 1)) {
                    this.ganoElJuego()
                } else {
                    setTimeout(this.siguienteNivel, 1000)
                }
            }
        } else {
            setTimeout(this.perdioElJuego, 500)
        }
    }

    ganoElJuego() {
        this.mayorPuntuacion();
        swal('Felicitaciones', 'Ganaste el juego', 'success')
            .then(() => this.inicializar())
    }

    perdioElJuego() {
        this.mayorPuntuacion();
        swal(':(', 'Lo sentimos, has perdido', 'error')
            .then(() => {
                this.eliminarEventosCLick()
                this.inicializar()
            })
    }

    reiniciarPuntajes() {
        puntaje.innerHTML = `0 puntos`;
        nivel.innerHTML = `0`;

    }

    mayorPuntuacion() {
        this.reiniciarPuntajes();
        console.log(`${localStorage.getItem('mayor_puntaje')} ${this.puntos}`);
        // let max = localStorage.getItem('mayor_puntaje');
        if (this.puntos > localStorage.getItem('mayor_puntaje')) {
            mayor_puntuacion.innerHTML = `${this.puntos == 1 ? 'un punto' : this.puntos + ' puntos'}`;
            localStorage.setItem('mayor_puntaje', this.puntos);
        }
    }
}

function empezarJuego() {
    window.juego = new Juego()
}