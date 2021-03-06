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
        this.shark = null;
        this.sharks = [];
        this.stone = null;
        this.dockA = null;
        this.dockB = null;

        this.positionMap = '';

        this.dockPositions = [];
        this.stones = [];
        this.boatsPositions  = [];

        this.stage = _gameStage;
        this.ambientColor = _ambientColor;
        this.diffuseColor = _diffuseColor;
        this.window = _window;
        this.isLoaded = false;
        this.render = true;

        this.collisionObjs = [];

        this.scene = new THREE.Scene();

        this.clock  = new THREE.Clock();
        this.sharksTimer = 0;
        this.sharksLife = 0;
        this.gameTimer = 0;


        this.camera0 = new THREE.PerspectiveCamera(75, (this.window.innerWidth/this.window.innerHeight)/2, 0.1, 10000);
        this.camera1 = new THREE.PerspectiveCamera(75, (this.window.innerWidth/this.window.innerHeight)/2, 0.1, 10000);

        this.scene.add(this.camera0);
        this.scene.add(this.camera1);

        console.log("Camara creada");
        this.camera0.position.x = _cameraPos[0];
        this.camera0.position.y = _cameraPos[1];
        this.camera0.position.z = _cameraPos[2];
        this.camera0.lookAt(0, 0, 0);

        this.camera1.position.x = _cameraPos[0];
        this.camera1.position.y = _cameraPos[1];
        this.camera1.position.z = _cameraPos[2];
        this.camera1.lookAt(0, 0, 0);

        var listener = new THREE.AudioListener();
        this.camera0.add(listener);

        var sound = new THREE.Audio(listener);

        var audioLoader = new THREE.AudioLoader();
        audioLoader.load('audio/Caketown.ogg', function(buffer){
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.25);
            sound.play();
        });
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

        var terrainHM = '';

        switch (this.stage) {
            case 0:
                terrainHM = 'img/Heightmaps/heightmap1.png';
                this.positionMap = 'img/Heightmaps/positionMap1.png';

                this.rain = new Rain(5000, 512, 512);
                this.scene.add(this.rain.getRain());
                break;
            case 1:
                terrainHM = 'img/Heightmaps/heightmap2.png';
                this.positionMap = 'img/Heightmaps/positionMap2.png';

                break;
            case 2:
                terrainHM = 'img/Heightmaps/heightmap3.png';
                this.positionMap = 'img/Heightmaps/positionMap3.png';

                this.rain = new Rain(1500, 512, 512);
                this.scene.add(this.rain.getRain());
                break;
            default:
                break;
        }
        
        let terrainTexts = [];
        terrainTexts[0] = 'img/Heightmaps/sand1.jpg';
        terrainTexts[1] = 'img/Heightmaps/grass1.jpg';
        terrainTexts[2] = 'img/Heightmaps/stone1.jpg';

        console.log(terrainHM);
        Terrain.createTerrain(this, terrainHM, terrainTexts, this.directionalLight, this.ambientColor, this.camera0.position, 150);

        let waterDiffuse = 'img/Water/water-texture1.jpg';
        let waterBump = 'img/Water/water-texture-nm.jpg';

        this.water = new Water(512, 512, waterDiffuse, waterBump);
        this.water.initWater();
        this.scene.add(this.water.getWater());

        GameScene.loadPositions(_game);
    } 

    static loadPositionMap(_positionMap, _instance){
        return new Promise(function(resolve, reject){
            var img = new Image();
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

                let imgSize = imgW * imgH * 4;

                for (let i = 0; i < imgSize; i+=4) {
                    if (pixls[i] == 255) {
                        temp0.push(new THREE.Vector3( (i / 4) % (imgW), 0, ( (i /4) / imgW))); 
                    }
                    if (pixls[i + 1] == 255) {
                        temp1.push(new THREE.Vector3( (i / 4) % (imgW), 0, ( (i /4) / imgW))); 
                    }
                    if (pixls[i + 2] == 255) {   
                        temp2.push(new THREE.Vector3( (i / 4) % (imgW), 0, ( (i /4) / imgW)));
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

            Character.loadModel(folder + 'Rock/', 'watercraftPack_027.obj', 'watercraftPack_027.mtl').then((model)=>{
                var newModel = model;
                for (let i = 0; i < arrayR.length; i++) {  

                    let X = arrayR[i].x;
                    let Y = arrayR[i].y;
                    let Z = arrayR[i].z;

                    instance.stones.push(newModel.clone());
                    instance.stones[i].position.set(X, Y, Z);
                    instance.stones[i].scale.set(8, 8, 8);
                    instance.stones[i].children[0].geometry.computeBoundingBox();
                    instance.stones[i].tag = "stone";

                    instance.collisionObjs.push(instance.stones[i]);
                    
                    instance.scene.add(instance.stones[i]); 
                }
                instance.stone = newModel;
            }).catch(function(error){
                console.log(error);
            });
            return [arrayG, arrayB, instance];
        }).then(function([arrayG, arrayB, instance]){
    
            Character.loadModel(folder + 'Boat/', 'boat1.obj', 'boat1.mtl').then((model)=>{
                model.tag = "BoatA";
                instance.boatA = new Boat(0, model, arrayG[0], 100);
                instance.boatA.model.scale.set(4, 4, 4);
                instance.boatA.model.add(instance.camera0);

                instance.scene.add(instance.boatA.model);
            });
            Character.loadModel(folder + 'Boat/', 'boat2.obj', 'boat2.mtl').then((model)=>{
                model.tag = "BoatB";
                instance.boatB = new Boat(1, model, arrayG[1], 100);
                instance.boatB.model.scale.set(4, 4, 4);
                instance.boatB.model.add(instance.camera1);
                
                instance.scene.add(instance.boatB.model);
            });
            return [arrayB, instance]
        }).then(function([arrayB, instance]){

            Character.loadModel(folder + 'Dock/', 'tower1.obj', 'tower1.mtl').then((model)=>{
                model.tag = "DockA";
                model.rotateY(180);
                instance.dockA = new Dock("pointA", model, arrayB[0]);
                instance.dockA.model.children[0].geometry.computeBoundingBox();

                instance.collisionObjs.push(instance.dockA.model);
                instance.scene.add(instance.dockA.model);
            });
            Character.loadModel(folder + 'Dock/', 'tower2.obj', 'tower2.mtl').then((model)=>{
                model.tag = "DockB";
                instance.dockB = new Dock("pointB", model, arrayB[1]);
                instance.dockB.model.children[0].geometry.computeBoundingBox();

                instance.collisionObjs.push(instance.dockB.model);

                instance.scene.add(instance.dockB.model);
            });
            return instance;
        }).then(function(instance){

            Character.loadModel(folder + 'Bag/', 'bag.obj', 'bag.mtl').then((model)=>{
                model.tag = "Bag";
                instance.sack = model;
            });
            return instance;
        }).then(function (instance) {
            Character.loadModel(folder + 'Shark/', 'shark.obj', 'shark.mtl').then((model)=>{
                model.tag = "shark";
                instance.shark = model;

                instance.sharks.push(new Enemy(10.5, model));
                instance.sharks.push(new Enemy(10.5, model));  
                
                instance.sharks[0].model.position.set(0, -10, 0);
                instance.sharks[1].model.position.set(0, -10, 0);

                instance.collisionObjs.push(instance.sharks[0].model);    
                instance.collisionObjs.push(instance.sharks[1].model);           
                
                instance.scene.add(instance.sharks[0].model);
                instance.scene.add(instance.sharks[1].model);

                console.log(instance.collisionObjs);
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

        var boatACols = this.boatA.checkCollisions(this.collisionObjs);
        var boatBCols = this.boatB.checkCollisions(this.collisionObjs);

        var boatAPos = this.boatA.model.position;
        var boatBPos = this.boatB.model.position;

        if (this.terrain) {
            var height = this.terrain.getHeightAt(boatAPos.x, boatAPos.z)

            if(height >= 2.1){
                let direction = this.boatA.direction;

                if (direction == "forward") 
                    this.boatA.direction = "backward";
                else 
                    if (direction == "backward") 
                        this.boatA.direction = "forward";
            }
            
            height = this.terrain.getHeightAt(boatBPos.x, boatBPos.z);

            if(height >= 2.1){
                let direction = this.boatB.direction;

                if (direction == "forward") 
                    this.boatB.direction = "backward";
                else 
                    if (direction == "backward") 
                        this.boatB.direction = "forward";
            }
        }

        if (boatACols != "") {
            if (boatACols == "DockA") {
                if(!this.boatA.hasBag) this.boatA.hasBag = true;
            }
            if (boatACols == "DockB") {
                if (this.boatA.hasBag) {
                    this.boatA.hasBag = false;
                    this.boatA.score += 10;
                }
            }
            if (boatACols == "stone") {
                this.boatA.health -= 5;
                console.log("BoatA health: " + this.boatA.health);
            }
            if (boatACols == "Shark") {
                if (this.sharks[0].render) {
                    this.boatA.health -= 10;
                    this.sharks[0].render = false;
                }
            }
        }

        if (boatBCols != "") {
            if (boatBCols == "DockB") {
                if(!this.boatB.hasBag) this.boatB.hasBag = true;
            }
            if (boatBCols == "DockA") {
                if (this.boatB.hasBag) {
                    this.boatB.hasBag = false;
                    this.boatB.score += 10;
                }
            }
            if (boatBCols == "stone") {
                this.boatB.health -= 5;
                console.log("BoatB Health: " + this.boatB.health);
            }
            if (boatBCols == "shark") {
                if (this.sharks[1].render) {
                    this.boatB.health -= 10;
                    this.sharks[1].render = false;
                }
            }
        }

        var delta = this.clock.getDelta();

        if (this.sharks[0] && this.sharks[1]) {
            this.sharksTimer += delta;
            if (this.sharksTimer >= 10.0 && (!this.sharks[0].render && !this.sharks[1].render)) {
                this.sharks[0].render = true;
                this.sharks[1].render = true;
    
                this.sharks[0].spawn(this.boatA.model.position);
                this.sharks[1].spawn(this.boatB.model.position);
                console.log("Sharks spawned");
            }
        
            if (this.sharks[0].render || this.sharks[1].render) {
                this.sharksLife += delta;
                
                if (this.sharksLife <= 5.0) {

                    if (this.sharks[0].render) 
                        this.sharks[0].follow(this.boatA.model.position, delta);

                    if (this.sharks[1].render) 
                        this.sharks[1].follow(this.boatB.model.position, delta);
                }
                else{
                    this.sharksLife = 0;
                    this.sharks[0].render = false;
                    this.sharks[1].render = false;
                    this.sharks[0].model.position.set(0, -10, 0);
                    this.sharks[1].model.position.set(0, -10, 0);
                    this.sharksTimer = 0;
                }
            }
        }

        this.boatA.move(delta);
        this.boatB.move(delta);

        this.boatA.rotate(delta);
        this.boatB.rotate(delta);

        $('#health1').text("Salud: " + this.boatA.health);
        $('#health2').text("Salud: " + this.boatB.health);

        $('#score1').text("Score: " + this.boatA.score);
        $('#score2').text("Score: " + this.boatB.score);

        if (this.boatB.health <= 0) 
            this.isGameFinished = true;

        if (this.boatA.health <= 0) 
            this.isGameFinished = true;

        this.gameTimer += delta;
        if (this.gameTimer >= 300.0)
            this.isGameFinished = true;
    }

    checkCollisions(){
    }
}