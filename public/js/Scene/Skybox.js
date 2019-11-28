class SkyBox{
    constructor(_size, _textures){
        this.size = _size;

        let text0 = new THREE.TextureLoader().load(_textures[0]);
        let text1 = new THREE.TextureLoader().load(_textures[1]);
        let text2 = new THREE.TextureLoader().load(_textures[2]);
        let text3 = new THREE.TextureLoader().load(_textures[3]);
        let text4 = new THREE.TextureLoader().load(_textures[4]);
        let text5 = new THREE.TextureLoader().load(_textures[5]);

        let materialArray = [];
        materialArray.push(new THREE.MeshBasicMaterial({ map: text0 }));
        materialArray.push(new THREE.MeshBasicMaterial({ map: text1 }));
        materialArray.push(new THREE.MeshBasicMaterial({ map: text2 }));
        materialArray.push(new THREE.MeshBasicMaterial({ map: text3 }));
        materialArray.push(new THREE.MeshBasicMaterial({ map: text4 }));
        materialArray.push(new THREE.MeshBasicMaterial({ map: text5 }));
        
        for (let index = 0; index < 6; index++)
            materialArray[index].side = THREE.DoubleSide;

        this.geometry = new THREE.CubeGeometry(this.size, this.size, this.size);

        this.mesh = new THREE.Mesh(this.geometry, materialArray);
        this.mesh.position.x = 0;
        this.mesh.position.y = 0;
        this.mesh.position.z = 0;

        this.mesh.scale.x = 1;
        this.mesh.scale.y = 1;
        this.mesh.scale.z = 1;
    }

    getSkybox(){
        return this.mesh;
    }
}