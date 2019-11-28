class Dock{
    constructor(_dockPoint, _model, _position){
        
        this.model = _model;
        //this.model.computeBoundingBox();

        this.tag = _dockPoint;

        
        this.model.position.x = _position.x;
        this.model.position.y = _position.y;
        this.model.position.z = _position.z;
    
    }
    
}