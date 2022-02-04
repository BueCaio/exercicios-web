/* função para criar um novo elemento */
function novoElemento(tagName, className) {/*nome da tag que eu quero criar e o nome da classe que eu quero aplicar esse elemento   */
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

/* função que vai criar uma barreira  */
/* função construtora */
function Barreira(reversa = false) {/* se a barreira vai ser reversa ou não */
    /* elemento é um atributo da função barreira */
    this.elemento = novoElemento('div', 'barreira')

    /* criei as duas partes da minha barreira */
    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    /* se for barreira reversa primeiro eu vou aplicar o corpo e depois a borda, caso não for irei aplicar a borda e depois o corpo */
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

/* TESTE
const b = new Barreira(true)
b.setAltura(200)
document.querySelector('[wm-flappy]').appendChild(b.elemento) */

function ParDeBarreiras(altura, abertura, x) { /*altura da barreira, abertura de uma barreira a outra, posição da linha aonde vc quer colocar as barreiras  */
    this.elemento = novoElemento('div', 'par-de-barreiras')

    /* definindo que a barreira superior é uma 
    barreira reversa */
    /* DEFININDO O PAR DE BARREIRAS */
    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    /* ADICIONANDO DENTRO DA DIV O PAR-DE-BARREIRAS */
    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        /* sorteando a altura da barreira superior e depois calculando a diferença 
        da altura total - o tamanho da abertura - altura da barreira superior */
        const alturaSuperior = Math.random() * (altura - abertura)/* altura da barreira menos o tamanho da abertura da barreira */
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior) 
    } 
    /* vou usar para saber onde o par de barreiras esta */
    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])

    /* função para setar o x */
    this.setX = x => this.elemento.style.left = `${x}px`
        
    /* para saber a largura do meu elemento */
    this.getLargura = ()=> this.elemento.clientWidth
        
    /*setando a altura superior e inferior das barreiras  */
    this.sortearAbertura()

    this.setX(x)
}

// const b = new ParDeBarreiras(700,200,400)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        
        /* posição X vai receber*/
        new ParDeBarreiras(altura, abertura, largura), // começe de fora do jogo
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            // quando o elemento sair da área do jogo
            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
            if (cruzouOMeio) notificarPonto() // se "cruzouOMeio" for vdd vai para segunda parte, se for falsa não executa a segunda parte
        })
    }
}

function Passaro(alturaJogo) {
    let voando = false

    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true // aperta qualquer tecla ele vai voar
    window.onkeyup = e => voando = false // solta a tecla ele vai cair

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5) // ele voa mais rapido doq cai
        const alturaMaxima = alturaJogo - this.elemento.clientHeight // altura maxima que o passaro pode voar

        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }

    this.setY(alturaJogo / 2)
}



function Progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

// const barreiras = new Barreiras(700, 1200, 200, 400)
// const passaro = new Passaro(700)
// const areaDoJogo = document.querySelector('[wm-flappy]')

// areaDoJogo.appendChild(passaro.elemento)
// barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento)) // pra cada par add ela dentro da area do jogo
// setInterval(() => {
//    barreiras.animar()
//    passaro.animar()
// }, 20)

function estaoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect() // retangulo associado ao elemento A
    const b = elementoB.getBoundingClientRect() // retangulo associado ao elemento B

    const horizontal = a.left + a.width >= b.left // testando se á sobreposição horizontal
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
    return horizontal && vertical
}

function colidiu(passaro, barreiras) {
    let colidiu = false
    barreiras.pares.forEach(parDeBarreiras => { // verificando se colidiu ou nao com a parte de cima e de baixo
        if (!colidiu) {
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento
            colidiu = estaoSobrepostos(passaro.elemento, superior)
                || estaoSobrepostos(passaro.elemento, inferior)
        }
    })
    return colidiu
}

function FlappyBird() {
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 200, 400,
        () => progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        // loop do jogo
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()

            if (colidiu(passaro, barreiras)) {
                clearInterval(temporizador)
            }
        }, 20)
    }
}

new FlappyBird().start()