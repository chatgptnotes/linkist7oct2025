"use client";
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    THREE: any;
    TweenMax: any;
    TimelineMax: any;
    Power4: any;
    Power2: any;
  }
}

class App {
  renderer: any;
  camera: any;
  scene: any;
  pointLight: any;
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderer = undefined;
    this.camera = undefined;
    this.init();
  }

  init() {
    // scene setup
    this.scene = new window.THREE.Scene();
    this.scene.background = new window.THREE.Color(0x111111);

    // light setup
    this.pointLight = new window.THREE.PointLight(0xffffff, 0);
    this.pointLight.position.set(-50, 40, 100);
    this.pointLight.castShadow = true;
    this.scene.add(this.pointLight);

    // dim light
    new window.TweenMax.to([this.pointLight], 1, {
      intensity: 1,
      delay: 1
    });

    this.initCamera();
    this.initRenderer();
    this.createCanvas();
    this.render();
    this.initCards(0, 0, -10, "card-1", true);
    this.initCards(0, 0, 10, "card-2", false);
    this.cardAnimation();

    window.addEventListener(
      "resize",
      () => {
        this.onWindowResize();
      },
      false
    );
  }

  createCanvas() {
    // add canvas to container
    this.container.appendChild(this.renderer.domElement);
  }

  initRenderer() {
    // WebGL renderer
    this.renderer = new window.THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  initCamera() {
    // camera setup
    this.camera = new window.THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      1,
      1000
    );
    this.camera.position.z = 250;
    this.camera.position.y = -400;
    this.camera.position.x = 250;
    this.camera.rotation.y = 0.5;
    this.camera.rotation.x = 1;
    this.camera.rotation.z = 0.2;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());
  }

  // canvas size update
  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  initCards(px: number, py: number, pz: number, name: string, reversed: boolean) {
    var radius = 6;
    var width = 140,
      height = 100;
    var geometry = new window.THREE.BoxGeometry(width, height, 1, 100, 50, 10);

    let textureFront = new window.THREE.TextureLoader().load("/card_linkist_black_png.png");
    let textureBack = new window.THREE.TextureLoader().load("/linkist_Card_Mockup.png");

    if (reversed) {
      textureFront = new window.THREE.TextureLoader().load("/linkist_Card_Mockup.png");
      textureBack = new window.THREE.TextureLoader().load("/card_linkist_black_png.png");
    }

    textureFront.anisotropy = textureBack.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

    let cardMaterialArray = [];

    cardMaterialArray.push(
      new window.THREE.MeshPhongMaterial({
        color: 0x555555,
        specular: 0x050505,
        shininess: 100
      })
    );
    cardMaterialArray.push(
      new window.THREE.MeshPhongMaterial({
        color: 0x555555,
        specular: 0x050505,
        shininess: 100
      })
    );
    cardMaterialArray.push(
      new window.THREE.MeshPhongMaterial({
        color: 0x555555,
        specular: 0x050505,
        shininess: 100
      })
    );
    cardMaterialArray.push(
      new window.THREE.MeshPhongMaterial({
        color: 0x555555,
        specular: 0x050505,
        shininess: 100
      })
    );
    cardMaterialArray.push(
      new window.THREE.MeshPhongMaterial({
        map: textureFront,
        specular: 0x050505,
        shininess: 100
      })
    );
    cardMaterialArray.push(
      new window.THREE.MeshPhongMaterial({
        map: textureBack,
        specular: 0x050505,
        shininess: 100
      })
    );

    // For newer Three.js versions, we need to work with BufferGeometry
    if (geometry.attributes && geometry.attributes.position) {
      let v1 = new window.THREE.Vector3();
      let w1 = (width - radius * 2) * 0.5,
        h1 = (height - radius * 2) * 0.5;
      let vTemp = new window.THREE.Vector3(),
        vSign = new window.THREE.Vector3(),
        vRad = new window.THREE.Vector3();
      
      const positions = geometry.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        
        v1.set(w1, h1, z);
        vTemp.multiplyVectors(v1, vSign.set(Math.sign(x), Math.sign(y), 1));
        vRad.set(x, y, z).sub(vTemp);
        
        if (Math.abs(x) > v1.x && Math.abs(y) > v1.y && vRad.length() > radius) {
          vRad.setLength(radius).add(vTemp);
          positions[i] = vRad.x;
          positions[i + 1] = vRad.y;
          positions[i + 2] = vRad.z;
        }
      }
      
      geometry.attributes.position.needsUpdate = true;
    }

    let cube = new window.THREE.Mesh(geometry, cardMaterialArray);
    cube.position.set(px, py, pz);
    cube.name = name;
    this.scene.add(cube);
  }

  cardAnimation() {
    for (let i = 0; i < this.scene.children.length; i++) {
      if (this.scene.children[i].name === "card-1") {
        this.animationTimeline2(this.scene.children[i]);
      }

      if (this.scene.children[i].name === "card-2") {
        this.animationTimeline1(this.scene.children[i]);
      }
    }
  }

  animationTimeline1(element: any) {
    let tl = new window.TimelineMax({
      delay: 1.5,
      repeat: -1
    });

    tl
      .to(element.position, 1.5, {
        y: -80,
        ease: window.Power4.easeInOut
      })
      .to(
        element.rotation,
        2,
        {
          x: 2 * Math.PI,
          ease: window.Power2.easeInOut
        }, '-=0.8')
      .to(
        element.position,
        1,
        {
          y: 0,
          ease: window.Power2.easeOut
        });
  }

  animationTimeline2(element: any) {
    let tl = new window.TimelineMax({
      delay: 1.5,
      repeat: -1
    });

    tl
      .to(element.position, 1.5, {
        y: 80,
        ease: window.Power4.easeInOut
      })
      .to(
        element.rotation,
        2,
        {
          x: -2 * Math.PI,
          ease: window.Power2.easeInOut
        }, '-=0.8')
      .to(
        element.position,
        1,
        {
          y: 0,
          ease: window.Power2.easeOut
        });
  }

  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
      if (this.container && this.renderer.domElement) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
  }
}

export default function ThreeCardAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App | null>(null);

  useEffect(() => {
    // Load Three.js and GSAP scripts
    const loadScripts = async () => {
      if (!window.THREE) {
        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        threeScript.async = true;
        document.head.appendChild(threeScript);
        
        await new Promise((resolve) => {
          threeScript.onload = resolve;
        });
      }

      if (!window.TweenMax) {
        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js';
        gsapScript.async = true;
        document.head.appendChild(gsapScript);
        
        await new Promise((resolve) => {
          gsapScript.onload = resolve;
        });
      }

      // Initialize the 3D scene
      if (containerRef.current && window.THREE && window.TweenMax) {
        appRef.current = new App(containerRef.current);
      }
    };

    loadScripts();

    return () => {
      if (appRef.current) {
        appRef.current.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
}