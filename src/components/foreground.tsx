'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useRouter } from 'next/navigation';

const CombinedScene = () => {
  const mountRef = useRef(null);
  const videoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Setup video background
    const video = document.createElement('video');
    video.src = '/fundomain.mp4';
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100vw';
    video.style.height = '100vh';
    video.style.objectFit = 'cover';
    video.style.zIndex = '0';
    
    document.body.appendChild(video);
    videoRef.current = video;

    // Handle autoplay restrictions
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Autoplay prevented:', error);
      });
    }

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = null; // Make scene transparent
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 30);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    let planet = null;
    let earth = null;
    let whitePlanet = null;

    let planetHoverTextSprite = null;
    let earthHoverTextSprite = null;
    let whitePlanetHoverTextSprite = null;

    let hoveredPlanet = false;
    let hoveredEarth = false;
    let hoveredWhitePlanet = false;

    let planetTextOffset = new THREE.Vector3();
    let earthTextOffset = new THREE.Vector3();
    let whitePlanetTextOffset = new THREE.Vector3();

    const createTextSprite = (message) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const fontSize = 80;
      context.font = `${fontSize}px evafont`;
      const textWidth = context.measureText(message).width;

      canvas.width = textWidth * 1.2;
      canvas.height = fontSize * 2;

      context.fillStyle = 'rgba(0,0,0,0)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.font = `${fontSize}px evafont`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = 'white';
      context.fillText(message, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;

      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false
      });

      const sprite = new THREE.Sprite(material);
      sprite.scale.set(10, 5, 1);
      sprite.renderOrder = 999;
      return sprite;
    };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const loader = new GLTFLoader();

    // Planet (About)
    loader.load('/models/planet.glb', (gltf) => {
      planet = gltf.scene;
      planet.position.set(-30, -5, -20);
      planet.scale.set(1.7, 1.7, 1.7);
      scene.add(planet);

      const box = new THREE.Box3().setFromObject(planet);
      const size = new THREE.Vector3();
      box.getSize(size);
      planetTextOffset = new THREE.Vector3(0, size.y * 0.1, size.z * 0.1);

      planetHoverTextSprite = createTextSprite('About Me');
      planetHoverTextSprite.position.copy(planet.position).add(planetTextOffset);
      scene.add(planetHoverTextSprite);
      planetHoverTextSprite.visible = false;
    });

    // Earth (Projects)
    loader.load('/models/earth.glb', (gltf) => {
      earth = gltf.scene;
      earth.position.set(30, -5, -20);
      earth.scale.set(0.1, 0.1, 0.1);
      scene.add(earth);

      const box = new THREE.Box3().setFromObject(earth);
      const size = new THREE.Vector3();
      box.getSize(size);
      earthTextOffset = new THREE.Vector3(0, size.y * 0.8, size.z * 0.15);

      earthHoverTextSprite = createTextSprite('Projects');
      earthHoverTextSprite.position.copy(earth.position).add(earthTextOffset);
      scene.add(earthHoverTextSprite);
      earthHoverTextSprite.visible = false;
    });

    // White Planet (Experience)
    loader.load('/models/whitePlanet.glb', (gltf) => {
      whitePlanet = gltf.scene;
      whitePlanet.position.set(-3, 8, 10);
      whitePlanet.scale.set(0.7, 0.7, 0.7);
      scene.add(whitePlanet);

      const box = new THREE.Box3().setFromObject(whitePlanet);
      const size = new THREE.Vector3();
      box.getSize(size);
      whitePlanetTextOffset = new THREE.Vector3(0, size.y * 0.1, size.z * 0.1);

      whitePlanetHoverTextSprite = createTextSprite('Experience');
      whitePlanetHoverTextSprite.position.copy(whitePlanet.position).add(whitePlanetTextOffset);
      whitePlanetHoverTextSprite.scale.set(4, 2, 4);
      scene.add(whitePlanetHoverTextSprite);
      whitePlanetHoverTextSprite.visible = false;
    });

    const updateTextPositions = () => {
      if (planet && planetHoverTextSprite) {
        planetHoverTextSprite.position.copy(planet.position).add(planetTextOffset);
      }
      if (earth && earthHoverTextSprite) {
        earthHoverTextSprite.position.copy(earth.position).add(earthTextOffset);
      }
      if (whitePlanet && whitePlanetHoverTextSprite) {
        whitePlanetHoverTextSprite.position.copy(whitePlanet.position).add(whitePlanetTextOffset);
      }
    };

    const handleMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const planetIntersects = planet ? raycaster.intersectObject(planet, true) : [];
      const earthIntersects = earth ? raycaster.intersectObject(earth, true) : [];
      const whitePlanetIntersects = whitePlanet ? raycaster.intersectObject(whitePlanet, true) : [];

      document.body.style.cursor =
        planetIntersects.length > 0 || earthIntersects.length > 0 || whitePlanetIntersects.length > 0
          ? 'pointer'
          : 'auto';

      if (planetIntersects.length > 0) {
        if (!hoveredPlanet) {
          planet.scale.set(2.5, 2.5, 2.5);
          planetHoverTextSprite.visible = true;
          hoveredPlanet = true;
        }
      } else if (hoveredPlanet) {
        planet.scale.set(1.7, 1.7, 1.7);
        planetHoverTextSprite.visible = false;
        hoveredPlanet = false;
      }

      if (earthIntersects.length > 0) {
        if (!hoveredEarth) {
          earth.scale.set(0.13, 0.13, 0.13);
          earthHoverTextSprite.visible = true;
          hoveredEarth = true;
        }
      } else if (hoveredEarth) {
        earth.scale.set(0.11, 0.11, 0.11);
        earthHoverTextSprite.visible = false;
        hoveredEarth = false;
      }

      if (whitePlanetIntersects.length > 0) {
        if (!hoveredWhitePlanet) {
          whitePlanet.scale.set(1.0, 1.0, 1.0);
          whitePlanetHoverTextSprite.visible = true;
          hoveredWhitePlanet = true;
        }
      } else if (hoveredWhitePlanet) {
        whitePlanet.scale.set(0.7, 0.7, 0.7);
        whitePlanetHoverTextSprite.visible = false;
        hoveredWhitePlanet = false;
      }
    };

    const handleClick = () => {
      if (hoveredPlanet) {
        router.push('/about');
      } else if (hoveredEarth) {
        router.push('/projects');
      } else if (hoveredWhitePlanet) {
        router.push('/experience');
      }
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', handleClick);

    const animate = () => {
      requestAnimationFrame(animate);
      if (planet) planet.rotation.y += 0.00175;
      if (earth) earth.rotation.y += 0.00175;
      if (whitePlanet) whitePlanet.rotation.y += 0.00175;


      updateTextPositions();
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('click', handleClick);
      document.body.style.cursor = 'auto';
      controls.dispose();
      renderer.dispose();
      scene.clear();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (videoRef.current) {
        videoRef.current.pause();
        document.body.removeChild(videoRef.current);
      }
    };
  }, [router]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div
        ref={mountRef}
        style={{ 
          width: '100%', 
          height: '100%', 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          zIndex: 1,
          pointerEvents: 'auto'
        }}
      />
    </div>
  );
};

export default CombinedScene;