var scene = null;
var renderer = null;

function InitGame(_gameStage){
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0.1, 0.25, 0.74));
    renderer.setSize( window.innerWidth, window.innerHeight );

    console.log(window.innerWidth + " / " + window.innerHeight)
    document.body.appendChild( renderer.domElement );

    scene = new GameScene(_gameStage, 0xf7feff, 0xfafeff, window, [0, 10, -10]);
    scene.buildScene(scene); 
}

    

function renderCycle(){
    var animate = function () {
        if (scene) {
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
                        var winner = scene.checkForWinner();
                        alert(winner + " ha ganado la partida");
                        //ShareScore(scene.boatA.score, scene.boatB.score);
                    }
                }
            }  
            if (scene.rain) {
                if (scene.clock) {
                    scene.rain.makeItRain(scene.clock.getDelta());
                }
            }
        }         
        requestAnimationFrame( animate );
    };    
    animate();
}
