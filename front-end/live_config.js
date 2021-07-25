
var token, userId, channelId;
var apiUrl = 'https://dev-ptcg-api.herokuapp.com/pokemonunite'

window.Twitch.ext.onAuthorized((auth) => {
  token = auth.token;
  userId = auth.userId;
  channelId = auth.channelId
});

window.onload = function()
{
  EventHandlers();
  GetInformation();  
}

function EventHandlers() {  
  document.getElementById("new").addEventListener("click",function() {NewBuild()})
  document.getElementById("existing").addEventListener("click",function() {ExistingBuild()})
  document.getElementById("pokemon").addEventListener("change",function() {GetMoves()})
  document.getElementById("buildId").addEventListener("change",function() {GetBuild()})
  document.getElementById("submit").addEventListener("click",function() {Submit()})
  document.getElementById("updateAndPush").addEventListener("click",function() {Update()})
  document.getElementById("updateAndPush").addEventListener("click",function() {Submit()})
}

function ExistingBuild() 
{
  document.getElementById("success").textContent = ""
  var buildName = $("#buildId")
  $("#existingBuild").show();
  $("#newBuild").hide();
  $("#updateAndPush").show();
  $("#submit").hide()

  channelId = "test"
  $.ajax({
    type: "GET",
    url: apiUrl + "/allBuilds/"+channelId,
    success: function(data) {
    var htmlOptions = [];
    if(typeof data != 'undefined')
    {
    if( data.length ) {
          for( item in data ) {
              html = '<option value="' + data[item].buildName + '">' + data[item].buildName + '</option>';
          htmlOptions[htmlOptions.length] = html;
          }
          buildName.empty().append( htmlOptions.join('') );
      }
      else
      {        
        html = '<option value="' + data.buildName + '">' + data.buildName + '</option>';
        htmlOptions[0] = html;
        buildName.empty().append( htmlOptions.join('') );
      }
    }
    },
    error: function(error) {
        alert(error.responseJSON.message);
    }
      })
  GetBuild()
}

function NewBuild() 
{
  document.getElementById("success").textContent = ""
  $("#newBuild").show();
  $("#existingBuild").hide();
  $("#updateAndPush").hide();
  $("#submit").show()
  GetInformation()
}

function Submit() {
  channelId = "test"
  var buildName = $("#buildName").val() 
  var pokemonName = $("#pokemon").val()     
  var battleItemSelect = $("#battleItem").val()
  var heldItem1Select = $("#heldItem1").val()
  var heldItem2Select = $("#heldItem2").val()
  var heldItem3Select = $("#heldItem3").val()
  var move1 = $("#firstMove").val()
  var move2 = $("#secondMove").val()

  if(heldItem1Select == heldItem2Select || heldItem1Select == heldItem3Select || heldItem2Select == heldItem3Select)
  { 
    document.getElementById("success").style.color = "red"
    document.getElementById("success").textContent = "Can't have two of the same Items!"
    return
  }
  if(buildName == "")
  { 
    document.getElementById("success").style.color = "red"
    document.getElementById("success").textContent = "Need a build name!"
    return
  }

  var settings = {
    "url": apiUrl+"/upsert/"+buildName+"/"+pokemonName+"/"+move1+"/"+move2+"/"+battleItemSelect+"/"+heldItem1Select+"/"+heldItem2Select+"/"+heldItem3Select+"/"+channelId,
    "method": "POST",
    "timeout": 0,
  };
  
  $.ajax(settings).done(function (response) {
    document.getElementById("success").style.color = "green"
    document.getElementById("success").textContent = "SUCCESS!"
  });
}

function Update() {
  channelId = "test"
  var buildName = $("#buildId").val() 
  var pokemonName = $("#pokemon").val()     
  var battleItemSelect = $("#battleItem").val()
  var heldItem1Select = $("#heldItem1").val()
  var heldItem2Select = $("#heldItem2").val()
  var heldItem3Select = $("#heldItem3").val()
  var move1 = $("#firstMove").val()
  var move2 = $("#secondMove").val()

  if(heldItem1Select == heldItem2Select || heldItem1Select == heldItem3Select || heldItem2Select == heldItem3Select)
  { 
    document.getElementById("success").style.color = "red"
    document.getElementById("success").textContent = "Can't have two of the same Items!"
    return
  }
  if(buildName == "")
  { 
    document.getElementById("success").style.color = "red"
    document.getElementById("success").textContent = "Need a build name!"
    return
  }

  var settings = {
    "url": apiUrl+"/upsert/"+buildName+"/"+pokemonName+"/"+move1+"/"+move2+"/"+battleItemSelect+"/"+heldItem1Select+"/"+heldItem2Select+"/"+heldItem3Select+"/"+channelId,
    "method": "POST",
    "timeout": 0,
  };

  $.ajax(settings).done(function (response) {
    document.getElementById("success").style.color = "green"
    document.getElementById("success").textContent = "SUCCESS!"
  });
}

function GetInformation(){
  document.getElementById("success").textContent = ""
  var pokemonSelect = $("#pokemon");
  var battleItemSelect = $("#battleItem")
  var heldItem1Select = $("#heldItem1")
  var heldItem2Select = $("#heldItem2")
  var heldItem3Select = $("#heldItem3")
  var buildName = $("#buildId")
  pokemonSelect.empty()
  
  $.ajax({
    type: "GET",
    url: apiUrl + "/pokemon",
    success: function(data) {
    var htmlOptions = [];
    if( data.length ) {
          for( item in data ) {
              html = '<option value="' + data[item].name + '">' + data[item].name + '</option>';
              move1Html = '<option value="' + data[item].name + '">' + data[item].name + '</option>';
              move2Html = '<option value="' + data[item].name + '">' + data[item].name + '</option>';
          htmlOptions[htmlOptions.length] = html;
          }

          pokemonSelect.empty().append( htmlOptions.join('') );
          GetMoves()
      }
    },
    error: function(error) {
        alert(error.responseJSON.message);
    }
      })


  $.ajax({
    type: "GET",
    url: apiUrl + "/items?type=battle",
    success: function(data) {
    var htmlOptions = [];
    if( data.length ) {
          for( item in data ) {
              html = '<option value="' + data[item].name + '">' + data[item].name + '</option>';
          htmlOptions[htmlOptions.length] = html;
          }

          battleItemSelect.empty().append( htmlOptions.join('') );
      }
    },
    error: function(error) {
        alert(error.responseJSON.message);
    }
      })

  $.ajax({
    type: "GET",
    url: apiUrl + "/items?type=held",
    success: function(data) {
    var htmlOptions = [];
    if( data.length ) {
          for( item in data ) {
              html = '<option value="' + data[item].name + '">' + data[item].name + '</option>';
          htmlOptions[htmlOptions.length] = html;
          }

          heldItem1Select.empty().append( htmlOptions.join('') );
          heldItem2Select.empty().append( htmlOptions.join('') );
          heldItem3Select.empty().append( htmlOptions.join('') );
      }
    },
    error: function(error) {
        alert(error.responseJSON.message);
    }
      })

  channelId = "test"
  $.ajax({
    type: "GET",
    url: apiUrl + "/allBuilds/"+channelId,
    success: function(data) {
    var htmlOptions = [];
    if(typeof data != 'undefined')
    {
    if( data.length ) {
          for( item in data ) {
              html = '<option value="' + data[item].buildName + '">' + data[item].buildName + '</option>';
          htmlOptions[htmlOptions.length] = html;
          }
          buildName.empty().append( htmlOptions.join('') );
      }
      else
      {        
        html = '<option value="' + data.buildName + '">' + data.buildName + '</option>';
        htmlOptions[0] = html;
        buildName.empty().append( htmlOptions.join('') );
      }
    }
    },
    error: function(error) {
        alert(error.responseJSON.message);
    }
      })
}

function GetBuild()
{
  channelId = "test"
  var pokemonSelect = $("#pokemon");
  var battleItemSelect = $("#battleItem")
  var heldItem1Select = $("#heldItem1")
  var heldItem2Select = $("#heldItem2")
  var heldItem3Select = $("#heldItem3")
  var firstMoveSelect = $("#firstMove")
  var secondMoveSelect = $("#secondMove")
  buildName = $("#buildId").val()
  $.ajax({
    type: "GET",
    url: apiUrl + "/allBuilds/"+channelId,
    success: function(data) {
      if(typeof data != 'undefined')
        {
          if( data.length ) {
            for(index in data)
            {
                if(data[index].buildName == buildName)
                {
                    pokemonSelect.val(data[index].pokemonName)
                    GetMoves()
                    firstMoveSelect.val(data[index].move1)
                    secondMoveSelect.val(data[index].move2)
                    battleItemSelect.val(data[index].battleItem)
                    heldItem1Select.val(data[index].heldItem1)
                    heldItem2Select.val(data[index].heldItem2)
                    heldItem3Select.val(data[index].heldItem3)
                    break
                }
              }
            }
            else
            { 
              
                if(data.buildName == buildName)
                {
                  pokemonSelect.val(data.pokemonName) 
                  GetMoves()
                  firstMoveSelect.val(data.move1)
                  secondMoveSelect.val(data.move2)
                  battleItemSelect.val(data.battleItem)
                  heldItem1Select.val(data.heldItem1)
                  heldItem2Select.val(data.heldItem2)
                  heldItem3Select.val(data.heldItem3)
                }
              
            }
          }
      
    },
    error: function(error) {
        alert(error.responseJSON.message);
    }
      })
}

function GetMoves()
{
    var pokemonSelect = $("#pokemon").val();
    var firstMoveSelect = $("#firstMove")
    var secondMoveSelect = $("#secondMove")
    firstMoveSelect.empty()
    secondMoveSelect.empty()

    
    $.ajax({
      type: "GET",
      url: apiUrl + "/pokemon",
      success: function(data) {
      var move1HtmlOptions = []
      var move2HtmlOptions = []
      if( data.length ) {
            for( item in data ) {
                if(data[item].name == pokemonSelect)
                {
                  move1Html = '<option value="' + data[item].moves[4].name + '">' + data[item].moves[4].name + '</option>';
                  move1HtmlOptions[move1HtmlOptions.length] = move1Html;
                  move1Html = '<option value="' + data[item].moves[5].name + '">' + data[item].moves[5].name + '</option>';
                  move1HtmlOptions[move1HtmlOptions.length] = move1Html;
                  move2Html = '<option value="' + data[item].moves[6].name + '">' + data[item].moves[6].name + '</option>';
                  move2HtmlOptions[move2HtmlOptions.length] = move2Html;
                  move2Html = '<option value="' + data[item].moves[7].name + '">' + data[item].moves[7].name + '</option>';
                  move2HtmlOptions[move2HtmlOptions.length] = move2Html;
                  break
                }
            }
  
            firstMoveSelect.empty().append( move1HtmlOptions.join('') );
            secondMoveSelect.empty().append( move2HtmlOptions.join('') );
        }
      },
      error: function(error) {
          alert(error.responseJSON.message);
      }
        })
}