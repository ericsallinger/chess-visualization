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
  console.log(reversedRanks)
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
      // console.log(squareCounter + " : " +files[fileProx % 8] + " : " + reversedRanks[rankProx % 8]);
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
};

//flip board
document.getElementById("btn-flip").onclick = function () {
  asWhite
    ? (document.getElementById("btn-flip").innerHTML = "Black")
    : (document.getElementById("btn-flip").innerHTML = "White");
  asWhite = !asWhite;
  if(gameActive){
    toggleGameState();
  }
  buildBoard();
  nameSquares();

};

function toggleGameState() {
  if(!gameActive){
    document.getElementById("btn-start").innerHTML = "Stop";
    buildBoard();
    nameSquares();
    setActiveSquare();
  }
  else{
    document.getElementById("btn-start").innerHTML = "Start";
  }
  gameActive = !gameActive;
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