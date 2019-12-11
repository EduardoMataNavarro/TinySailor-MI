class Boat{
    constructor(_playerNum, _model, _position, _health){
        this.direction = "";
        this.rotation = "";
        this.movMagnitude = 10;
        this.rotMagnitude = 5;

        this.prevDirection = "";
        this.prevRotation = "";
        
        this.hasBag = false; 
        this.health = _health;
        this.score = 0;

        this.playerNum = _playerNum;
        
        this.model = _model;
        this.model.updateMatrixWorld(true);
        debugger;
        
        this.model.position.x = _position.x;
        this.model.position.y = _position.y;
        this.model.position.z = _position.z;

        /*
        this.box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.box.setFromObject(this.model);
        */
    
        this.raycaster = new THREE.Raycaster();
        this.rays = [
            new THREE.Vector3(0, 0, 1),
			new THREE.Vector3(0, 0, -1),
			new THREE.Vector3(1, 0, 0),
			new THREE.Vector3(-1, 0, 0)
        ];
    }
    getBoat(){
        return this.model;
    }
    
    checkCollisions(_objects){
        var objTag = "";
        for (let i = 0; i < this.rays.length; i++) {
            let ray = this.rays[i];

            this.raycaster.set(this.model.position, ray);

            let collisions = this.raycaster.intersectObjects(_objects, true);

            if (collisions.length > 0) {
                if (collisions[0].distance < 7) {
                    objTag = collisions[0].object.parent.tag;
                    this.direction = "backward";
                }
            }
        }
        return objTag;
    }

    move(_deltaTime){

        var movement = _deltaTime * this.movMagnitude;
        switch (this.direction) {
            case "forward":
                (this.prevdirection == "backward") ? this.direction = "" : this.model.translateZ(movement);
                break;
            case "backward":
                (this.prevdirection == "forward") ? this.direction = "" : this.model.translateZ(-movement);
                break;
            case "left":
                (this.prevDirection == "right") ? this.direction = "" : this.model.translateX(-movement);
                break;
            case "right":
                (this.prevDirection == "left") ? this.direction = "" : this.model.translateX(movement);
                break;
            default:
                break;
        }
    }

    rotate(_deltaTime){

        var movement = THREE.Math.degToRad(this.rotMagnitude);
        switch (this.rotation) {
            case "up":
                (this.prevRotation == "down") ? this.rotation = "" : this.model.rotateX(movement);
                break;
            case "down":
                (this.prevRotation == "up") ? this.rotation = "" : this.model.rotateX(-movement);
                break;
            case "left":
                (this.prevRotation == "right") ? this.rotation = "" : this.model.rotateY(-movement);
                break;
            case "right":
                (this.prevRotation == "left") ? this.rotation = "" : this.model.rotateY(movement);
                break;
            default:
                break;
        }
    }

    createParticles(){
        
    }
}