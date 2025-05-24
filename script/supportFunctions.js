let inputElement = document.getElementById('searchInput');

async function IdOrNameForFetch(Base_URL, searchTerm) {
    if (!isNaN(searchTerm)) {
        let response = await fetch(`${Base_URL}/${searchTerm}`);
        if (response.ok) {
            let pokemon = await response.json();
            return [{ name: pokemon.name, url: `${Base_URL}/${pokemon.id}/` }];
        }
    } else {
        let response = await fetch(`${Base_URL}?limit=1000`);
        let data = await response.json();
        return data.results.filter(pokemon => pokemon.name.includes(searchTerm.toLowerCase()));
    }
    return [];
}

function showNoPokemonMessage() {
    let container = document.getElementById('contentID');
    let loadMoreBtn = document.getElementById('loadMoreBtn');
    container.innerHTML = getShowNoPokeInHTML();
    loadMoreBtn.style.display = 'none';
}

function hideNoPokemonMessage() {
    let container = document.getElementById('contentID');
    let loadMoreBtn = document.getElementById('loadMoreBtn');
    if (container.querySelector('.no-pokemon')) {
        container.innerHTML = "";
    }
    loadMoreBtn.style.display = 'block';
}

function searchById(searchTerm) {
    
    let searchResults = [];
    
    for (let i = 0; i < allPokemons.length; i++) {
        let urlParts = allPokemons[i].url.split("/");
        let pokemonId = urlParts[urlParts.length - 2];

        if (pokemonId.includes(searchTerm)) {
            searchResults.push(allPokemons[i]);
        }
    }
    return searchResults;
}

function searchByName(searchTerm) {
    let searchResults = [];
    for (let i = 0; i < allPokemons.length; i++) {
        if (allPokemons[i].name.includes(searchTerm.toLowerCase())) {
            searchResults.push(allPokemons[i]);
            if (searchResults.length === 10) break;
        }
    }
    return searchResults;
}

function shouldSearch(searchTerm) {
    return (!isNaN(searchTerm) && searchTerm.length > 0) || (searchTerm && searchTerm.length >= 3);
}

function pokemonFilternForSearch(searchTerm) {
    if (!shouldSearch(searchTerm)) return [];
    
    let results = [];
    
    if (!isNaN(searchTerm)) {
        let idResults = searchById(searchTerm);
        results = results.concat(idResults);
    }
    
    if (results.length < 10) {
        let nameResults = searchByName(searchTerm);
        results = results.concat(nameResults).slice(0, 10);
    }
    
    return results;
}

function ifElseForSearch(searchTerm, loadMoreBtn, filteredPokemons = []) {
    if (searchTimeout) clearTimeout(searchTimeout);
    if (!shouldSearch(searchTerm)) return;
    if (filteredPokemons.length === 0) {
        searchTimeout = setTimeout(() => {
            showNoPokemonMessage();
            loadMoreBtn.style.display = 'none';
        }, 1000);
    } else {
        container.innerHTML = "";
        hideNoPokemonMessage();
        appendPokemon(filteredPokemons);
        loadMoreBtn.style.display = 'none';
    }
}

function displayOrIfElseForSearch(filteredPokemons) {
    if (filteredPokemons.length > 0) {
        displayPokemons(filteredPokemons.slice(0, limit));
    } else {
        ifElseForSearch();
    }
}

function ifForComparePokemon(combined, apiPokemon) {
    for (let j = 0; j < combined.length; j++) {
        if (combined[j].name === apiPokemon.name) {
            return true; 
        }
    }
    return false;
}

function comparePokemons(localPokemons, apiPokemons) {
    let combined = [];
    for (let i = 0; i < localPokemons.length; i++) {
        combined.push(localPokemons[i]);
    }
    for (let i = 0; i < apiPokemons.length; i++) {
        let found = ifForComparePokemon(combined, apiPokemons[i]);
        if (!found) {
            combined.push(apiPokemons[i]);
        }
        if (combined.length >= 10) {
            return combined;
        }
    }
    return combined;
}

async function apiSearch(searchTerm, filteredPokemons) {
    if (filteredPokemons.length >= 10 || !shouldSearch(searchTerm)) return filteredPokemons;
    let apiPokemons = await IdOrNameForFetch(Base_URL, searchTerm);
    filteredPokemons = comparePokemons(filteredPokemons, apiPokemons);
    return filteredPokemons.slice(0, 10);
}

inputElement.addEventListener('keydown', function(event) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
        checkAndClearInput();
        toggleClearButton();
    }
});

function toggleClearButton() {
    let input = document.getElementById('searchInput').value.trim();
    let clearButton = document.getElementById('clearButton');

    if (input.length > 0) {
        clearButton.style.display = 'block';
    } else {
        clearButton.style.display = 'none';
    }
}

async function supportForFetchPoUntilSend(id) {
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    const [pokemon, pokemonSpecies] = await Promise.all([
        tryForFetchPoUntilSend(pokemonUrl, "Error retrieving Pokémon by ID"),
        tryForFetchPoUntilSend(speciesUrl, "Error retrieving Pokémon-species")
    ]);
    if (!pokemon || !pokemonSpecies) return null;
    return { pokemon, pokemonSpecies };
}

async function tryForFetchPoUntilSend(url, errorMessage) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`${errorMessage}: ${response.status}`);
            return null; 
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}

function ifSupportAppendPokemon(pokemonDetails, pokemon, pokemonId, globalPokemonArray) {
    if (pokemonDetails) {
        let [pokemonData, pokemonSpecies, types, stats, evolutionChain, moves] = pokemonDetails;
        globalPokemonArray.push({
            pokemon,
            pokemonId: parseInt(pokemonId),
            types,
            moves
        });
    }
}

async function supportAppendPokemon(pokemons) {
    let pokemonDataArray = [];
    let promises = [];

    for (let i = 0; i < pokemons.length; i++) {
        let pokemonId = pokemons[i].url.split("/")[6];
        let promise = fetchPokemonUntilSend(pokemonId).then(pokemonDetails => {
            ifSupportAppendPokemon(pokemonDetails, pokemons[i], pokemonId, pokemonDataArray);
        });
        promises.push(promise); 
    }
    await Promise.all(promises);

    return pokemonDataArray.sort((a, b) => a.pokemonId - b.pokemonId);
}


async function supportForLoadPokemon(offset, limit, append) {
    let url = `${Base_URL}?offset=${offset}&limit=${limit}`;
    let data = await tryCatchForLoadPokemons(url);

    if (data && data.results) {
        await dataForLoadPokemons(data, append);
    }

}

async function tryCatchForLoadPokemons(url) {
    try {
        let response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            console.error(`HTTP error! Status: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error("Error loading data");
        return null;
    }
}

async function dataForLoadPokemons(data, append) {
    let pokemons = data.results;
    await displayPokemons(pokemons, append);
}

function addCheckedPokemon(pokemons, allPokemons) {
    pokemons.forEach(pokemon => {
        let pokemonId = pokemon.url.split("/")[6];
        if (!allPokemons.some(p => p.url.split("/")[6] === pokemonId)) {
            allPokemons.push(pokemon);
        }
    });
}

function getPokemonStats(pokemon) {
    let total = 0;
    
    for (let i = 0; i < pokemon.stats.length; i++) {
        total += pokemon.stats[i].base_stat;
    }
    return {
        hp: pokemon.stats[0].base_stat,
        attack: pokemon.stats[1].base_stat,
        defense: pokemon.stats[2].base_stat,
        spAtk: pokemon.stats[3].base_stat,
        spDef: pokemon.stats[4].base_stat,
        speed: pokemon.stats[5].base_stat,
        total: total
    };
}

function getMovesText(moves) {
    if (!moves || moves.length === 0) return 'No moves';

    let movesHtml = '';
    let maxMoves = 6; 
    let count = 0;

    for (let i = 0; i < moves.length; i++) {
        if (count >= maxMoves) break;
        movesHtml += `<div>${moves[i].move.name}</div>`;
        count++;
    }
    return movesHtml;
}

function extractPokemonDetails(pokemon) {
    let types = [];
    for (let i = 0; i < pokemon.types.length; i++) {
        types.push(pokemon.types[i].type.name);
    }
    let moves = [];
    for (let i = 0; i < pokemon.moves.length; i++) {
        moves.push(pokemon.moves[i].move.name);
    }
    let stats = getPokemonStats(pokemon);

    return { types, moves, stats };
}

function checkAndClearInput() {
    let input = document.getElementById('searchInput');
    let searchTerm = input.value.trim();
    ifForCheckAndClearInput(searchTerm);
}

function ifForCheckAndClearInput(searchTerm) {
    if (searchTerm.length === 1) {
        clearInput();
        return true;
    }
    if (searchTerm.length < 4) {
        hideNoPokemonMessage();
        loadPokemonsForInput(0, limit, false);
        return true;
    }
    if (!shouldSearch(searchTerm)) {
        hideNoPokemonMessage();
        loadPokemonsForInput(0, limit, false);
        return true;
    }
    return false;
}
