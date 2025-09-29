"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const ThreeJSCardAnimation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    pointLight?: THREE.PointLight;
    animationId?: number;
  }>({});

  useEffect(() => {
    if (!mountRef.current) return;

    const current = mountRef.current;
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    sceneRef.current.scene = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      current.clientWidth / current.clientHeight,
      1,
      1000
    );
    camera.position.z = 250;
    camera.position.y = -400;
    camera.position.x = 250;
    camera.rotation.y = 0.5;
    camera.rotation.x = 1;
    camera.rotation.z = 0.2;
    sceneRef.current.camera = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(current.clientWidth, current.clientHeight);
    sceneRef.current.renderer = renderer;

    // Light setup
    const pointLight = new THREE.PointLight(0xffffff, 0);
    pointLight.position.set(-50, 40, 100);
    pointLight.castShadow = true;
    scene.add(pointLight);
    sceneRef.current.pointLight = pointLight;

    // Animate light intensity
    gsap.to(pointLight, { intensity: 1, delay: 1, duration: 1 });

    // Add canvas to DOM
    current.appendChild(renderer.domElement);

    // Create cards
    createCard(scene, renderer, 0, 0, -10, "card-1", true);
    createCard(scene, renderer, 0, 0, 10, "card-2", false);

    // Start animations
    startCardAnimations(scene);

    // Render loop
    const animate = () => {
      sceneRef.current.animationId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!current || !camera || !renderer) return;
      
      camera.aspect = current.clientWidth / current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(current.clientWidth, current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      if (current && renderer.domElement.parentNode === current) {
        current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '500px',
        borderRadius: '20px',
        overflow: 'hidden'
      }} 
    />
  );
};

function createCard(
  scene: THREE.Scene, 
  renderer: THREE.WebGLRenderer, 
  px: number, 
  py: number, 
  pz: number, 
  name: string, 
  reversed: boolean
) {
  const radius = 6;
  const width = 140;
  const height = 100;
  const geometry = new THREE.BoxGeometry(width, height, 1, 100, 50, 10);

  // Use the Linkist card image
  let textureFront = new THREE.TextureLoader().load("/card_linkist_black_png.png");
  let textureBack = new THREE.TextureLoader().load("/card_linkist_black_png.png");

  if (reversed) {
    // For the second card, you could use a different texture or keep the same
    textureFront = new THREE.TextureLoader().load("/card_linkist_black_png.png");
    textureBack = new THREE.TextureLoader().load("/card_linkist_black_png.png");
  }
  
  textureFront.anisotropy = textureBack.anisotropy = renderer.capabilities.getMaxAnisotropy();

  // Create materials for all faces of the card
  const cardMaterialArray = [
    // Edges (gray metallic)
    new THREE.MeshPhongMaterial({
      color: 0x555555,
      specular: 0x050505,
      shininess: 100
    }),
    new THREE.MeshPhongMaterial({
      color: 0x555555,
      specular: 0x050505,
      shininess: 100
    }),
    new THREE.MeshPhongMaterial({
      color: 0x555555,
      specular: 0x050505,
      shininess: 100
    }),
    new THREE.MeshPhongMaterial({
      color: 0x555555,
      specular: 0x050505,
      shininess: 100
    }),
    // Front face
    new THREE.MeshPhongMaterial({
      map: textureFront,
      specular: 0x050505,
      shininess: 100
    }),
    // Back face
    new THREE.MeshPhongMaterial({
      map: textureBack,
      specular: 0x050505,
      shininess: 100
    })
  ];

  // Create rounded corners (if vertices are available)
  const positionAttribute = geometry.getAttribute('position');
  if (positionAttribute) {
    const v1 = new THREE.Vector3();
    const w1 = (width - radius * 2) * 0.5;
    const h1 = (height - radius * 2) * 0.5;
    const vTemp = new THREE.Vector3();
    const vSign = new THREE.Vector3();
    const vRad = new THREE.Vector3();
    
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);
      
      v1.set(w1, h1, z);
      vTemp.multiplyVectors(v1, vSign.set(Math.sign(x), Math.sign(y), 1));
      vRad.set(x, y, z).sub(vTemp);
      
      if (Math.abs(x) > v1.x && Math.abs(y) > v1.y && vRad.length() > radius) {
        vRad.setLength(radius).add(vTemp);
        positionAttribute.setXYZ(i, vRad.x, vRad.y, vRad.z);
      }
    }
    
    positionAttribute.needsUpdate = true;
  }

  const cube = new THREE.Mesh(geometry, cardMaterialArray);
  cube.position.set(px, py, pz);
  cube.name = name;
  scene.add(cube);
}

function startCardAnimations(scene: THREE.Scene) {
  for (let i = 0; i < scene.children.length; i++) {
    const child = scene.children[i];
    if (child.name === "card-1") {
      animationTimeline1(child);
    }
    if (child.name === "card-2") {
      animationTimeline2(child);
    }
  }
}

function animationTimeline1(element: THREE.Object3D) {
  const tl = gsap.timeline({
    delay: 1.5,
    repeat: -1
  });

  tl
    .to(element.position, {
      duration: 1.5,
      y: 80,
      ease: "power4.inOut"
    })
    .to(element.rotation, {
      duration: 2,
      x: -2 * Math.PI,
      ease: "power2.inOut"
    }, '-=0.8')
    .to(element.position, {
      duration: 1,
      y: 0,
      ease: "power2.out"
    });
}

function animationTimeline2(element: THREE.Object3D) {
  const tl = gsap.timeline({
    delay: 1.5,
    repeat: -1
  });

  tl
    .to(element.position, {
      duration: 1.5,
      y: -80,
      ease: "power4.inOut"
    })
    .to(element.rotation, {
      duration: 2,
      x: 2 * Math.PI,
      ease: "power2.inOut"
    }, '-=0.8')
    .to(element.position, {
      duration: 1,
      y: 0,
      ease: "power2.out"
    });
}

export default ThreeJSCardAnimation;