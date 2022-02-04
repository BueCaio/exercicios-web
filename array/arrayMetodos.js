const pilotos = ['Vetel', 'Alonso', 'Raikkonen', 'Massa']
pilotos.pop() // massa quebrou o carro! | remove o ultimo
console.log(pilotos)

pilotos.push('Verstaappen') // adiciono e tiro o Massa
console.log(pilotos)

pilotos.shift() // remove o primeiro
console.log(pilotos)

pilotos.unshift('Hamilton') // adiciona ao primeiro elemento
console.log(pilotos)

// splice pode adicionar e remover elementos

//adicionar
pilotos.splice(2, 0, 'Bottas', 'Massa')
console.log(pilotos)

// remover
pilotos.splice(3, 1) // massa saiu dnv
console.log(pilotos)

const  algunsPilotos1 = pilotos.slice(2) // novo array -> pega o resto
console.log(algunsPilotos1)

const algunsPilotos2 = pilotos.slice(1, 4) // pega 1, 2, 3
console.log(algunsPilotos2)