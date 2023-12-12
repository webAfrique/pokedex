const genButtons = document.querySelectorAll('button') 
const cardContainer = document.querySelector('.card-container')
const infoParagraph = document.querySelector('.info')
const searchBar = document.querySelector('.search')
let pokemonGenerations = []
let pokemonCards


async function fetchGenerations() {
    //get all the pokemon generations
    const data = await fetch('https://pokeapi.co/api/v2/generation')
    const jsonData = await data.json()
    const results = jsonData.results
    
    //populate each generation with pokemon data
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
    
    pokemonGenerations = temp // return an array containing all generations  and the pokemon objects in each generation */
    
}


function createCard(pokemon) {
    const cardDiv = `
        <div class="card">
            <p class="id">${pokemon.id}</p>
            <img src="${pokemon.img}"/>
            <div class="name-plate">
                <p>${pokemon.name}</p>
            </div>
            <div class="dimensions">
                <span>${pokemon.height}cm</span>
                <span>${pokemon.weight}kg</span>
            </div>
        </div>
    `
    cardContainer.innerHTML += cardDiv
} 

function clickHandler(index) {
    searchBar.style.visibility = 'visible'
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

    for (index = 0; index < length; index++) {  
          if (!pokemonCards[index].innerHTML.toLowerCase().includes(searchStr)) { 
              pokemonCards[index].style.display="none"; 
          } 
          else { 
              pokemonCards[index].style.display="block";                  
          } 
      }   
}

searchBar.addEventListener('input', searchHandler)
window.addEventListener('DOMContentLoaded', fetchGenerations)
window.addEventListener('load', () => {
    genButtons.forEach((button, index) => {
        button.addEventListener('click', () => clickHandler(index) )
        
    })
})
