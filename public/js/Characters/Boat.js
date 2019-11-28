class Boat{
    constructor(_playerNum, _model, _position, _health){
        this.direction = "";
        this.rotation = "";
        this.movMagnitude = 4;

        this.prevDirection = "";
        this.prevRotation = "";
        
        this.hasBag = false; 
        this.tag = "boat";  
        this.health = _health;
        this.score = 0;

        this.playerNum = _playerNum;
        
        this.model = _model;
        //this.model.computeBoundingBox();
        /*
        this.model.position.x = _position.x;
        this.model.position.y = _position.y;
        this.model.position.z = _position.z;
        */
    }
    getBoat(){
        return this.model;
    }
    
    move(_deltaTime){

        let movement = _deltaTime * this.movMagnitude;
        switch (this.direction) {
            case "forward":
                (this.prevdirection == "backward") ? this.direction = "" : this.model.translateZ(-movement);
                break;
            case "backward":
                (this.prevdirection == "forward") ? this.direction = "" : this.model.translateZ(movement);
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

        let movement = _deltaTime * this.movMagnitude;
        switch (this.rotation) {
            case "up":
                (this.prevRotation == "down") ? this.direction = "" : this.model.rotateX(movement);
                break;
            case "down":
                (this.prevRotation == "up") ? this.direction = "" : this.model.rotateX(-movement);
                break;
            case "left":
                (this.prevRotation == "right") ? this.direction = "" : this.model.rotateY(movement);
                break;
            case "right":
                (this.prevRotation == "left") ? this.direction = "" : this.model.rotateY(-movement);
                break;
            default:
                break;
        }
    }
}