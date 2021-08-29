const pokeurl = "https://ptcg-api.herokuapp.com/pokemonunite"

var AllPokemon = [];
var AllItems = [];
var Move1, Move2, HeldItem1, HeldItem2, HeldItem3, BattleItem, PokemonForBuild


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
    document.getElementById("refreshNoBuildsFound").addEventListener("click",function() {Refresh()})
    document.getElementById("refresh").addEventListener("click",function() {Refresh()})
}

function Refresh()
{
    Setup(GetPokemon)
    $("#contentDesc").text("Click a move or item to see a description of it in this box!")
    $("#contentName").text("")
    //$("#contentLevel").text("")
    $("#contentType").text("")
    $("#contentCooldown").text("")
    //$("#contentUpgrade").text("")
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
              PokemonForBuild = AllPokemon.find(function(pokemon){if(pokemon.Name == data.pokemonName) return pokemon})
              $("#pokemonImg").attr("src",PokemonForBuild.ImageLink)              
              $("#pokemonName").text(PokemonForBuild.Name) 
              Move1 = PokemonForBuild.Moves.find(function(move){if(move.Name == data.move1) return move})
              Move2 = PokemonForBuild.Moves.find(function(move){if(move.Name == data.move2) return move})
              HeldItem1 = AllItems.find(function(item){if(item.Name == data.heldItem1) return item})
              HeldItem2 = AllItems.find(function(item){if(item.Name == data.heldItem2) return item})
              HeldItem3 = AllItems.find(function(item){if(item.Name == data.heldItem3) return item})
              BattleItem = AllItems.find(function(item){if(item.Name == data.battleItem) return item}) 
              
              $("#move1img").attr("src",Move1.ImageLink)  
              $("#move1txt").text(Move1.Name)    
              $("#move2img").attr("src",Move2.ImageLink)     
              $("#move2txt").text(Move2.Name)       
              $("#battleItemImg").attr("src",BattleItem.ImageLink) 
              $("#heldItem1Img").attr("src",HeldItem1.ImageLink) 
              $("#heldItem2Img").attr("src",HeldItem2.ImageLink) 
              $("#heldItem3Img").attr("src",HeldItem3.ImageLink) 
              $("#nobuildsfound").hide()
              $("#viewer").show()
            }
            else{
                $("#nobuildsfound").show()
                $("#viewer").hide()
            }
          
        },
        error: function(error) {
            alert(error.responseJSON.message);
        }
          })
}

function LoadInformationIntoContentArea(area)
{
    switch(area)
    {
        case "move1":
            $("#contentName").text(Move1.Name)
            //$("#contentLevel").text(Move1.Levels.replace(" (Choose One)",""))
            $("#contentDesc").text(Move1.Description)
            $("#contentType").text("("+Move1.Type+")")
            $("#contentCooldown").text(Move1.Cooldown)
            //$("#contentUpgrade").text(Move1.Upgrade)
            break;
        case "move2":
            $("#contentName").text(Move2.Name)
            //$("#contentLevel").text(Move2.Levels.replace(" (Choose One)",""))
            $("#contentDesc").text(Move2.Description)
            $("#contentType").text("("+Move2.Type+")")
            $("#contentCooldown").text(Move2.Cooldown)
            //$("#contentUpgrade").text(Move2.Upgrade)
            break;
        case "battleItem":
            $("#contentName").text(BattleItem.Name)
            $("#contentDesc").text(BattleItem.Description)
            //$("#contentLevel").text("")
            $("#contentType").text("")
            $("#contentCooldown").text("")
            //$("#contentUpgrade").text("")
            break;
        case "heldItem1":
            $("#contentName").text(HeldItem1.Name)
            $("#contentDesc").text(HeldItem1.Description)
            //$("#contentLevel").text("")
            $("#contentType").text("")
            $("#contentCooldown").text("")
            //$("#contentUpgrade").text("")
            break;
        case "heldItem2":
            $("#contentName").text(HeldItem2.Name)
            $("#contentDesc").text(HeldItem2.Description)
            //$("#contentLevel").text("")
            $("#contentType").text("")
            $("#contentCooldown").text("")
            //$("#contentUpgrade").text("")
            break;
        case "heldItem3":
            $("#contentName").text(HeldItem3.Name)
            $("#contentDesc").text(HeldItem3.Description)
            //$("#contentLevel").text("")
            $("#contentType").text("")
            $("#contentCooldown").text("")
            //$("#contentUpgrade").text("")
            break;
    }

}
