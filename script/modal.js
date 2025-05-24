function loopForDisplayEvolutionChain(evolutions) {
    let evolutionHtml = '';
    for (let i = 0; i < evolutions.length; i++) {
        let currentEvolution = evolutions[i];
        let speciesName = currentEvolution.species.name;
        let speciesId = currentEvolution.species.url.split("/")[6];
        
        evolutionHtml += getEvolutionChainInHTML(speciesId, speciesName);
        if (currentEvolution.evolves_to.length > 0) {
            evolutionHtml += `<span class="evolution-arrow">→</span>`;
            evolutions.push(currentEvolution.evolves_to[0]);
        }
    }
    return evolutionHtml;
}

function displayEvolutionChain(evolutionChain) {
    let evolutions = [evolutionChain.chain];
    let evolutionHtml = loopForDisplayEvolutionChain(evolutions);
    document.getElementById('evolutionChain').innerHTML = evolutionHtml;
}

async function fetchDataModal(id) {
    let [pokemon, pokemonSpecies, types, stats, moves] = await fetchPokemonUntilSend(id);

    let typesText = types.join(", ");
    let movesText = moves.slice(0, 5).join(", ");
    let evolutionChainUrl = pokemonSpecies.evolution_chain.url;
    let evolutionData = await fetchEvolutionChain(evolutionChainUrl);

    return { pokemon, pokemonSpecies, typesText, stats, movesText, evolutionData };
}

function displayPokemonModal(id, name, pokemonData) {
    let modal = document.getElementById("myModal");
    let { pokemon, pokemonSpecies, typesText, stats, movesText, evolutionData } = pokemonData;
    modal.innerHTML = getPokemonModal(id, name, pokemon, pokemonSpecies, typesText, stats, movesText);
    modal.style.display = "block";
    let modalcontent = modal.querySelector('.modal-content'); 
    let backgroundColor = getColorByType(typesText.split(", ")[0]);
    if (modalcontent) {
        modalcontent.style.backgroundColor = backgroundColor; 
    }
    currentPokemonIndex = globalPokemonArray.findIndex(p => p.pokemonId === id);
    setupNavigationButtons();
    document.body.classList.add('modal-open');
    displayEvolutionChain(evolutionData);
}

async function openPokeCart(id, name) {
    let pokemonData = await fetchDataModal(id);

    displayPokemonModal(id, name, pokemonData);
}

function setupNavigationButtons() {
    let nextButton = document.getElementById('next');
    let previousButton = document.getElementById('previous');

    nextButton.onclick = function() {
        navigatePokemon(1); 
    };

    previousButton.onclick = function() {
        navigatePokemon(-1); 
    };
}

function ifElseForNavigatePokemon() {
    if (currentPokemonIndex >= globalPokemonArray.length) {
        currentPokemonIndex = 0; 
    } else if (currentPokemonIndex < 0) {
        currentPokemonIndex = globalPokemonArray.length - 1;
    }
}

function navigatePokemon(direction) {
    currentPokemonIndex += direction;
    ifElseForNavigatePokemon();
    let newPokemon = globalPokemonArray[currentPokemonIndex];
    if (!newPokemon) {
        return;
    }
    let newPokemonId = newPokemon.pokemonId;
    let newPokemonName = newPokemon.pokemon.name;

    openPokeCart(newPokemonId, newPokemonName);
}

function closeModal() {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";

    document.body.classList.remove('modal-open');
}

function showSection(sectionId, headerId) {
    let sections = ['aboutUnderDiv', 'baseStatsUnderDiv', 'evolutionChainDiv', 'movesDiv'];
    let headers = ['hAbout', 'hBase', 'hEvolution', 'hMoves'];

    for (let i = 0; i < sections.length; i++) {
        document.getElementById(sections[i]).style.display = 'none';
    }
    document.getElementById(sectionId).style.display = 'block';
    for (let i = 0; i < headers.length; i++) {
        document.getElementById(headers[i]).style.transform = 'scale(1)';
        document.getElementById(headers[i]).style.textDecoration = 'none';
    }
    document.getElementById(headerId).style.transform = 'scale(1.2)';
    document.getElementById(headerId).style.textDecoration = 'underline';
}

function showAbout() {
    showSection('aboutUnderDiv', 'hAbout');
}

function showBaseStats() {
    showSection('baseStatsUnderDiv', 'hBase');
}

function showEvolutionChainDiv() {
    showSection('evolutionChainDiv', 'hEvolution');
}

function showMovesDiv() {
    showSection('movesDiv', 'hMoves');
}



