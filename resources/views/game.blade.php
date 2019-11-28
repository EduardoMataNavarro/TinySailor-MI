<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>Tiny Sailor</title>
        <link rel="stylesheet" href="{{ asset('css/gameWindowStyle.css') }}">
    </head>
    <body>
        <!-- Launch Menu -->
	    <div id="launch-menu">
            <div class="container">
                <img src="{{ asset('img/TinyLogo.png') }}" alt="Tiny sailor image" class="tiny-logo">
                <button class="launch-menu-button gameType-buttons" gameType="singleplayer">Play</button>
                <button class="launch-menu-button gameType-buttons" gameType="multiplayer">Puntuaciones</button>
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
        <div id="pause-menu">
            <img src="{{ asset('img/TinyLogo.png') }}" class="tiny-logo" alt="Tiny logo">
            <button class="launch-menu-button">Continuar</button>
            <button class="launch-menu-button">Regresar</button>
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

    <script type="text/javascript">
        var gameType = "";
        $('.gameType-buttons').click(function(){
                gameType = $(this).attr('gameType');
                console.log(gameType);
                if (gameType != '') {
                    $('.gameType-buttons').toggle();
                    $('.difficulty-buttons').toggle();
                }
        });

        var gameStage = 3;
        var startGame = false;
        $('.difficulty-buttons').click(function(){
            gameStage = $(this).attr('gameStage');
            startGame = true;
            $.ajax({
                url: '/creategame',
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                data: {
                    'mapType' : gameStage
                },
                success: function(result){
                    localStorage.setItem('gameId', result.id);
                }
            });

            $('#launch-menu').toggle();
            $('#pause-button').toggle();

        });

        $('#pause-button').click(function(){
            $('#pause-menu').toggle(); 
        });

            var renderer = new THREE.WebGLRenderer();
            renderer.setClearColor(new THREE.Color(0.1, 0.25, 0.74));
            renderer.setSize( window.innerWidth, window.innerHeight );

            console.log(window.innerWidth + " / " + window.innerHeight)
            document.body.appendChild( renderer.domElement );
            
            var scene = new GameScene(gameStage, 0xf7feff, 0xfafeff, window, [0, 10, -2]);
            scene.buildScene(scene);    
        
        
            $(document).keydown(function(e){
                e.preventDefault();
                if (scene.boatA && scene.boatB) {   
                    switch (e.which) {

                        /* Player 0 controls */
                        case 87: /* W */
                            scene.boatA.direction = "forward";
                            //scene.boat0.getBoat().direction = "forward";
                            break;
                        case 83: /* S */
                            scene.boatA.direction = "backward";
                            //scene.boat0.getBoat().direction = "backward";
                            break;
                        case 65: /* A */
                            scene.boatA.rotation = "right";
                            //scene.boat0.getBoat().rotation = "right";
                            break;
                        case 68: /* D */
                            scene.boatA.rotation = "left";
                            //scene.boat0.getBoat().rotation = "left";
                            break; 

                        /* Player 1 controls */
                        case 38: /* KeyUp */
                            scene.boatB.direction = "forward";
                            break;
                        case 40: /* KeyDown */
                            scene.boatB.direction = "backward";
                            break;
                        case 39: /* KeyRight */
                            scene.boatB.rotation = "right";
                            break;
                        case 37: /* KeyLeft */
                            scene.boatB.rotation = "left"; 
                            break;
                    }
                }
            });
        var animate = function () {
            renderer.setViewport(1, 1, 0.5 * window.innerWidth - 2, window.innerHeight);
            renderer.setScissor(1, 1, 0.5 * window.innerWidth - 2, window.innerHeight);
            renderer.setScissorTest(true);
            scene.camera0.updateProjectionMatrix();
            renderer.render(scene.getScene(), scene.getCamera0());

            renderer.setViewport(0.5 * window.innerWidth + 1, 1, 0.5 * window.innerWidth - 2, window.innerHeight);
            renderer.setScissor(0.5 * window.innerWidth + 1, 1, 0.5 * window.innerWidth - 2, window.innerHeight);
            renderer.setScissorTest(true);
            scene.camera1.updateProjectionMatrix();

             
            if (scene.rain) {
                scene.rain.makeItRain(scene.clock.getDelta());
            }
            if (scene.boatA && scene.boatB && scene.dockA && scene.dockB && 
                (scene.stonesPositions.length > 0 || scene.stonesPositions) && 
                scene.stone)
            {
                if (!scene.isGameFinished) {    
                    scene.updateModels(); 
                    scene.checkCollisions();
                }
                else {
                    
                    var winner = scene.checkForWinner();
                    alert(winner + " ha ganado la partida");
                    ShareScore(scene.boatA.score, scene.boatB.score);
                }
            }

            renderer.render( scene.getScene(), scene.getCamera1());            
            requestAnimationFrame( animate );
        };
        animate();
    </script>
</html>