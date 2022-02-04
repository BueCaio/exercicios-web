// novo recurso do ES2015

const pessoa = {
    nome: 'Thiago',
    idade: 16,
    endereco: {
        logradouro: 'Carapicuiba - Cohab 2',
        numero: 32
    }
} 

const { nome, idade } = pessoa
console.log(nome, idade)

const { nome: n, idade: i } = pessoa
console.log(n, i)

const { sobrenome, bemHumorada = true } = pessoa
console.log(sobrenome, bemHumorada)

const { endereco: { logradouro, numero, cep } } = pessoa
console.log(logradouro, numero, cep) 