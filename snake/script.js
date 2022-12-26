//board
let blockSize;
let rows = 20;
let cols = 20;
let board;
let outline;
let video;
let boardX = 2.5; 
let boardY = 2.5;
let context;
let foodpos
let snakepos;
var startX, startY, moveX, moveY;

//blocksize
let screenW = screen.width
let screenH = screen.height
if(screenW>=1100 && screenH>=768){
    blockSize=30;
}
else if(screenW>=820 && screenH>=660){
    blockSize=25;
}
else if(screenW>=736 && screenH>=630){
    blockSize=20;
}
else{
    blockSize=15;
}

//snake
let snakeX = (random(1,rows-1)*blockSize)+boardX;
let snakeY = (random(1,cols-1)*blockSize)+boardY;
let velocityX = 0;
let velocityY = 0;
let snakeBody = [];

//food
let foodX = 0;
let foodY = 0;

//game

let gameOver = false;
let score = 0;


function random(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.addEventListener('load', function(){
    snakepos = document.getElementById("snake-position")
    foodpos = document.getElementById("food-position")
    audio = document.getElementById("audio");
    video = document.getElementById("video");
    board = document.getElementById("board");
    board.width = (rows*blockSize)+5;
    board.height = (cols*blockSize)+5;
    context = board.getContext("2d");
    placeFood();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 1000/10);
})

function drawBoard(){
    context.beginPath()
    //grid board
    let n = 0.5
    for(let x = boardY; x<cols*blockSize; x+=blockSize*2){
        for(let i = boardX; i<rows*blockSize; i+=blockSize*2){
            context.fillStyle = "rgb(38,53,69)";
            context.fillRect(i,x,blockSize+n,blockSize+n);
        }
        for(let j = boardX+blockSize; j<rows*blockSize; j+=blockSize*2){
            context.fillStyle = "rgb(31,41,55)";
            context.fillRect(j,x,blockSize+n,blockSize+n);
        }
    }
    for(let x = boardY+blockSize; x<cols*blockSize; x+=blockSize*2){
        for(let i = boardX+blockSize; i<rows*blockSize; i+=blockSize*2){
            context.fillStyle = "rgb(38,53,69)";
            context.fillRect(i,x,blockSize+n,blockSize+n);
        }
        for(let j = boardX; j<rows*blockSize; j+=blockSize*2){
            context.fillStyle = "rgb(31,41,55)";
            context.fillRect(j,x,blockSize+n,blockSize+n);
        }
    }
    //outline
    context.lineWidth = 2;
    context.strokeStyle = "white";
    context.rect(0,0,board.width,board.height)
    context.stroke()
}


function update(){
    if(gameOver){
        video.play(); 
        document.querySelector("p").style.display = "block"
        return 0
    }
    
    //draw board
    drawBoard()

    //draw food
    context.beginPath()
    context.strokeStyle = "rgb(225,67,52)";
    context.arc(foodX-blockSize/2, foodY-blockSize/2, blockSize/2.2, 0,2*Math.PI);
    context.fillStyle = "rgb(225,67,52)";
    context.fill()
    context.stroke()

    //snake eat food
    if(snakeX+blockSize == foodX && snakeY+blockSize == foodY){
        snakeBody.push([foodX, foodY]);
        audio.play()
        placeFood();
        score++;
        document.querySelector("h1").innerHTML = "Score: "+score;
    }
    for(let i = snakeBody.length-1; i>0; i--){
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length){
        snakeBody[0] = [snakeX,snakeY]
    }
    
    //draw snake
    context.beginPath()
    context.fillStyle = "rgb(46,141,212)";
    snakeX += velocityX;
    snakeY += velocityY;
    context.fillRect(snakeX,snakeY, blockSize+0.5, blockSize+0.5);
    context.stroke()

    //draw snake body
    context.beginPath()
    for (let i = 0; i < snakeBody.length; i++){
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize+0.5, blockSize+0.5)
    }  
    context.stroke()

    //go through walls
    if(snakeX<2.5){
        snakeX = blockSize*rows+2.5
    }
    else if(snakeY<2.5){
        snakeY=blockSize*cols+2.5
    }
    else if(snakeX>blockSize*rows){
        snakeX=2.5
    }
    else if(snakeY>blockSize*cols){
        snakeY=2.5
    }
    
    //game over conditions
    for(let i = 0; i < snakeBody.length; i++){
        if((snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) && !(snakeX > cols*blockSize||snakeY > rows*blockSize||snakeX <boardX||snakeY<boardY)){
            video.style.display = "block";
            gameOver = true
        }
    }
    
    //draw snake's face
    context.beginPath()
    context.fillStyle = "black";
    context.fillRect(snakeX+blockSize/5, snakeY+blockSize/5, blockSize/5,blockSize/5)
    context.fillRect(snakeX+(blockSize-(blockSize/5*2)), snakeY+blockSize/5, blockSize/5,blockSize/5)
    context.stroke()
}

//placefood
function placeFood(){
    foodX = (random(1, rows-1)*blockSize)+boardX
    foodY = (random(1, cols-1)*blockSize)+boardY
}

//direction
function touchStart(e){
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY
}
function touchMove(e){
    moveX = e.touches[0].clientX ;
    moveY = e.touches[0].clientY ;
}
function touchEnd(){
    if(startX+100 < moveX){
        velocityX = blockSize;
        velocityY = 0;
        document.querySelector("h3").innerHTML = "⠀";
    } else if(startX-100 > moveX){
        velocityX = -(blockSize);
        velocityY = 0;
        document.querySelector("h3").innerHTML = "⠀";
    }
    if(startY+100 < moveY){
        velocityX = 0;
        velocityY = blockSize;
        document.querySelector("h3").innerHTML = "⠀";
    } 
    else if(startY-100 > moveY){
        velocityX = 0;
        velocityY = -(blockSize);
        document.querySelector("h3").innerHTML = "⠀";
    }
}

function changeDirection(e){
    if (e.code == "ArrowUp" && velocityY != blockSize){
        velocityX = 0;
        velocityY = -(blockSize);
        document.querySelector("h3").innerHTML = "⠀";
    }
    else if (e.code == "ArrowDown" && velocityY != -blockSize){
        velocityX = 0;
        velocityY = blockSize;
        document.querySelector("h3").innerHTML = "⠀";
    }
    else if (e.code == "ArrowLeft" && velocityX != blockSize){
        velocityX = -(blockSize);
        velocityY = 0;
        document.querySelector("h3").innerHTML = "⠀";
    }
    else if (e.code == "ArrowRight" && velocityX != -blockSize){
        velocityX = blockSize;
        velocityY = 0;
        document.querySelector("h3").innerHTML = "⠀";
    }
    /*else if(e.code=="Escape"){
        velocityX=0;
        velocityY=0;
    }*/
}