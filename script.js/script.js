let globalPokemonArray = [];
let allPokemons = [];
let currentPokemonIndex = 0;
let offset = 0; 
let limit = 40;
let isLoading = false;
let loadMoreBtn = document.getElementById('loadMoreBtn');
let container = document.getElementById('contentID');
let searchTimeout;
const Base_URL = "https://pokeapi.co/api/v2/pokemon";

function clearInput() {
    let input = document.getElementById('searchInput');
    input.value = ''; 
    hideNoPokemonMessage();
    toggleClearButton();
    loadPokemonsForInput(0, limit, false);
}

async function searchPokemon() {
    let input = document.getElementById('searchInput');
    let searchTerm = input.value.trim();
    let loadMoreBtn = document.getElementById('loadMoreBtn');
    let filteredPokemons = pokemonFilternForSearch(searchTerm);

    ifElseForSearch(searchTerm, loadMoreBtn, filteredPokemons);
    if (filteredPokemons.length < 10) {
        filteredPokemons = await apiSearch(searchTerm, filteredPokemons);
    }
    ifElseForSearch(searchTerm, loadMoreBtn, filteredPokemons);
}

async function fetchPokemonsFromAPI(searchTerm) {
    const Base_URL = "https://pokeapi.co/api/v2/pokemon";
    let apiResults = await IdOrNameForFetch(Base_URL, searchTerm);
    return apiResults;
}

async function loadPokemons(offset, limit, append) {
    isLoading = true;
    toggleLoadingScreen(true);
    let button = document.getElementById("loadMoreBtn");
    button.disabled = true;
    await supportForLoadPokemon(offset, limit, append);

    isLoading = false;
    toggleLoadingScreen(false);
    button.disabled = false;
}

function loadPokemonsForInput(offset, limit, append) {
    let url = `${Base_URL}?offset=${offset}&limit=${limit}`;
    
    tryCatchForLoadPokemons(url).then(data => {
        if (data && data.results) {
            dataForLoadPokemons(data, append);
        }
    });
}

function toggleLoadingScreen(show) {
    let loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = show ? 'block' : 'none';
}

function getColorByType(type) {
    let typeColors = { 
        grass: '#78C850', fire: '#F08030', water: '#6890F0', 
        bug: '#A8B820', normal: '#A8A878', poison: '#A040A0', 
        electric: '#F8D030', ground: '#E0C068', fairy: '#EE99AC', 
        fighting: '#C03028', psychic: '#F85888', rock: '#B8A038', 
        ghost: '#705898', ice: '#98D8D8', dragon: '#7038F8', 
        dark: '#705848', steel: '#B8B8D0', flying: '#A890F0' 
    };
    return typeColors[type] || '#68A090'; 
}

function getAbilitiesText(abilities) {
    if (!abilities || abilities.length === 0) {
        return 'No abilities';
    }

    let abilitiesText = '';
    let maxAbilities = 3;

    for (let i = 0; i < abilities.length && i < maxAbilities; i++) {
        abilitiesText += abilities[i].ability.name;
        if (i < abilities.length - 1 && i < maxAbilities - 1) {
            abilitiesText += ', ';
        }
    }
    return abilitiesText;
}

async function fetchEvolutionChain(url) {
    try {
        let response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Error fetching evolution chain:", error);
        return null;
    }
}

async function fetchPokemonUntilSend(id) {
    const details = await supportForFetchPoUntilSend(id);
    if (!details) return null;

    const { pokemon, pokemonSpecies } = details;
    const evolutionChainUrl = pokemonSpecies.evolution_chain.url;
    const evolutionChain = await tryForFetchPoUntilSend(evolutionChainUrl, "Error retrieving Evolutionchain");

    if (!evolutionChain) return null;

    const { types, moves, stats } = extractPokemonDetails(pokemon);

    return [pokemon, pokemonSpecies, types, stats, moves];
}

function displayPokemonCard(pokemon, pokemonId, types, moves) {
    let typesDivs = "";
    for (let i = 0; i < types.length; i++) {
        typesDivs += `<div class="pokemon-type">${types[i]}</div>`;
    }

    let abilitiesText = getAbilitiesText(pokemon.abilities);
    let movesText = getMovesText(moves); 

    let pokemonHtml = getPokemonCart(pokemon, pokemonId, typesDivs, abilitiesText, movesText);
    let backgroundColor = getColorByType(types[0]);

    return getPokeContainer(pokemonId, pokemon, pokemonHtml, backgroundColor);
}

async function displayPokemons(pokemons, append) {
    let container = document.getElementById('contentID');

    if (!append) {
        container.innerHTML = ""; 
    } 
    await appendPokemon(pokemons);
}

async function appendPokemon(pokemons) {
    let container = document.getElementById('contentID');
    let htmlString = '';
    let pokemonDataArray = await supportAppendPokemon(pokemons);
   
    for (let i = 0; i < pokemonDataArray.length; i++) {
        let data = pokemonDataArray[i];
        globalPokemonArray.push(data);
        htmlString += displayPokemonCard(data.pokemon, data.pokemonId, data.types, data.moves);
    }

    container.innerHTML += htmlString;
}

async function loadMorePokemons() {
    if (!isLoading) {
        let contentDiv = document.getElementById('contentDivID');
        let loadingScreen = document.getElementById('loadingScreen'); 

        await loadPokemons(offset, limit, true);
        offset += limit;
    }
}

loadMorePokemons();
