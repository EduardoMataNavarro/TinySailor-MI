class Enemy{
    constructor(_enemyTag, _movSpeed, _model){
        this.tag = _enemyTag;   
        this.movSpeed = _movSpeed;

        this.model = _model;
    }

    follow(_character, _deltaTime){
        this.model.lookAt(_character.position);
        this.model.translateZ(this.movSpeed * _deltaTime);
    }
}