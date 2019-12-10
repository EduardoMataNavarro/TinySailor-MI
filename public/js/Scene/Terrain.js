class Terrain{
    constructor(_width, _height, _scaleY){
        this.width = _width;
        this.height = _height;

        this.geometry = new THREE.PlaneBufferGeometry(_width, _height, _width - 1, _height - 1);
        
        let rotMat = new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90));
        this.geometry.applyMatrix(rotMat);
        this.vertArray = this.geometry.attributes.position.array;
        this.mesh = null;
        this.scaleY = _scaleY;
    }
    
    getTerrain(){
        return this.mesh;
    }

    static createTerrain(_scene, _map, _dmaps, _dirL, _ambColor, _camerapos, _scaleY){
        Terrain.loadImage(_map, _scaleY).then(function(terrain){
            _scene.terrain = terrain.loadMaps(_map, _dmaps, _dirL, _ambColor, _camerapos);
            _scene.add(_scene.terrain);
        }).catch(function(error){
            console.log("No se ha podido generar el terreno " + error);
        });
    }
    static loadImage(srcImg, _scaleY){
        return new Promise(function(resolve, reject){
            
            var img = new Image();
            img.src = srcImg;

            img.onload = function() {
                let imgW = img.width;
                let imgH = img.height;

                let canvas = document.createElement("canvas");
                canvas.width = imgW;
                canvas.height = imgH;
                let context = canvas.getContext("2d");
                context.drawImage(img, 0, 0);

                let imgData = context.getImageData(0, 0, imgW, imgH);
                let pixels = imgData.data;

                let imgSize = imgW * imgH;

                var newTerrain = new Terrain(imgW, imgH, _scaleY);
                for (let i = 0; i < imgSize; i++) {
                    newTerrain.geometry.attributes.position.array[i * 3 + 1] = pixels[i * 4] / 256;
                }
                resolve(newTerrain);
            }
            img.onerror = reject;
        });
    }

    loadMaps(_map, _dmaps, _dirL, _ambColor, _camerapos){

        let texture0 = new THREE.TextureLoader().load(_dmaps[0]);
        let texture1 = new THREE.TextureLoader().load(_dmaps[1]);
        let texture2 = new THREE.TextureLoader().load(_dmaps[2]);
        let heightMap = new THREE.TextureLoader().load(_map);

        
        texture0.repeat.set(32, 32);
        texture1.repeat.set(32, 32);
        texture2.repeat.set(32, 32);

        texture0.wrapS = texture0.wrapT = THREE.RepeatWrapping;
        texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
        texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
    

        /*this.geometry.computeBoundingSphere();
        this.geometry.computeBoundingBox();*/
        this.geometry.computeVertexNormals();

        let customUniforms = {
            textured_0: {type: 'sampler2D', value: texture0},
            textured_1: {type: 'sampler2D', value: texture1},
            textured_2: {type: 'sampler2D', value: texture2},
            height_map: { type: 'sampler2D', value: heightMap },
            dir_light: {type: 'vec3', value: _dirL.position },
            dir_color: { type: 'vec3', value: _dirL.color },
            amb_color: { type: 'vec3', value: _ambColor },
            camera_pos: { type: 'vec3', value: _camerapos }
        };

        let customMaterial = new THREE.ShaderMaterial({
            uniforms: customUniforms,
            vertexShader: this.vertexShader(),
            fragmentShader: this.fragmentShader(),
        });

        this.mesh = new THREE.Mesh(this.geometry, customMaterial);
        this.mesh.scale.set(1, this.scaleY, 1);
        this.mesh.position.x = this.width / 2.0;
        this.mesh.position.z = this.height / 2.0;
        return this.mesh;
    }

    updateUniforms(_camera){

    }

    getHeightAt(_X, _Z){
        let width = this.width;
        let height = this.height;
        if (_X < 0 || _X >= width || _Z < 0 || _Z >= height) {
            throw new Error('point outside of terrain boundary');
        }

        // Get integer floor of x, z
        let ix = Math.floor(_X);
        let iz = Math.floor(_Z);
        
        // Get real (fractional) component of x, z
        // This is the amount of each into the cell
        let rx = _X - ix;
        let rz = _Z - iz;

        // Edges of cell
        let a = this.array[(iz * width + ix) * 3 + 1];
        let b = this.array[(iz * width + (ix + 1)) * 3 + 1];
        let c = this.array[((iz + 1) * width + (ix + 1)) * 3 + 1];
        let d = this.array[((iz + 1) * width + ix) * 3 + 1];

        // Interpolate top edge (left and right)
        let e = (a * (1 - rx) + b * rx);
        // Interpolate bottom edge (left and right)
        let f = (c * rx + d * (1 - rx));
        // Interpolate between top and bottom
        let y = (e * (1 - rz) + f * rz);
        return y * this.scaleY;
    }

    vertexShader(){
        let vertexShader = [
            "varying vec2 vertUV;",
            "uniform vec3 camera_pos;",
            "varying vec3 normalc;", 
            "varying vec4 fragmentPosition;",
            "void main()",
            "{ ",
                "vertUV = uv;",
                "normalc = normal.xyz;",
                "normalc = normalize(normalc);",
                "fragmentPosition = modelViewMatrix * vec4(position, 1.0);",
                "gl_Position = projectionMatrix * fragmentPosition;",
            "}",
        ].join('\n')
        return vertexShader;
    }

    fragmentShader(){

        let fragmentShader = [
            "uniform sampler2D textured_0;",
              "uniform sampler2D textured_1;",
              "uniform sampler2D textured_2;",
              "uniform sampler2D height_map;",
              "varying vec3 normalc;",
              "varying vec4 fragmentPosition;",
              "varying vec2 vertUV;",
              "uniform vec3 camera_pos;", 
              "uniform vec3 dir_light;" , 
              "uniform vec3 dir_color;" , 
              "uniform vec3 amb_color;" ,
              "void main() {",
                "vec4 finalColor = vec4(0.15, 0.15, 0.15, 1.0);",
                "vec4 diffuseColor = vec4(dir_color, 1);",
                "vec4 specularColor = vec4(1.0, 1.0, 1.0, 1.0);",
                "vec3 dirLight = dir_light;",
                "dirLight = -dirLight;" ,
                "float lightIntensity = clamp(dot(normalc, dirLight), 0.0, 0.1);",
                "if(lightIntensity > 0.0){" ,
                    "finalColor = finalColor + (diffuseColor * lightIntensity);",
                    "vec4 cameraToVertexNormal = normalize(vec4(camera_pos, 1.0) - fragmentPosition);",
                    "vec3 reflection = normalize(reflect(dirLight, normalc));",
                    "float specFactor = dot(cameraToVertexNormal, vec4(reflection, 1.0));" ,
                    "if(specFactor > 0.0){",
                        "float shinyness = 0.025;",
                        "specFactor = pow(specFactor, 2.0);",
                        "specularColor = vec4(vec3(1.0,1.0,1.0) * shinyness * specFactor, 1.0);",
                    "}",
                "}",
                "finalColor = clamp(finalColor, 0.0, 1.0);",
                "vec4 pixelColor1 = texture2D(textured_0, vertUV * 16.0);",
                "vec4 pixelColor2 = texture2D(textured_1, vertUV * 16.0);",
                "vec4 pixelColor3 = texture2D(textured_2, vertUV * 16.0);",
                "vec2 nCoords = vec2(vertUV.s, vertUV.t);",
                "vec4 heightCoord = texture2D(height_map, nCoords);",
                "if(heightCoord.x > 0.0 && heightCoord.x < 0.30){",
                    "gl_FragColor = pixelColor1;",
                "}",
                "else if((heightCoord.x > 0.30) && (heightCoord.x < 0.40)){",
                    "float nNum = (heightCoord.x - 0.30) / (0.1);" ,
                    "gl_FragColor = (pixelColor2 * nNum) + (pixelColor1 * (1.0 - nNum));",
                "}",
                "else if(heightCoord.x > 0.40 && heightCoord.x < 0.50){",
                    "gl_FragColor = pixelColor2;",
                "}",
                "else if(heightCoord.x > 0.50 && heightCoord.x < 0.60){",
                    "float nNum = (heightCoord.x - 0.50) / (0.1);",
                    "gl_FragColor = (pixelColor3 * nNum) + (pixelColor2 * (1.0 - nNum));",
                "}",
                "else{ gl_FragColor = pixelColor3; }",
                "gl_FragColor = (finalColor + specularColor) * gl_FragColor;",
              "}",
        ].join('\n');
        return fragmentShader;
    }
}