/*jshint esversion: 6 */
// @ts-check

/**
 * Minimal Starter Code for the QuadCopter assignment
 */

 import * as T from "../libs/CS559-Three/build/three.module.js";
 import { Vector3 } from "../libs/CS559-Three/build/three.module.js";
 import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";
 
 
 let renderer = new T.WebGLRenderer();
 renderer.setSize(600, 400);
 document.body.appendChild(renderer.domElement);
 
 let scene = new T.Scene();
 let camera = new T.PerspectiveCamera(
         40,
         renderer.domElement.width / renderer.domElement.height,
         1,
         1000
     );
 
 camera.position.z = 10;
 camera.position.y = 6;
 camera.position.x = 5;
 camera.lookAt(0, 0, 0);
 
 // since we're animating, add OrbitControls
 let controls = new OrbitControls(camera, renderer.domElement);
 
 scene.add(new T.AmbientLight("white", 0.2));
 
 // two lights - both a little off white to give some contrast
 let dirLight1 = new T.DirectionalLight(0xf0e0d0, 1);
 dirLight1.position.set(1, 1, 0);
 scene.add(dirLight1);
 
 let dirLight2 = new T.DirectionalLight(0xd0e0f0, 1);
 dirLight2.position.set(-1, 1, -0.2);
 scene.add(dirLight2);
 
 // make a ground plane
 let groundBox = new T.BoxGeometry(10, 0.1, 10);
 let groundMesh = new T.Mesh(
         groundBox,
         new T.MeshStandardMaterial({ color: 0x88b888, roughness: 0.9 })
     );
 // put the top of the box at the ground level (0)
 groundMesh.position.y = -0.05;
 scene.add(groundMesh);
 
 // this is the part the student should change
 //** GET RID OF THIS SILLY DONUT! Replace it with an aircraft*/
 // let tempGeom = new T.TorusGeometry();
 // let tempMaterial = new T.MeshStandardMaterial({ color: "red" });
 // let tempMesh = new T.Mesh(tempGeom, tempMaterial);
 // scene.add(tempMesh);
 // tempMesh.scale.set(0.5, 0.5, 0.5);
 // tempMesh.position.y = 2;
 
 class Mesh {
     constructor(node) {
         this.base = new T.Group();   
         if(node instanceof Mesh) {
            let mesh = new T.Group();
            node.base.add(this.base);
         } 
         else {
             node.add(this.base);
         }
     }
 }
 
 class Blade extends Mesh {
     constructor(node, numBlades = 8, Length) {
         super(node);
        
         for(let i = 0; i < numBlades; i++) {
             let blade = new T.Mesh(new T.BoxGeometry(0.3, 0.2, Length), 
                                    new T.MeshStandardMaterial({color: "yellow"}));
            
             blade.position.x = (Length/ 2) * Math.cos(i * (8 * Math.PI / numBlades));
             blade.position.z = (Length / 2) * Math.sin(i * (8 * Math.PI / numBlades));
             blade.rotateY(Math.atan2(blade.position.x, blade.position.z));
             this.base.add(blade);
         }
     }
 }
 
 class Body extends Mesh {
     constructor(stage) {
         super(stage);     
         let mainBody = new T.Mesh(new T.BoxGeometry (1,0.6,2), new T.MeshStandardMaterial({color: "blue"}));
         this.base.add(mainBody);     
         let head = new T.Mesh(new T.ConeGeometry (0.3,2,3), new T.MeshStandardMaterial({color: "blue"}));
         head.rotateX(Math.PI/2);
         head.position.set(0,0.5,1.5);
         head.translateZ(0.5);
 
         this.base.add(head);
         this.blades = [];
    
         for(let i = 0; i < 4; i++) {
             let angle = (i * Math.PI / 2) + (Math.PI / 4);          
             let arm = new T.Mesh(new T.CylinderGeometry (0.15,0.15, 3,50),
                                       new T.MeshStandardMaterial({color: "green"}));
 
             arm.position.x = 3 * Math.cos(angle) / 2;
             arm.position.z = 3 * Math.sin(angle) / 2;
             arm.rotateY(angle);
             arm.rotateOnAxis(new T.Vector3(1, 0, 0), Math.PI/2);
             this.base.add(arm);
             let blade = new Blade(this, 8, 1);
             blade.base.position.x = 3 * Math.cos(angle);
             blade.base.position.y = 0.2;
             blade.base.position.z = 3 * Math.sin(angle) ;
             this.blades.push(blade);
         }
     }
     
 }
 class RadioDish extends Mesh {
     constructor(node) {
         super(node);
         let dish = new T.Mesh(new T.ConeGeometry(1,1,64,1), new T.MeshStandardMaterial({color: "grey"}));
         let g1 = new T.Group();
         let g2 = new T.Group();             
         dish.position.set(0, 0.5, 1.3); 
         dish.rotateOnAxis(new Vector3(-1,0,0), Math.PI/2); 
         g1.add(dish);
         g1.position.set(0, 0.7, 0);
         g2.add(g1);
         this.base.add(g2);
     }
 }
 
 class Stand extends Mesh {
     constructor(node) {
         super(node);
       
         let base1 = new T.Mesh(new T.CylinderGeometry(0.8,0.8),
                                   new T.MeshStandardMaterial({color:"yellow"}));
         let base2 = new T.Mesh(new T.CylinderGeometry(0.4,0.4, 1),
                                     new T.MeshStandardMaterial({color:"yellow"}))
                                     base2.position.set(0,1,0);
         base1.position.y = 0.3;
         this.base.add(base1,base2);
      
         this.disk = new RadioDish(this);
        
     }   
 }
 
 class radar extends Mesh {
     constructor(node) {
         super(node);
         this.object = new Body(this);
        //  this.object.base.position.y = 5;
         this.object.base.position.set(0,5,0);
         this.Station = new Stand(this);
         
     }
 }



 function secondCraft(x,y,z){
    let props = [];
    // create a body
    let main = new T.Mesh(new T.SphereGeometry(1,32,32),new T.MeshStandardMaterial({color:"green"}));
    // create arm
    let arms = [];  
    let arm1 = new T.Mesh(new T.CylinderGeometry(0.1,0.1,4,32,32), 
                          new T.MeshStandardMaterial({color:"red"})); 
    
    let arm2 = new T.Mesh(new T.CylinderGeometry(0.1,0.1,4,32,32),
                          new T.MeshStandardMaterial({color:"red"})); 
 
    arms.push(arm1,arm2);
    main.add(arm1,arm2);
  
    arm1.rotateOnAxis(new Vector3(1,0,0), Math.PI/2);
    arm1.rotateOnAxis(new Vector3(0,0,1), Math.PI/4);
    
    arm2.rotateOnAxis(new Vector3(1,0,0), Math.PI/2);
    arm2.rotateOnAxis(new Vector3(0,0,1), -Math.PI/4);
    
    //propellers 
    for (let i = 0; i < 2; i ++){
      for (let j = 0; j < 2; j++) {
        let prop1 = new T.Mesh(new T.BoxGeometry(0.1,1.2,0.02),new T.MeshStandardMaterial({color:"yellow"}));
        let prop2 = new T.Mesh(new T.BoxGeometry(0.1,1.2,0.02),new T.MeshStandardMaterial({color:"yellow"}));
        arms[i].add(prop1, prop2);
     
        prop1.position.y = 1.8*(-1)**j;
        prop1.position.z = -0.3

        prop2.position.y = 1.8*(-1)**j;
        prop2.position.z = -0.3

        prop2.rotateOnAxis(new Vector3(0,0,1), Math.PI/2);
        props.push(prop1,prop2);
      }
    }

    main.position.set(x,y,z);
    main.scale.set(0.7,0.15,0.5);
    scene.add(main);
    return [main,props]
  }

 let group1 = new radar(scene);
   
   group1.base.translateZ(3);

   group1.base.scale.x = 0.3;
   group1.base.scale.y = 0.3;
   group1.base.scale.z = 0.3;
 
 
let secondPlane = secondCraft(5,3,9);

 // animation loop
 function animateLoop(timestamp) {
     //** EXAMPLE CODE - STUDENT SHOULD REPLACE */
     // move in a circle
     // let theta = timestamp / 1000;
     // let x = 3 * Math.cos(theta);
     // let z = 3 * Math.sin(theta);
     // tempMesh.position.x = x;
     // tempMesh.position.z = z;

     group1.object.base.position.x = 10 * Math.cos(timestamp / 1000);
     group1.object.base.position.z = 10 * Math.sin(timestamp / 1000);
     let angle = Math.atan2(10 * Math.sin(timestamp / 1000), 10 * Math.cos(timestamp / 1000));
     group1.object.base.rotation.y = -angle;
  
 
 
     for(let i = 0; i < group1.object.blades.length; i++) {
         if(i % 2 == 0) {
             group1.object.blades[i].base.rotateY(Math.PI/8);
         } else {
             group1.object.blades[i].base.rotateY(-Math.PI/8);
         }
     }
     //radar track aircraft
     let target = new T.Vector3();
     group1.object.base.getWorldPosition(target);
     group1.Station.disk.base.lookAt(target);
   

    //second aircraft
    let theta = performance.now() / 1000;
    let x = 2 * Math.cos(theta);
    let z = 2 * Math.sin(theta);

    let plane = secondPlane[0];
    let prop = secondPlane[1];
    plane.position.x = x; 
    plane.position.z = z;
    plane.rotation.y = -Math.atan2(Math.sin(theta),Math.cos(theta));


    
    //up and down
    let t_x = (0.001 * timestamp) % 4;
    plane.position.y = 3 + Math.cos(Math.PI * 1/2 * t_x);

    let temp = 0.1;
    for (let i = 0; i < prop.length; ) {
      for (let j = 0; j < 4; j++, i++) {
        prop[i].rotateZ(temp);
      }
      temp*=-1;
    }
 
     renderer.render(scene, camera);
     window.requestAnimationFrame(animateLoop);
   }
 window.requestAnimationFrame(animateLoop);
 