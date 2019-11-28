class Water{
    constructor(_width, _height, _dMap, _bMap){

        this.width = _width;
        this.height = _height;
        this.diffuseMap = _dMap;
        this.normalMap = _bMap;

        this.geometry = new THREE.PlaneBufferGeometry(_width, _height, _width - 1, _height - 1);

        let rotMat = new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90));
        this.geometry.applyMatrix(rotMat);
        this.material = null;
        this.mesh = null;
    }

    initWater(){

        let diffuseMap = new THREE.TextureLoader().load(this.diffuseMap);
        let normalMap = new THREE.TextureLoader().load(this.normalMap);
        diffuseMap.wrapS = diffuseMap.wrapT = THREE.RepeatWrapping; 
        diffuseMap.repeat.set(32, 32);
        normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping; 
        normalMap.repeat.set(32, 32);
    
        this.geometry.computeBoundingSphere();
        this.geometry.computeVertexNormals();

        this.material = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            side: THREE.FrontSide,
            transparent: true, 
            map: diffuseMap,
            normalMap: normalMap,
            opacity: 0.95
        });
        
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.y = 1.5;
    }

    getWater(){
        return this.mesh;
    }
}