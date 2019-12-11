var scene = null;
var renderer = null;
var render = true;
var winner = "";

function InitGame(_gameStage){
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0.1, 0.25, 0.74));
    renderer.setSize( window.innerWidth, window.innerHeight );

    console.log(window.innerWidth + " / " + window.innerHeight)
    document.body.appendChild( renderer.domElement );

    scene = new GameScene(_gameStage, 0xf7feff, 0xfafeff, window, [0, 10, -10]);
    scene.buildScene(scene); 
}

function SaveScores(_score0, _score1, _winner){
    $.ajax({
        url: '/setscore',
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        data: {
            'gameId' : localStorage.getItem('gameIds'),
            'playerId' : 1,
            'score' : _score0
        }
    });

    $.ajax({
        url: '/setscore',
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        data: {
            'gameId' : localStorage.getItem('gameIds'),
            'playerId' : 2,
            'score' : _score1
        }
    });

    $('#pause-button').toggle();

    $('#game-winner').text(_winner + " ha ganado la partida!");
    $('#game-stats1').text("BoatA   Salud: " + scene.boatA.health + " Puntuación: " + scene.boatA.score);
    $('#game-stats2').text("BoatB   Salud: " + scene.boatB.health + " Puntuación: " + scene.boatB.score);
    $('#game-over').toggle();
}
    
function renderCycle(){
    var animate = function () {
        if (scene) {
            if (render) {
                if (scene.camera0 && scene.camera1) {
                    renderer.setViewport(1, 1, 0.5 * window.innerWidth - 2, window.innerHeight);
                    renderer.setScissor(1, 1, 0.5 * window.innerWidth - 2, window.innerHeight);
                    renderer.setScissorTest(true);
                    scene.camera0.updateProjectionMatrix();
                    renderer.render(scene.getScene(), scene.getCamera0());
    
                    renderer.setViewport(0.5 * window.innerWidth + 1, 1, 0.5 * window.innerWidth - 2, window.innerHeight);
                    renderer.setScissor(0.5 * window.innerWidth + 1, 1, 0.5 * window.innerWidth - 2, window.innerHeight);
                    renderer.setScissorTest(true);
                    scene.camera1.updateProjectionMatrix();
                    renderer.render(scene.getScene(), scene.getCamera1());  
                }
                if (scene.boatA && scene.boatB && scene.dockA && scene.dockB && scene.stone)
                {
                    if (scene.boatA.model && scene.boatB.model && scene.dockA.model && scene.dockB.model) {
                        if (!scene.isGameFinished) {    
                            scene.updateModels(); 
                            scene.checkCollisions();
                        }
                        else {
                            render = false;
                            SaveScores(scene.boatA.score, scene.boatB.score, scene.checkForWinner());
                        }
                    }
                }  
                if (scene.rain) {
                    if (scene.clock) {
                        scene.rain.makeItRain(scene.clock.getDelta());
                    }
                }
            }
        }         
        requestAnimationFrame( animate );
    };    
    animate();
}
