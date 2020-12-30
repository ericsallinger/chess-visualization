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
var asWhite = true;
var timerDuration = 60000;

buildBoard();
nameSquares();
initSquaresDict()

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
  squareDiv.addEventListener("click", function(){checkCorrect(this)})
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
    document.getElementById("btn-start").innerHTML = "Stop";
    buildBoard();
    nameSquares();
    setActiveSquare();
    startTimer();
  }
  //pause game
  else {
    document.getElementById("btn-start").innerHTML = "Start";
  }
  
}

function checkCorrect(element){
  if(gameActive){
    if(element.getAttribute("id") == activeSquareName){
      let hitsElement = document.getElementById("score-box-hit-score");
      let currentHits = hitsElement.innerHTML;
      currentHits = Number(currentHits) + 1;
      hitsElement.innerHTML = String(currentHits);
    }
    else{
      let missesElement = document.getElementById("score-box-miss-score");
      let currentMisses = missesElement.innerHTML;
      currentMisses = Number(currentMisses) + 1;
      missesElement.innerHTML = String(currentMisses);
    }
    setActiveSquare();
  }
}

function setActiveSquare(){
  if(activeSquareName != null){
    document.getElementById(activeSquareName).classList.remove("active-square");
  }
  var randSquareNum = Math.floor(
    Math.random() * Math.floor(Object.keys(squaresDict).length)
  );
  activeSquareName = Object.keys(squaresDict)[randSquareNum];
  let activeSquareElement = document.getElementById(activeSquareName);
  activeSquareElement.className += " active-square";
  document.getElementById("active-prompt").innerHTML = activeSquareName;
}

function startTimer(){
  var startTime = new Date()
  var timerElement = document.getElementById("timer");
  console.log(timerDuration)
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