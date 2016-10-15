var touchstartEvent = 'ontouchstart' in document.documentElement?"touchstart":"mousedown";
var touchendEvent = 'ontouchstart' in document.documentElement?"touchend":"mouseup";
var variant = getParameterByName("variant")?getParameterByName("variant"):"";

var isDead = false;

var buttons = document.querySelectorAll(".controls div");
for (var x=0; x<buttons.length; x++){
  var button = buttons[x];
  button.addEventListener("touchstart",function(){
    this.classList.add("active");
    window.navigator.vibrate([60]);
  });

  button.addEventListener("touchend",function(){
    this.classList.remove("active");
  });
}

var playerColor;
var playerKey = localStorage.getItem("playerKey");
// var playersRef = new Firebase('https://goingcommando.firebaseio.com/'+variant+'/players');
var playersRef = firebase.database().ref(variant+'/players');

//already have player key in memory
if (playerKey){
  // var playerRef = new Firebase('https://goingcommando.firebaseio.com/'+variant+'/players/' + playerKey);
  var playerRef = firebase.database().ref(variant+'/players/' + playerKey);
  playerRef.once("value",function(snapshot){

    var commando = snapshot.val();

    ///commando already exists
    if (commando){
      document.body.style.backgroundColor = "#"+commando.color;
      attachRefHandler(playerRef);
    }
    else{
      playerKey = makeNewCommando();
      localStorage.setItem("playerKey",playerKey);
    }

  });

}
else{
  //make new commando
  playerKey = makeNewCommando();
  localStorage.setItem("playerKey",playerKey);
}

function makeNewCommando(){
   playerColor = (function co(lor){   return (lor +=
  [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
  && (lor.length == 6) ?  lor : co(lor); })('');
   document.body.style.backgroundColor = "#"+playerColor;

   var playerId = new Date().getTime();
   var newPlayerRef = playersRef.push();
  newPlayerRef.set({
    color: playerColor,
    id: newPlayerRef.key
    // id: playerId
  });
  localStorage.setItem("playerKey", newPlayerRef.key);
  // localStorage.setItem("playerKey", playerId);
  localStorage.setItem("playerColor", playerColor);

  attachRefHandler(newPlayerRef);

  return newPlayerRef.key;
  // return playerId;
}

function attachRefHandler(ref){
 ref.on('value', function(snapshot) {
    var commando = snapshot.val();

    if (commando && commando.kills){
      document.querySelector(".kills").innerHTML = "kills: "+ (commando.kills?commando.kills:0);
    }

    if (commando && commando.isDead){
      document.querySelector(".controls").classList.add("dead");
      window.navigator.vibrate([500,200,500,200,500]);
    }
  });
}


// var ordersRef = new Firebase('https://goingcommando.firebaseio.com/'+variant+'/orders');
var ordersRef = firebase.database().ref(variant+'/orders');

document.querySelector(".left").addEventListener(touchstartEvent,function(){
  var newOrderRef = ordersRef.push();
  newOrderRef.set({direction: "left", "id": playerKey})
})

document.querySelector(".right").addEventListener(touchstartEvent,function(){
  var newOrderRef = ordersRef.push();
  newOrderRef.set({direction: "right", "id": playerKey})
})

document.querySelector(".up").addEventListener(touchstartEvent,function(){
  var newOrderRef = ordersRef.push();
  newOrderRef.set({direction: "up", "id": playerKey})
})

document.querySelector(".down").addEventListener(touchstartEvent,function(){
  var newOrderRef = ordersRef.push();
  newOrderRef.set({direction: "down", "id": playerKey})
})


//utils

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    url = url.toLowerCase(); // This is just to avoid case sensitiveness
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
