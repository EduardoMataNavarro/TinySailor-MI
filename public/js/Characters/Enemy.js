class Enemy{
    constructor(_movSpeed, _model){
        this.movSpeed = _movSpeed;

        this.model = _model;
        this.model.updateMatrixWorld(true);
        this.render = false;
        
        /*
        this.collider = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.collider.setFromObject(this.model);
        */
    }

    follow(_position, _deltaTime){

        this.model.lookAt(_position);
        this.model.translateZ(this.movSpeed * _deltaTime);
    }
    spawn(_position){
        let boatX = _position.x;
        let boatZ  = _position.z;

        let posX = (Math.random() * 10) + (boatX + 25);
        let posZ = (Math.random() * 10) + (boatZ + 25);

        this.model.position.set(posX, 1.25, posZ);
    }
}