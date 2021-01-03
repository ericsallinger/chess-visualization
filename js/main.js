//speech recognition
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var squares = ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2', 
                    'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3', 'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4', 
                    'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5', 'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6', 
                    'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7', 'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'];
var grammar = "#JSGF V1.0; grammar squares; public <color> = ( " + squares.join(" | ") +" );";

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 0;

recognition.onresult = function (event) {
  var spokenSquare = event.results[0][0].transcript;
  spokenSquare = spokenSquare.toLowerCase()
  // console.log(spokenSquare + " Confidence: " + event.results[0][0].confidence);
  if (squares.includes(spokenSquare)){
    var id = document.getElementById(spokenSquare).getAttribute("id");
    document.getElementById("active-prompt").innerHTML = id;
    console.log(id)
    checkCorrect(id);
  } 
};

var board = document.getElementsByClassName("board-container")[0];
var activeSquareName = null;

var ranks;
var reversedRanks;
ranks = ["1","2","3","4","5","6","7","8"];
reversedRanks = ranks.slice().reverse();
var files;
var reversedFiles;
files = ["a","b","c","d","e","f","g","h"];
reversedFiles = files.slice().reverse();
var squaresDict = {}
var gameActive = false;
var gameMode = "name"
var gameMethod = "type"
var asWhite = true;
var timerDuration = 60000;

buildBoard();
nameSquares();
initSquaresDict()

//TODO build into tracking which squares you frequently miss
function initSquaresDict(){
  let i;
  let j;
  for (i = 0; i < ranks.length; i++) {
    for (j = 0; j < files.length; j++) {
      squaresDict[files[j] + ranks[i]] = 0;
    }
  }
}

function buildBoard(){
  board.innerHTML = "";
  let i;
  let j;
  let dark = true;
  let flip = true; 


  for (i = 0; i < ranks.length; i++) {
    flip = !flip      
    flip ? dark = true: dark = false;     
    for (j = 0; j < files.length; j++) { 
      createSquare(ranks[i],files[j],dark)
      dark = !dark
    }
  }
};

function createSquare(file,rank,dark){
  var squareDiv = document.createElement("span");
  squareDiv.className = "board-square";
  if(dark){ 
    squareDiv.className += " dark-square";
  }
  else{
    squareDiv.className += " light-square";
  }
  // squareDiv.setAttribute("id", rank+file);
  squareDiv.addEventListener("click", function(){checkCorrect(this.getAttribute("id"));})
  board.appendChild(squareDiv);
}

//name squares by convention based on whether playing as white or black
function nameSquares() {
  var squares = board.children;
  var squareCounter = 0;
  var sidedRanks;
  var sidedFiles;

  if(asWhite){
    sidedRanks = reversedRanks;
    sidedFiles = files;
  }
  else{
    sidedRanks = ranks;
    sidedFiles = reversedFiles;
  }
  for (var rankProx = 0; rankProx < squares.length/8; rankProx++) {
    for (var fileProx = 0; fileProx < squares.length/8; fileProx++) {
      var square = squares[squareCounter];
      square.setAttribute("id", sidedFiles[fileProx % 8] + sidedRanks[rankProx % 8]);
      squareCounter++;
    }
  }
}

document.getElementById("btn-start").onclick = function () {
  toggleGameState();
};

//reset scoreboard
document.getElementById("btn-reset").onclick = function () {
  document.getElementById("score-box-hit-score").innerHTML = "0";
  document.getElementById("score-box-miss-score").innerHTML = "0";
  document.getElementById("active-prompt").innerHTML = "--";
  document.getElementById("timer").innerHTML = "1:00";
  if(gameActive){
    toggleGameState();
  }
  drawSideShadows();
};

//flip board
document.getElementById("btn-flip").onclick = function () {
  asWhite = !asWhite;
  drawSideShadows();
  if(gameActive){
    toggleGameState();
  }
  buildBoard();
  nameSquares();
};

function toggleGameState() {
  //start game
  gameActive = !gameActive;
  if (gameActive) {
    //when click start
    document.getElementById("btn-start").innerHTML = "Stop";
    document.getElementById("btn-config").style.opacity = "0.5";
    configBtn.onclick = function () {
      modal.style.display = "none";
    };
    buildBoard();
    nameSquares();
    setActiveSquare();
    startTimer();
    if (gameMode == "name") {
      if (gameMethod == "voice") {
        recognition.start();
      }
      else if (gameMethod == "type"){
        var inputField = document.getElementsByClassName("square-input")[0];
        var promptBox = document.getElementById("active-prompt");
        inputField.style.display = "block";
        promptBox.style.display = "none";
        inputField.focus();
      }
    }
  }
  else {
    //when click stop
    document.getElementById("btn-start").innerHTML = "Start";
    document.getElementById("btn-config").style.opacity = "1";
    configBtn.onclick = function () {
      modal.style.display = "block";
    };
    if(gameMode == "name"){
      recognition.stop();
    }
  }
  
}

function checkCorrect(id){   
  if(gameActive){
    if (gameMode == "name" && gameMethod == "voice") {
      recognition.stop();
    }
    delay(200).then(function() {
      if (gameMode == "name" && gameMethod == "voice") {
        recognition.start();
      }
      if(id == activeSquareName){
        let hitsElement = document.getElementById("score-box-hit-score");
        let currentHits = hitsElement.innerHTML;
        currentHits = Number(currentHits) + 1;
        hitsElement.innerHTML = String(currentHits);
        setActiveSquare();
        return true;
      }
      else{
        let missesElement = document.getElementById("score-box-miss-score");
        let currentMisses = missesElement.innerHTML;
        currentMisses = Number(currentMisses) + 1;
        missesElement.innerHTML = String(currentMisses);
        setActiveSquare();
        return false;
      }
    });
  }
}
function delay(t, v) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

function setActiveSquare(){
  if(activeSquareName != null){
    document.getElementById(activeSquareName).classList.remove("active-square");
  }
  var randSquareNum = Math.floor(
    Math.random() * Math.floor(Object.keys(squaresDict).length)
  );
  activeSquareName = Object.keys(squaresDict)[randSquareNum];
  
  if(gameMode == "click"){
    document.getElementById("active-prompt").innerHTML = activeSquareName;
  }
  else{
    let activeSquareElement = document.getElementById(activeSquareName);
    activeSquareElement.className += " active-square";
  }
}

function startTimer(){
  var startTime = new Date()
  var timerElement = document.getElementById("timer");
  startTime = startTime.getTime()+timerDuration;
  timerElement.innerHTML = "0:59";

  //countdown logic
  setTimeout(function run() {
    var timeExpired = isTimeExpired(startTime);
    if(gameActive){
      if (!timeExpired) {
        setTimeout(run, 1000);
      } else {
        toggleGameState();
      }
    }

  }, 1000);
}

function isTimeExpired(startTime){
  //returns bool, draws time and last 10s countdown styling
  var currentTime = new Date().getTime();
  if(currentTime < startTime){
    var timerElement = document.getElementById("timer");
    var secondsRemaining = Math.floor((startTime - currentTime)/1000);
    if(secondsRemaining >= 10){
      timerElement.innerHTML = "0:" + String(secondsRemaining);
    }
    else if (secondsRemaining < 10 && secondsRemaining%2 == 0) {
      board.style.boxShadow = "0 0 30px red";
      timerElement.innerHTML = "0:0" + String(secondsRemaining);
    }
    else{
      drawSideShadows()
      timerElement.innerHTML = "0:0" + String(secondsRemaining);
    }
    return false;
  }
  else{
    return true;
  }
}

function drawSideShadows(){
  if (asWhite == false) {
    document.getElementById("btn-flip").innerHTML = "Black";
    board.style.boxShadow = "0px 20px 10px -2px black, 0px -13px 4px white";
  } else {
    document.getElementById("btn-flip").innerHTML = "White";
    board.style.boxShadow = "0px 20px 10px -2px white, 0px -13px 4px black";
  }
};

//open config modal
var configBtn = document.getElementById("btn-config");
var modal = document.getElementById("modal-config");
configBtn.onclick = function(){
  modal.style.display = "block";
}

var modeBtn = document.getElementById("btn-mode");
modeBtn.onclick = function () {
  toggleGameMode();
};

function toggleGameMode(){
  if(gameMode == "click"){
    document.getElementById("mode-setting").innerHTML = "name square";
    gameMode = "name"
  }
  else{
     document.getElementById("mode-setting").innerHTML = "click square";
     gameMode = "click";
  }
}

var methodBtn = document.getElementById("btn-method");
methodBtn.onclick = function () {
  toggleGameMethod();
};

function toggleGameMethod() {
  if (gameMethod == "voice") {
    document.getElementById("method-setting").innerHTML = "type square name";
    gameMethod = "type";
  } else {
    document.getElementById("method-setting").innerHTML = "speak square name";
    gameMethod = "voice";
  }
}

//text input game method
var input = document.getElementsByClassName("square-input")[0];

// listen for enter button on text input
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    // Trigger the button element with a click
    // document.getElementById("myBtn").click();
    checkCorrect(input.value);
    input.value="";
  }
});

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (gameMode == "name" && gameActive && gameMethod == "voice") {
    recognition.abort();
    delay(200).then(function () {
      recognition.start();
    });
  }
};

//flip between timer and speed modes






