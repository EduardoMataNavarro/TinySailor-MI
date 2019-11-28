class Rain{
    constructor(_particleCount, _width, _height){
        this.particleCount = _particleCount;
        this.particles = new THREE.Geometry();

        this.width = _width;
        this.height = _height;

        this.material = new THREE.ParticleBasicMaterial({
            color: 0xFFFFFF,
            size: 5
        });

        for (let i = 0; i < this.particleCount; i++) {
            let posX = Math.random() * (_width * 2) - _width;
            let posY = Math.random() * 300 - 150;
            let posZ = Math.random() * (_height * 2) - _height;

            let particle = new THREE.Vector3(posX, posY, posZ);
            particle.velocity = new THREE.Vector3(0, -9.8, 0);
            this.particles.vertices.push(particle);
        }

        this.particleSystem = new THREE.ParticleSystem(this.particles, this.material);
        this.particleSystem.sortParticles = true;
    }

    getParticleSystem(){
        return this.particleSystem;
    }

    makeItRain(_deltaTime){
        this.particleSystem.rotation.y += 0.001;
        for (let i = 0; i < this.particleCount; i++) {
            let particle = this.particles.vertices[i];
            if (particle.y < -10) {
                particle.y = 100;
                particle.velocity.y = 0;
            }
            particle.velocity.y -= (Math.random() * .01) * _deltaTime;
            particle.velocity.multiplyScalar(_deltaTime)
            particle.add(particle.velocity);
        }
        this.particleSystem.geometry.__dirtyVertices = true;
    }


}