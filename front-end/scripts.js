const pokeurl = "https://dev-ptcg-api.herokuapp.com/pokemonunite"

var AllPokemon = [];
var AllItems = [];
var Move1, Move2, HeldItem1, HeldItem2, HeldItem3, BattleItem


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

window.Twitch.ext.onAuthorized((auth) => {
    token = auth.token;
    userId = auth.userId;
    channelId = auth.channelId
  });

window.onload = function()
{
    EventListeners()
    this.Setup(GetPokemon);    
}

function EventListeners()
{
    document.getElementById("move1img").addEventListener("click",function() {LoadInformationIntoContentArea("move1")})
    document.getElementById("move2img").addEventListener("click",function() {LoadInformationIntoContentArea("move2")})
    document.getElementById("heldItem1").addEventListener("click",function() {LoadInformationIntoContentArea("heldItem1")})
    document.getElementById("heldItem2").addEventListener("click",function() {LoadInformationIntoContentArea("heldItem2")})
    document.getElementById("heldItem3").addEventListener("click",function() {LoadInformationIntoContentArea("heldItem3")})
    document.getElementById("battleItem").addEventListener("click",function() {LoadInformationIntoContentArea("battleItem")})
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
    $.ajax({
        type: "GET",
        url: pokeurl + "/build/"+channelId,
        success: function(data) {
          if(typeof data != 'undefined')
            {
              $("#pokemonImg").attr("src",AllPokemon[0].ImageLink)              
              $("#pokemonName").text(data.pokemonName)  
              Move1 = GetMove(data.move1)
              Move2 = GetMove(data.move2)
              HeldItem1 = GetItem(data.heldItem1)
              HeldItem2 = GetItem(data.heldItem2)
              HeldItem3 = GetItem(data.heldItem3)
              BattleItem = GetItem(data.battleItem) 
              
              $("#move1img").attr("src",Move1.ImageLink)  
              $("#move1txt").text(Move1.Name)    
              $("#move2img").attr("src",Move2.ImageLink)     
              $("#move2txt").text(Move2.Name)       
              $("#battleItemImg").attr("src",BattleItem.ImageLink) 
              $("#heldItem1Img").attr("src",HeldItem1.ImageLink) 
              $("#heldItem2Img").attr("src",HeldItem2.ImageLink) 
              $("#heldItem3Img").attr("src",HeldItem3.ImageLink) 
            }
          
        },
        error: function(error) {
            alert(error.responseJSON.message);
        }
          })
}

function GetMove(moveName)
{
    AllPokemon.forEach(pokemon => {
        pokemon.Moves.forEach(move => {
            if(move.Name == moveName)
            {
                return move
            }
        })
        
    });
}

function GetItem(itemName)
{
    AllItems.forEach(item => {
        if (item.Name == itemName)
        {
            return item;
        }
    })
}

function LoadInformationIntoContentArea()
{

}