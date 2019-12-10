class Rain{
    constructor(_particleCount, _width, _height){
        this.particleCount = _particleCount;
        this.particles = new THREE.Geometry();

        this.width = _width;
        this.height = _height;

        this.material = new THREE.ParticleBasicMaterial({
            color: 0xCCCCCC,
            size: 0.25,
            transparent: true
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

    getRain(){
        return this.particleSystem;
    }

    makeItRain(_deltaTime){
        this.particleSystem.rotation.y += 0.00016;
        for (let i = 0; i < this.particleCount; i++) {
            let particle = this.particles.vertices[i];
            if (particle.y < -10) {
                particle.y = 100;
                particle.velocity.y = 0;
            }
            particle.velocity.y -= 3 * Math.random() * 1;
            particle.add(particle.velocity);
        }
        this.particleSystem.geometry.__dirtyVertices = true;
    }


}