class Character{
    constructor(){
        this.model = null;   
    }
    
    static loadModel(_folderPath, _modelPath, _mtlpath){
        return new Promise(function(resolve, reject){
            let mtlLoader = new THREE.MTLLoader();
            
            mtlLoader.setPath(_folderPath);
            mtlLoader.load(_mtlpath, (material) => {
    
                var objLoader = new THREE.OBJLoader();
                objLoader.setPath(_folderPath);
                objLoader.setMaterials(material);
                objLoader.load(_modelPath, (loadedObj) => {
                    resolve(loadedObj);
                });
            });
        });
    }
    getModel(){
        return this.model;
    }
}