<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>Tiny Sailor</title>
        <link href="https://fonts.googleapis.com/css?family=Sulphur+Point&display=swap" rel="stylesheet"> 
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
        <link rel="stylesheet" href="{{ asset('css/gameWindowStyle.css') }}">
        <link rel="icon" href="{{ asset('img/icon.ico') }}" type="image/x-icon" />
    </head>
    <body>
        <!-- Launch Menu -->
        <audio id="ambient-sound">
            <source src="{{ asset('audio/Caketown.mp3') }}" type="audio/mpeg">
        </audio>
	    <div id="launch-menu">
            <div class="container">
                <img src="{{ asset('img/TinyLogo.png') }}" alt="Tiny sailor image" class="tiny-logo">
                <button class="launch-menu-button gameType-buttons" gameType="singleplayer">Play</button>
                <button class="launch-menu-button gameType-buttons" onclick="location.href = '/getscores'" gameType="multiplayer">Puntuaciones</button>
                <button class="launch-menu-button gameType-buttons" gameType="">Return</button>

                <button class="launch-menu-button difficulty-buttons" gameStage=0>Stage 1</button>
                <button class="launch-menu-button difficulty-buttons" gameStage=1>Stage 2</button>
                <button class="launch-menu-button difficulty-buttons" gameStage=2>Stage 3</button>
            </div>
        </div>

        <!-- Boton de pausa -->
        <button type="button" id="pause-button">
            X
        </button>

        <div class="container-fluid" id="stats-overlay">
            <div class="container-fluid fixed-top">
                <div class="row">
                    <div class="col-6">
                        <h2 id="score1" class="stats-display"></h2>
                    </div>
                    <div class="col-6">
                        <h2 id="score2" class="stats-display"></h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <h2 class="stats-display">Boat A</h2>
                    </div>
                    <div class="col-6">
                        <h2 class="stats-display">Boat B</h2>
                    </div>
                </div>
            </div>

            <div class="container-fluid fixed-bottom">
                <div class="row">
                    <div class="col-6">
                        <h2 id="health1" class="stats-display"></h2>
                    </div>
                    <div class="col-6">
                        <h2 id="health2" class="stats-display"></h2>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="pause-menu" id="pause-menu">
            <img src="{{ asset('img/TinyLogo.png') }}" class="tiny-logo" alt="Tiny logo">
            <button class="launch-menu-button" id="continue">Continuar</button>
            <button class="launch-menu-button" id="return">Regresar</button>
        </div>
        <div class="pause-menu" id="game-over">
                <img src="{{ asset('img/TinyLogo.png') }}" class="tiny-logo" alt="Tiny logo">
                <h3 class="stats" id="game-winner"></h3>
                <h4 class="stats" id="game-stats1"></h4>
                <h4 class="stats" id="game-stats2"></h4>
                <button class="launch-menu-button" id="share-btn">Compartir en messenger</button>
                <button class="launch-menu-button" id="replay-btn">Volver a jugar</button>
                <button class="launch-menu-button" id="return-btn">Salir</button>
        </div>
    </body>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <script src="{{ asset('js/three.js') }}"></script>
     <script src="{{ asset('js/Characters/MTLLoader.js') }}"></script>
    <script src="{{ asset('js/Characters/OBJLoader.js') }}"></script>
    <script src="{{ asset('js/Characters/Character.js') }}"></script>
    <script src="{{ asset('js/Characters/Boat.js') }}"></script>
    <script src="{{ asset('js/Characters/Enemy.js') }}"></script>
    <script src="{{ asset('js/Characters/Dock.js') }}"></script>
    <script src="{{ asset('js/Scene/Skybox.js') }}"></script>
    <script src="{{ asset('js/Scene/Terrain.js') }}"></script>
    <script src="{{ asset('js/Scene/Water.js') }}"></script>
    <script src="{{ asset('js/Scene/Rain.js') }}"></script>
    <script src="{{ asset('js/Scene/GameScene.js') }}"></script>
    <script src="{{ asset('js/FacebookShare.js') }}"></script>
    <script src="{{ asset('js/GameManager.js') }}"></script>

    <script type="text/javascript">
        var gameStage = 3;
        var gameType = "";
        var startGame = false;

        $('.gameType-buttons').click(function(){
            gameType = $(this).attr('gameType');
            console.log(gameType);
            if (gameType != '') {
                $('.gameType-buttons').toggle();
                $('.difficulty-buttons').toggle();
            }
        });

        $('.difficulty-buttons').click(function(){
            gameStage = parseInt($(this).attr('gameStage'));
            startGame = true;
            console.log("Stage: " + gameStage + "  Start game: " + startGame);
            $.ajax({
                url: '/creategame',
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                data: {
                    'mapType' : gameStage
                },
                success: function(result){
                    console.log(result.game.id);
                    localStorage.setItem('gameId', parseInt(result.game.id));
                }
            }).fail(function(result) { console.log(result); });

            InitGame(gameStage);
            $('#launch-menu').toggle();
            $('#pause-button').toggle();
            $('#stats-overlay').toggle();
        });

        $('#pause-button').click(function(){
            $('#pause-menu').toggle(); 
            render = !render;
        });

        $('#replay-btn').click(function(){
            location.reload();
        });

        $('#return').click(function(){
            location.href = '/';
        });

        $('#continue').click(function(){
            $('#pause-menu').toggle();
            render = true;
        });

        $('#return-btn').click(function() {
            location.href = '/';
        });

        $('#share-btn').click(function(){
            Share();
        });

        
        $(document).keydown(function(e){
            e.preventDefault();
            if (scene) {
                if (scene.boatA && scene.boatB) {  
                    
                    scene.boatA.prevDirection = scene.boatA.direction;
                    scene.boatA.prevRotation = scene.boatA.rotation;

                    scene.boatB.prevDirection = scene.boatB.direction;
                    scene.boatB.prevRotation = scene.boatB.rotation;

                    switch (e.which) {

                        /* Player 0 controls */
                        case 87: /* W */
                            scene.boatA.direction = "forward";
                            break;
                        case 83: /* S */
                            scene.boatA.direction = "backward";
                            break;
                        case 65: /* A */
                            scene.boatA.rotation = "right";
                            break;
                        case 68: /* D */
                            scene.boatA.rotation = "left";
                            break; 

                        /* Player 1 controls */
                        case 38: /* KeyUp */
                            scene.boatB.direction = "forward";
                            break;
                        case 40: /* KeyDown */
                            scene.boatB.direction = "backward";
                            break;
                        case 37: /* KeyRight */
                            scene.boatB.rotation = "right";
                            break;
                        case 39: /* KeyLeft */
                            scene.boatB.rotation = "left"; 
                            break;
                    }
                }
            }
        });
        renderCycle();
    </script>
</html>