/// Ping Pong Game

var canvas;
var canvasContext;

var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var paddle1Y = 250;
var paddle2Y = 250;
var paddleHeight = 100;
var paddleThickness = 10;

var player1Score = 0;
var player2Score = 0;
var winningScore = 3;

var showingWinScreen = false;

// Mouse movement
function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}
function handelMouseClick() {
    if(showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    };
}

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    var framesPerSecond = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond);

    canvas.addEventListener("mousedown", handelMouseClick);

    canvas.addEventListener("mousemove", function(evt) {
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y-(paddleHeight/2);
    });
}

// Reset the game
function ballReset() {
    if(player1Score >= winningScore || player2Score >= winningScore) {
        showingWinScreen = true;
    }
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX =- ballSpeedX;
}

// Computer paddel movement
function computerMovement() {
    var paddle2YCenter = paddle2Y + (paddleHeight / 2);
    if(paddle2YCenter < ballY - 35) {
        paddle2Y += 6;
    } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= 6;
    }
}

// Make the ball move
function moveEverything() {
    if(showingWinScreen) {
        return;
    }
    computerMovement();
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if(ballX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
                ballSpeedX =- ballSpeedX;
        
                var deltaY = ballY - (paddle1Y + paddleHeight / 2);
                ballSpeedY = deltaY * 0.25;
        } else {
                player2Score ++; // most be before ballreset
                ballReset();
        } 
    }
    if(ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
            ballSpeedX =- ballSpeedX;

            var deltaY = ballY - (paddle2Y + paddleHeight / 2);
                ballSpeedY = deltaY * 0.25;
        } else {
                player1Score ++; // most be before ballreset
                ballReset();
        }
    }
    if(ballY < 0) {
        ballSpeedY =- ballSpeedY;
    }
    if(ballY > canvas.height) {
        ballSpeedY =- ballSpeedY;
    }
}

function drawNet() {
    // I is -25 because of centering the net better
    for(var i = -25; i < canvas.height; i += 45) {
        canvasContext.fillRect(canvas.width / 2, i, 2, 20,);
        canvasContext.fillStyle = "white";
    }
}

function drawEverything() {
    
    // Canvas
    canvasContext.fillStyle = "#6600cc";
    canvasContext.fillRect(0,0,canvas.width,canvas.height);

    // Reset if someone wins
    if(showingWinScreen) {
        canvasContext.fillStyle = "white";

        if(player1Score >= winningScore) {
            canvasContext.fillText("Player One Won!", 350,200);
        } else if(player2Score >= winningScore) {
            canvasContext.fillText("Player Two Won!", 350,200);
        }
        canvasContext.fillText("Click to continue", 350,400);
        return;
    }

    drawNet();

    // Paddel for the left player
    canvasContext.fillStyle = "white";
    canvasContext.fillRect(0,paddle1Y,paddleThickness,paddleHeight);

    // Paddel for the right player
    canvasContext.fillStyle = "white";
    canvasContext.fillRect(canvas.width-paddleThickness,paddle2Y,paddleThickness,paddleHeight);

    // Ball
    canvasContext.fillStyle = "white";
    canvasContext.beginPath();
    canvasContext.arc(ballX, ballY,10,0,Math.PI*2, true);
    canvasContext.fill();

    // Scores for player 1 and 2
    canvasContext.fillText(player1Score, 100, 100,);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);

}