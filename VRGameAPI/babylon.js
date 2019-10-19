var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
     // enable physics in the scene
    scene.enablePhysics(new BABYLON.Vector3(0,-1,0), new BABYLON.AmmoJSPlugin());

    // Create camera and lighting
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 2, -25), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -0.5, 1.0), scene);
    light.position = new BABYLON.Vector3(0, 15, -6);
     // Creat a variable to hold our score.
    var score = 0;

    // Create default environment
    var environment = scene.createDefaultEnvironment({
        skyboxSize: 300,
        groundSize: 200
    });
    environment.setMainColor(new BABYLON.Color3(0.1, 0.3, 0.5));

   // Create spheres
    var numberOfSpheres = 10;
    var spheres = [];
    for (let index = 0; index < numberOfSpheres; index++) {
        spheres[index] = BABYLON.Mesh.CreateIcoSphere("sphere", {radius:0.8, flat:true, subdivisions: 16}, this.scene);
        spheres[index].material = new BABYLON.StandardMaterial("material", scene)
        spheres[index].material.diffuseColor = new BABYLON.Color3(0.588, 0.805, 0.896)
        spheres[index].physicsImpostor = new BABYLON.PhysicsImpostor(spheres[index], BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.7 }, scene);
        spheres[index].position = new BABYLON.Vector3(Math.random() * 20 - 10, 10, Math.random() * 10 - 5);
    }

    // When a sphere is clicked update the score
    scene.onPointerObservable.add((e)=>{
        if(e.type == BABYLON.PointerEventTypes.POINTERDOWN){
            spheres.forEach((s)=>{
                if(e.pickInfo.pickedMesh == s){
                    fadeSphere(s);
                }
            });
        }
    });
    
    //add a function that scales and fades the sphere
function fadeSphere(clickedSphere){
     clickedSphere.isPickable = false;
    score++;
    button.textBlock.text = "Reset Game (Score: "+score+")";
    BABYLON.Animation.CreateAndStartAnimation("sphereScaleDown", clickedSphere, "scaling.x", 30, 10, 1, 0.5, 0);
    BABYLON.Animation.CreateAndStartAnimation("sphereScaleDown", clickedSphere, "scaling.y", 30, 10, 1, 0.5, 0);
    BABYLON.Animation.CreateAndStartAnimation("sphereScaleDown", clickedSphere, "scaling.z", 30, 10, 1, 0.5, 0);
    BABYLON.Animation.CreateAndStartAnimation("sphereVisAnim", clickedSphere, "visibility", 30, 10, 1, 0, 0);

};

function resetGame(){
    score = 0;
    button.textBlock.text = "Reset Game";
    for (let index = 0; index < numberOfSpheres; index++) {
         spheres[index].isPickable = true;
        spheres[index].visibility = 1;
        spheres[index].scaling.x = 1;
        spheres[index].scaling.y = 1;
        spheres[index].scaling.z = 1;
        spheres[index].position = new BABYLON.Vector3(Math.random() * 20 - 10, 10, Math.random() * 10 - 5);
        spheres[index].physicsImpostor.setLinearVelocity(new BABYLON.Vector3());
    }
};
// Create a button to restart the game
    var plane = BABYLON.Mesh.CreatePlane("plane", 40);
    plane.position.set(0, 2, 10);
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
    var button = BABYLON.GUI.Button.CreateSimpleButton("button", "Start Game");
    button.width = 0.25;
    button.height = "40px";
    button.color = "white";
    button.background = "black";
    button.onPointerUpObservable.add(function () {
        resetGame();
    });
    advancedTexture.addControl(button);

    // Add vr
    var helper = scene.createDefaultVRExperience({createDeviceOrientationCamera: false})
    helper.enableInteractions()

    return scene;
};