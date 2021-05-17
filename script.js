let canvas;
let board;
let player;
let animation_timer;
let rule;

let checkers_online;
let page_animation;

let player1 = {
    name: "",
    team: "1",
    score: 0,
    total: 0,
    checkerColor: "darkgreen"
};

let player2 = {
    name: "",
    team: "0",
    score: 0,
    total: 0,
    checkerColor: "darkblue"
};

window.onload = function()
{
    canvas          = document.getElementById('board');
    page_animation  = new PageAnimation(0);
    page_animation.initPage();
    //let a = page_animation.insertAlertBox("Warning", "<p>Site under construction. More features are coming soon.</p>");
    //page_animation.showAlertBox(a);
}

function buildPlayers(gameMode)
{
    // Change Colors Of The Score Bar //
    document.getElementById("player1_name").style.setProperty("color", player1.checkerColor);
    document.getElementById("player2_name").style.setProperty("color", player2.checkerColor);
    document.getElementById("player1_win_lbl").style.setProperty("color", player1.checkerColor);
    document.getElementById("player2_win_lbl").style.setProperty("color", player2.checkerColor);
    // Versus AI Mode. //
    if(gameMode === 0)
    {
        let txt_player1 = document.getElementById("txt_p1_name").value;
        let txt_player2 = "CPU";
        if(txt_player1 === "")
            player1.name = "PLAYER I";
        else
            player1.name = txt_player1;
        player2.name = txt_player2;
        updatePlayerNames("PLAYER <span>I</span>", player2.name);
    }
    // Two Players Mode. //
    else if(gameMode === 1)
    {
        let txt_player1 = document.getElementById("txt_p1_name").value;
        let txt_player2 = document.getElementById("txt_p2_name").value;
        if(txt_player1 === "")
            player1.name = "PLAYER <span>I</span>";
        else
            player1.name = txt_player1;
        if(txt_player2 === "")
            player2.name = "PLAYER <span>II</span>";
        else
            player2.name = txt_player2;
        updatePlayerNames(player1.name, player2.name);
    }
    // Online Battle Mode. //
    else if(gameMode === 2)
    {
        let txt_player1 = document.getElementById("txt_p1_name").value;
        if(txt_player1 === "")
            player1.name = "GUEST PLAYE<span>R</span>";
        else
            player1.name = txt_player1;
    }
}

function start2PlayersGame()
{
    let gameMode = 1;
    buildPlayers(gameMode);
    board           = new Board(canvas);
    animation_timer = new MyLoop(board);
    player         = new Player("Computer IP", "1", 0, 0);
    rule            = new CheckerRule();

    player.setRule(rule);
    player.setGameMode(gameMode);
    board.setColumns(8, 8);
    board.init();
    board.setPlayer1(player);
    setEventListener(board);
}

function startVSAi()
{
    let gameMode = 0;
    buildPlayers(gameMode);
    board           = new Board(canvas);
    animation_timer = new MyLoop(board);
    player          = new Player("Computer IP", "1", 0, 0);
    rule            = new CheckerRule();

    player.setRule(rule);
    player.setGameMode(gameMode);
    board.setColumns(8, 8);
    board.init();
    board.setPlayer1(player);
    setEventListener(board);
}

function startCheckersOnline()
{
    checkers_online = new CheckersOnline();
    buildPlayers(2);
}

function setEventListener(board)
{
    let canvas = document.getElementById('board');

    canvas.addEventListener("mousemove", function(event){
        let mousePos = calculateMouseCoordinate(event);
        board.setMousePos(mousePos.mouseX, mousePos.mouseY);
        board.onMouseMove();
    });

    canvas.addEventListener("mouseleave", function(event){
       board.onMouseLeaved();
    });

    canvas.addEventListener("mousedown", function(event){
        let mousePos = calculateMouseCoordinate(event);
        board.setMousePos(mousePos.mouseX, mousePos.mouseY);
        board.onMouseDown();
    });

    canvas.addEventListener("mouseup", function(event){
        let mousePos = calculateMouseCoordinate(event);
        board.setMousePos(mousePos.mouseX, mousePos.mouseY);
        board.onMouseUp();
    });
}

function calculateMouseCoordinate(event)
{
    let canvas = document.getElementById("board");
    let bRect = canvas.getBoundingClientRect();
    let horizontal_enlarge_ratio = (canvas.width - canvas.clientWidth) / canvas.clientWidth;
    let vertical_enlarge_ratio = (canvas.height - canvas.clientHeight) / canvas.clientHeight;
    let real_x = (event.clientX - bRect.left) + ((event.clientX - bRect.left) * horizontal_enlarge_ratio);
    let real_y = (event.clientY - bRect.top) + ((event.clientY - bRect.top) * vertical_enlarge_ratio);
    let mouseX = Math.floor(real_x);
    let mouseY = Math.floor(real_y);
    return {mouseX: mouseX, mouseY: mouseY};
}

function printMouseCord(x, y)
{
    document.getElementById("mouseCord").innerHTML = x + ", " + y;
}

function closeGame()
{
    board.reset();
    board.destroy();
    rule.destroy();
    animation_timer.stop();
    board           = null;
    player          = null;
    rule            = null;
    animation_timer = null;
}

function resetPlayers()
{
    player1.score = 0;
    player1.total = 0;
    player2.score = 0;
    player2.total = 0;
    updatePlayerEatScores(player1.score, player2.score);
    updatePlayerTotalWinScore(player1.total, player2.total);
}

function updatePlayerNames(player1_name, player2_name)
{
    document.getElementById("player1_name").innerHTML = player1_name;
    document.getElementById("player2_name").innerHTML = player2_name;
}

function updatePlayerEatScores(player1_score, player2_score)
{
    document.getElementById("player1_score").innerHTML = player1_score;
    document.getElementById("player2_score").innerHTML = player2_score;
}

function updatePlayerTotalWinScore(player1_win_score, player2_win_score)
{
    document.getElementById("player1_win_score").innerHTML = player1_win_score;
    document.getElementById("player2_win_score").innerHTML = player2_win_score;
}