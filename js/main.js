var board = document.getElementsByClassName("board-container")[0];

var ranks = ["1","2","3","4","5","6","7","8"];
var files = ["a","b","c","d","e","f","g","h"];
buildBoard()

function buildBoard(){
    let i;
    let j;
    let dark = false;
    let flip = false;
    for (i = 0; i < files.length; i++) {
      flip = !flip      
      flip ? dark = true: dark = false;     
      for (j = 0; j < ranks.length; j++) { 
        createSquare(files[i],ranks[j],dark)
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
    squareDiv.setAttribute("id", file+rank);
    board.appendChild(squareDiv);

}