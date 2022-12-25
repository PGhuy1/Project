//board
let blockSize = 25;
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
    snakepos.innerHTML="Snake-pos: "+snakeX+", "+snakeY
    foodpos.innerHTML= "Food-pos: "+foodX+", "+foodY
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
    context.fillRect(snakeX+5, snakeY+5, blockSize/5,blockSize/5)
    context.fillRect(snakeX+15, snakeY+5, blockSize/5,blockSize/5)
    context.stroke()
}

//placefood
function placeFood(){
    foodX = (random(1, rows-1)*blockSize)+boardX
    foodY = (random(1, cols-1)*blockSize)+boardY
}

function changeDirection(e){
    if (e.code == "ArrowUp" && velocityY != 25){
        velocityX = 0;
        velocityY = -(blockSize);
        document.querySelector("h3").innerHTML = "⠀";
    }
    else if (e.code == "ArrowDown" && velocityY != -25){
        velocityX = 0;
        velocityY = blockSize;
        document.querySelector("h3").innerHTML = "⠀";
    }
    else if (e.code == "ArrowLeft" && velocityX != 25){
        velocityX = -(blockSize);
        velocityY = 0;
        document.querySelector("h3").innerHTML = "⠀";
    }
    else if (e.code == "ArrowRight" && velocityX != -25){
        velocityX = blockSize;
        velocityY = 0;
        document.querySelector("h3").innerHTML = "⠀";
    }
    else if(e.code=="Escape"){
        velocityX=0;
        velocityY=0;
    }
}