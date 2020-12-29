var board = document.getElementsByClassName("board-container")[0];

var ranks = ["1","2","3","4","5","6","7","8"];
var files = ["a","b","c","d","e","f","g","h"];
buildBoard()

function buildBoard(){
    let i;
    let j;
    let dark = false;
    for (i = 0; i < files.length; i++) {
      for (j = 0; j < ranks.length; j++) {
        console.log(files[i] + ranks[j]);
        createSquare(files[i],ranks[j],dark)
        if (dark) {
            // flip bool
        }
      }
    }
};

function createSquare(file,rank){
    var squareDiv = document.createElement("span");
    squareDiv.setAttribute("class","board-square")
    squareDiv.setAttribute("id", file+rank);
    board.appendChild(squareDiv)

}