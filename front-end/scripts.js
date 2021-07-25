const pokeurl = "https://ptcg-api.herokuapp.com/pokemonunite"

var AllPokemon = [];
var AllItems = [];

function Pokemon(name, type, stats, moves, imageLink)
{
    this.Name = name;
    this.Type = type;
    this.Stats = stats;
    this.Moves = moves;
    this.ImageLink = imageLink;
}

function Type(distance, style, difficulty)
{
    this.Distance = distance;
    this.Style = style;
    this.Difficulty = difficulty;
}

function Stats(offense, endurance, mobility, scoring, support)
{
    this.Offense = offense;
    this.Endurance = endurance;
    this.Mobility = mobility;
    this.Scoring = scoring;
    this.Support = support;
}

function Move(name, desc, type, cooldown, upgrade, levels, imageLink)
{
    this.Name = name;
    this.Description = desc;
    this.Type = type;
    this.Cooldown = cooldown;
    this.Upgrade = upgrade;
    this.Levels = levels;
    this.ImageLink = imageLink
}

function Item(name, type, desc, imageLink)
{    
    this.Name = name;
    this.Description = desc;
    this.Type = type;
    this.ImageLink = imageLink
}

window.onload = function()
{
    this.Setup(GetPokemon);    
}

function Setup(GetPokemonCallback)
{
    GetPokemonCallback(GetItems)
}

function GetPokemon(GetItemsCallback)
{
    var moves = []
    var apiUrl = pokeurl+"/pokemon";
            fetch(apiUrl).then(response => {
            return response.json();
            }).then(data => {
                for(index in data) {
                    pokemonName = data[index].name
                    pokemonType = new Type(data[index].type.distance,data[index].type.style,data[index].type.difficulty)
                    pokemonStats = new Stats(data[index].stats.offense,data[index].stats.endurance,data[index].stats.mobility,data[index].stats.scoring,data[index].stats.support)
                    for(move in data[index].moves)
                    {
                        moves.push(new Move(data[index].moves[move].name, data[index].moves[move].description, data[index].moves[move].type, data[index].moves[move].cooldown, data[index].moves[move].upgrade, data[index].moves[move].levels, data[index].moves[move].imageLink))
                    }
                    AllPokemon.push(new Pokemon(pokemonName, pokemonType, pokemonStats, moves, data[index].imageLink))
                    moves=[]
                }
                GetItemsCallback(LoadBuild);
            }).catch(err => {
                console.log(err)
            });
}

function GetItems(LoadBuildCallback)
{
    var apiUrl = pokeurl+"/items";
    fetch(apiUrl).then(response => {
    return response.json();
    }).then(data => {
        for(index in data) {
            AllItems.push(new Item(data[index].name, data[index].type, data[index].description, data[index].imageLink))
        }
        LoadBuildCallback();
    }).catch(err => {
        console.log(err)
    });

}

function LoadBuild()
{
    console.log(AllItems)
}