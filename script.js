const generationButtons = document.querySelectorAll('button') 
const cardContainer = document.querySelector('.card-container')
const infoParagraph = document.querySelector('.info')
const form = document.querySelector('form')
const select = document.querySelector('select')
const searchBar = document.querySelector('.search')
let pokemonGenerations = []
let pokemonCards


async function fetchGenerations() {
    //get all the pokemon generation names
    const data = await fetch('https://pokeapi.co/api/v2/generation')
    const jsonData = await data.json()
    const results = jsonData.results
    
    //get the pokemons in each generation and their data
    const temp = []
    results.map(async (el) => {
        const data = await fetch(el.url)
        const jsonData = await data.json()
        const pokemon_species = jsonData.pokemon_species
        let generation = []
        pokemon_species.forEach(async (pokemon) => {
            const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
            const jsonData = await data.json()
            const pokeData = {
                id: jsonData.id,
                name: jsonData.name,
                height: jsonData.height,
                weight: jsonData.weight,
                img: jsonData.sprites.other['official-artwork'].front_default,
                types: jsonData.types,
              }
            generation.push(pokeData)
        })
        temp.push(generation)
    })
    
    pokemonGenerations = temp // return an array containing all generations and the pokemon objects in each generation */
    
}


function createCard(pokemon) {
    const typeImages = createImageTags(pokemon.types)
    const cardDiv = `
        <div class="card">
            <p class="id">${pokemon.id}</p>
            <img src="${pokemon.img}" class="pokemon-image"/>
            <div class="name-plate">
                <p>${pokemon.name}</p>
                <div class="types">${typeImages}</div>
            </div>
            <div class="dimensions">
                <span>${pokemon.height / 10}m</span>
                <span>${pokemon.weight / 10}kg</span>
            </div>
        </div>
    `
    cardContainer.innerHTML += cardDiv
} 

function createImageTags(types) {
    let images = ''
    types.forEach(element => {
        const name = element.type.name.toLowerCase()
        images += `<img src="type_images/${name}.webp" alt="type image" class="type-image"/>`
    })
    return images
}

function displayCards(index) {
    form.style.visibility = 'visible'
    cardContainer.innerHTML = ''
    const generation = pokemonGenerations[index]
    const total = generation.length
    generation.forEach(pokemon => createCard(pokemon)) 
    infoParagraph.textContent = `There are ${total} pokemons in generation ${index + 1}`
    pokemonCards = document.querySelectorAll('.card')
}

function searchHandler(event) {
    let searchStr = event.target.value.toLowerCase()
    const length = pokemonCards.length
    sortCards(length, searchStr)
}

function selectTypesHandler(event) {
    pokemonCards = document.querySelectorAll('.card')
    const length = pokemonCards.length
    const pokemonType = event.target.value
    sortCards(length, pokemonType)
}

function sortCards(totalCards, sortParameter) {

    for (index = 0; index < totalCards; index++) {  
        if (!pokemonCards[index].innerHTML.toLowerCase().includes(sortParameter)) { 
            pokemonCards[index].style.display="none"; 
        } 
        else { 
            pokemonCards[index].style.display="block";                  
        } 
    }  
}

searchBar.addEventListener('input', searchHandler)
select.addEventListener('change', selectTypesHandler)
window.addEventListener('DOMContentLoaded', fetchGenerations)
window.addEventListener('load', () => {
    generationButtons.forEach((button, index) => {
        button.addEventListener('click', () => displayCards(index) )
        
    })
})
