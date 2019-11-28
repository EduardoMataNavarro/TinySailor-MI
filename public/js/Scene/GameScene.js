class GameScene{
    constructor(_gameStage, _ambientColor, _diffuseColor, _window, _cameraPos){
        this.camera = null;
        this.ambientLight = null;
        this.directionalLight = null;
        this.terrain = null;
        this.water = null;
        this.skybox = null;
        this.rain = null;

        this.isGameFinished = false;

        this.boatA = null;
        this.boatB = null;
        this.sharks = [];
        this.stone = null;
        this.dockA = null;
        this.dockB = null;

        this.positionMap = '';

        this.dockPositions = [];
        this.stonesPositions = [];
        this.boatsPositions  = [];

        this.stage = _gameStage;
        this.ambientColor = _ambientColor;
        this.diffuseColor = _diffuseColor;
        this.window = _window;
        this.isLoaded = false;

        this.scene = new THREE.Scene();

        this.clock  = new THREE.Clock();

        this.camera0 = new THREE.PerspectiveCamera(75, this.window.innerWidth/this.window.innerHeight, 0.1, 10000);
        this.camera1 = new THREE.PerspectiveCamera(75, this.window.innerWidth/this.window.innerHeight, 0.1, 10000);

        this.scene.add(this.camera0);
        this.scene.add(this.camera1);

        console.log("Camara creada");
        this.camera0.position.x = _cameraPos[0];
        this.camera0.position.y = _cameraPos[1];
        this.camera0.position.z = _cameraPos[2];
        this.camera0.lookAt(0, 0, 0);

        this.camera1.position.x = _cameraPos[0] + 5.0;
        this.camera1.position.y = _cameraPos[1];
        this.camera1.position.z = _cameraPos[2];
        this.camera0.lookAt(0, 0, 0);
    }

    getScene(){
        return this.scene;
    }

    getCamera0(){
        return this.camera0;
    }

    getCamera1(){
        return this.camera1;
    }

    getClock(){
        return this.clock;
    }

    initLights(){
        this.ambientLight = new THREE.AmbientLight(this.ambientColor, 1);

        this.directionalLight = new THREE.DirectionalLight(this.diffuseColor, 0.15, 100 );
        this.directionalLight.position.set( 0, 1, -1 ); 
        this.directionalLight.castShadow = true;	

        this.scene.add(this.ambientLight);
        this.scene.add(this.directionalLight);
    }

    initTerrain(_game){
        let skyboxTexts = [];
        skyboxTexts[0] = 'img/Skybox/bluecloud_ft.jpg';
        skyboxTexts[1] = 'img/Skybox/bluecloud_bk.jpg';
        skyboxTexts[2] = 'img/Skybox/bluecloud_up.jpg';
        skyboxTexts[3] = 'img/Skybox/bluecloud_dn.jpg';
        skyboxTexts[4] = 'img/Skybox/bluecloud_rt.jpg';
        skyboxTexts[5] = 'img/Skybox/bluecloud_lf.jpg';

        this.skybox = new SkyBox(2000, skyboxTexts);
        this.scene.add(this.skybox.getSkybox());

        console.log("Skybox creado");

        let terrainHM = '';
        switch (this.stage) {
            case 0:
                terrainHM = 'img/Heightmaps/heightmap1.png';
                this.positionMap = 'img/Heightmaps/positionMap1.bmp';

                this.rain = new Rain(1500, 512, 512);
                this.scene.add(this.rain.getParticleSystem());
                break;
            case 1:
                terrainHM = 'img/Heightmaps/heightmap2.png';
                this.positionMap = 'img/Heightmaps/positionMap2.bmp';

                break;
            case 2:
                terrainHM = 'img/Heightmaps/heightmap3.png';
                this.positionMap = 'img/Heightmaps/positionMap3.bmp';
                this.rain = new Rain(1500, 512, 512);
                this.scene.add(this.rain.getParticleSystem());
                break;
            default:
                break;
        }
        
        let terrainTexts = [];
        terrainTexts[0] = 'img/Heightmaps/sand1.jpg';
        terrainTexts[1] = 'img/Heightmaps/grass1.jpg';
        terrainTexts[2] = 'img/Heightmaps/stone1.jpg';

        Terrain.createTerrain(this.scene, terrainHM, terrainTexts, this.directionalLight, this.ambientColor, this.camera0.position, 150);

        let waterDiffuse = 'img/Water/water-texture1.jpg';
        let waterBump = 'img/Water/water-texture-nm.jpg';

        this.water = new Water(512, 512, waterDiffuse, waterBump);
        this.water.initWater();
        this.scene.add(this.water.getWater());

        GameScene.loadPositions(_game);
    } 

    static loadPositionMap(_positionMap, _instance){
        return new Promise(function(resolve, reject){
            let img = new Image();
            img.src = _positionMap;

            img.onload = function(){

                let imgW = img.width;
                let imgH = img.height;

                console.log("Cargando posiciones... ");

                let canvas = document.createElement("canvas");
                canvas.width = imgW;
                canvas.height = imgH;
                let context = canvas.getContext("2d");
                context.drawImage(img, 0, 0);

                let pixls = context.getImageData(0, 0, imgW, imgH).data;

                let temp0 = [];
                let temp1 = [];
                let temp2 = [];

                console.log(pixls);
                for (let i = 0; i < pixls.length; i += 4) {
                    if (pixls[i] == 255) {
                        temp0.push(new THREE.Vector3( i % imgW, 0, i / (imgW * 4))); 
                    }
                    if (pixls[i + 1] == 255) {
                        temp1.push(new THREE.Vector3( i % imgW, 0, i / (imgH * 4)));  
                    }
                    if (pixls[i + 2] == 255) {   
                        temp2.push(new THREE.Vector3( i % imgW , 0, i / (imgH * 4)));
                   }
                }
                resolve([temp0, temp1, temp2, _instance]);
            }
            img.onabort = reject;
            img.onerror = reject;
        });
    }
    static loadPositions(_game){
        var folder = 'models/';
        GameScene.loadPositionMap(_game.positionMap, _game).then(function([arrayR, arrayG, arrayB, instance]){

            Character.loadModel(folder + 'Rock/', 'rock.obj', 'rock.mtl').then((model)=>{
                instance.stone = model;
                for (let i = 0; i < arrayR.length; i++) {  
                    instance.stonesPositions.push(arrayR[i]);
                }
                console.log(instance.stonesPositions);
                instance.scene.add(instance.stone);
            });
            return [arrayG, arrayB, instance];
        }).then(function([arrayG, arrayB, instance]){
            
            Character.loadModel(folder + 'Boat/', 'boat.obj', 'boat.mtl').then((model)=>{
                instance.boatA = new Boat(0, model, arrayG[0]);
                instance.scene.add(instance.boatA.model);
            });
            Character.loadModel(folder + 'Boat/', 'boat.obj', 'boat.mtl').then((model)=>{
                instance.boatB = new Boat(1, model, arrayG[1]);
                instance.scene.add(instance.boatB.model);
            });
            return [arrayB, instance]
        }).then(function([arrayB, instance]){

            Character.loadModel(folder + 'Dock/', 'cabin.obj', 'cabin.mtl').then((model)=>{

                instance.dockA = new Dock("pointA", model.clone(), arrayB[0]);
                instance.scene.add(instance.dockA.model);
            });
            Character.loadModel(folder + 'Dock/', 'cabin.obj', 'cabin.mtl').then((model)=>{
                
                instance.dockB = new Dock("pointB", model.clone(), arrayB[1]);
                instance.scene.add(instance.dockB.model);
            });
            return instance;
        }).then(function(instance){

            Character.loadModel(folder + 'Bag/', 'bag.obj', 'bag.mtl').then((model)=>{
                instance.sack = model;
            });
            return instance;
        }).then(function (instance) {
            Character.loadModel(folder + 'Shark/', 'shark.obj', 'shark.mtl').then((model)=>{
                for (let i = 0; i < 4; i++) {
                    instance.sharks.push(new Enemy("shark" + i, 3.5, model.clone()));               
                }
            });
            return instance;
        });
    }

    buildScene(_instance){
        this.initLights();
        this.initTerrain(_instance);

    }
    checkForWinner(){
        let winner = ""
        if (this.boatA.health <= 0) {
            localStorage.setItem("lastWinner", "BoatB");
            localStorage.setItem("lastLoser", "BoatA");
            winner = "BoatB"
        }
        else {
            if (this.boatB.health <= 0) {
                localStorage.setItem("lastWinner", "BoatA");
                localStorage.setItem("lastLoser", "BoatB");
                winner = "BoatA"
            }
            else{
                if (this.boatB.score > this.boatA.score) {
                    localStorage.setItem("lastWinner", "BoatB");
                    localStorage.setItem("lastLoser", "BoatA");
                    winner = "BoatB" 
                }
                else {
                    if (this.boatA.score > this.boatA.score) {
                        localStorage.setItem("lastWinner", "BoatA");
                        localStorage.setItem("lastLoser", "BoatB");
                        winner ="BoatA"
                    }
                    else{
                        if (this.boatA.score == this.boatB.score) {
                            localStorage.setItem("lastWinner", "Both");
                            localStorage.setItem("lastLoser", "None");
                            winner = "Both"
                        }
                    }
                }
            }
        }
        return winner;
    }

    updateModels(){
        var boxBoatA = new THREE.Box3().setFromObject(this.boatA.model);
        var boxBoatB = new THREE.Box3().setFromObject(this.boatB.model);

        for (let i = 0; i < this.stonesPositions.length; i++) {
            this.stone.position.x = this.stonesPositions[i].x;
            this.stone.position.y = this.stonesPositions[i].y;
            this.stone.position.z = this.stonesPositions[i].z;

            var boxStone = new THREE.Box3().setFromObject(this.stone);
            if (boxBoatA.isIntersectionBox(boxStone)) {
                this.boatA.health -= 10;
                this.boatA.model.translateZ(-3);
            }
            if (boxBoatB.isIntersectionBox(boxStone)) {
                this.boatB.health -= 10;
                this.boatB.model.translateZ(-3);
            }
        }
        this.boatA.move(this.clock.getDelta());
        this.boatA.rotate(this.clock.getDelta());

        this.boatB.move(this.clock.getDelta());
        this.boatA.rotate(this.clock.getDelta());
    }

    checkCollisions(){
        var boxBoatA = new THREE.Box3().setFromObject(this.boatA.model);
        var boxBoatB = new THREE.Box3().setFromObject(this.boatB.model);

        var boxDockA = new THREE.Box3().setFromObject(this.dockA.model);
        var boxDockB = new THREE.Box3().setFromObject(this.dockB.model);


        if (boxBoatA.isIntersectionBox(boxDockA)) {
            (!this.boatA.hasBag) ? this.boatA.hasBag = true : this.boatA.hasBag = false;
        }
        if (boxBoatA.isIntersectionBox(boxDockB)) {
            if (this.boatA.hasBag) {
                this.boatA.hasBag = false;
                this.boatA.score += 5;
                this.boatA.model.translateZ(-5);
            }
        }
        if (boxBoatB.isIntersectionBox(boxDockA)) {
            if (this.boatB.hasBag) {
                this.boatB.hasBag = false;
                this.boatB.score += 5;
                this.boatB.model.translateZ(-5);
            }
        }
        if (boxBoatB.isIntersectionBox(boxDockB)) {
            (!this.boatB.hasBag) ? this.boatB.hasBag = true : this.boatBs.hasBag = false;
        }
        if (boxBoatB.isIntersectionBox(boxBoatA)) {
            this.boatB.health -= 5;
            this.boatB.mesh.translateZ(-5);
            this.boatA.health -= 5;
            this.boatB.mesh.translateZ(-5);
            if ((this.boatB.health <=  0) || (this.boatA.health <=  0)) {
                this.isGameFinished = true;
            }
        }
    }
}