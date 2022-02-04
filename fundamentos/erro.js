function tratarErroLancar(erro) {
    //throw new Error('...')
    throw 10
}

function imprimirNomeGritado(obj) {
    try {

        console.log(obj.name.toUpperCase() + '!!!')
    } catch (e) {
        tratarErroLancar(e)
    } finally {
        console.log('final')
    }
}

const obj = { nome: 'Roberto' }
imprimirNomeGritado(obj)