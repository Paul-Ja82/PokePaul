function getPokemonCart(pokemon, pokemonId, typesDivs) {
    return`
    <div onclick="openPokeCart(${pokemonId}, '${pokemon.name}')">
    <div class="pokemonOwnNummerDiv">
        <span class="pokemon-OwnNummer">#${pokemonId}</span>
    </div>

    <div class="pokemonOwnNameDiv">
        <span class="pokemon-OwnName">${pokemon.name}</span>
    </div>

    <div class="pokemonOwnImgDiv">
        <div class="pokemon-typeDiv">
            ${typesDivs}
        </div>
        <div class="pokemon-imgDiv">
            <img class="pokemon-Img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png"/>
        </div>
    </div>
    </div>`;
}

function getPokemonModal(id, name, pokemon, pokemonSpecies, typesText, stats, movesText) {
    return`
    <div class="modal-contentDiv">
    <div class="modal-content" onclick="event.stopPropagation()">
            <div class="pokemonModalClose">
                <span class="close" onclick="closeModal()">&times;</span>
            </div>
        <div class="modal-header">
            <div class="pokemonModalNameNumber">
                <span class="pokemon-modalNumber">#${id}</span>
                <span class="pokemon-ModalName">${name}</span>
            </div>

            <div class="ModalImgDiv">
                <div class="poke-ball-bigdiv">
                    <img src="img/pokeBall.png" class="poke-ball-big">
                </div>
                <div class="pokemonModalImgdiv">
                    <img class="pokemonModalImg" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png"/>
                </div>
            </div>
        </div>

        <div class="pokemonModalDetails" id="pokemonModalDetails">
            <div class="details-titles">
                <h2 class="h-about" id="hAbout" onclick="showAbout()">About</h2>
                <h2 class="h-base-state" id="hBase" onclick="showBaseStats()">Base Stats</h2>
                <h2 class="h-Evolution" id="hEvolution" onclick="showEvolutionChainDiv()">Evolution</h2>
                <h2 class="h-moves" id="hMoves" onclick="showMovesDiv()">Moves</h2>
            </div>

            <div class="about-Under-Div" id="aboutUnderDiv" style="display: block;">
                <div class="details-grid">
                    <div>Weight :</div>
                    <div>${pokemon.weight} kg</div>
                    <div>Height :</div>
                    <div>${pokemon.height} m</div>
                    <div>Species :</div>
                    <div>${pokemonSpecies.name}</div>
                    <div>Type :</div>
                    <div>${typesText}</div>
                    <div>Abilities :</div>
                    <div>${getAbilitiesText(pokemon.abilities)}</div>
                </div>
            </div>

            <div class="base-stats-underDiv" id="baseStatsUnderDiv" style="display: none;">
                <div class="stats-grid">
                    <div>HP :</div>
                    <div>${stats.hp}</div>
                    <div>Attack :</div>
                    <div>${stats.attack}</div>
                    <div>Defense :</div>
                    <div>${stats.defense}</div>
                    <div>Sp. Atk :</div>
                    <div>${stats.spAtk}</div>
                    <div>Sp. Def :</div>
                    <div>${stats.spDef}</div>
                    <div>Speed :</div>
                    <div>${stats.speed}</div>
                    <div>Total :</div>
                    <div>${stats.total}</div>
                </div>
            </div>

            <div id="evolutionChainDiv" class="evolution-ChainDiv" style="display: none;">
                <div class="evolution-chain" id="evolutionChain"></div>
            </div>

            <div class="pokemon-MovesDiv" id="movesDiv" style="display: none;">
                <div class="moves-grid">
                    <div>Moves:</div>
                    <div class="moves-textDiv">${movesText}</div>
                </div>
            </div>
        </div>

        <div class="arrowsDiv">
            <button class="previousButton" id="previous">&larr;</button>
            <button class="nextButton" id="next">&rarr;</button>
        </div>
    </div>
    </div>`;

}

function getEvolutionChainInHTML(speciesId, speciesName) {
    return`
            <div class="evolution-stage">
                <img class="evolution-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png" alt="${speciesName}">
              <div class="evolution-nameDiv">
                <span class="evolution-name">${speciesName}</span>
              </div>
            </div>`;
}

function getPokeContainer(pokemonId,pokemon,pokemonHtml,backgroundColor){
    return`
        <div id="pokemon-${pokemonId}" class="list-item" onclick="openPokeCart(${pokemonId}, '${pokemon.name}')" style="background-color: ${backgroundColor}">
                ${pokemonHtml}
            </div>
    `;
}

function getShowNoPokeInHTML() {
    return `
    "<div class='no-pokemon'>No Pokémon found <strong>!</strong><img src='img/notFoundImg.jpg' class='no-pokemonImg'><br>Clear the search field and try again</div>";`
}


