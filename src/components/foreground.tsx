'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const PlanetScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 30);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;

    // Iluminação
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    let planet = null;
    let hoverTextSprite = null;
    let hovered = false;
    let textOffset = new THREE.Vector3();

    const createTextSprite = (message) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const fontSize = 64;
      context.font = `${fontSize}px Arial`;
      const textWidth = context.measureText(message).width;
      
      canvas.width = textWidth * 1.2;
      canvas.height = fontSize * 2;
      
      context.fillStyle = 'rgba(0,0,0,0)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.font = `${fontSize}px Arial`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = 'white';
      context.fillText(message, canvas.width/2, canvas.height/2);

      const texture = new THREE.CanvasTexture(canvas);
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
    loader.load(
      '/models/planet.glb',
      (gltf) => {
        planet = gltf.scene;
        planet.position.set(-30, -5, -20);
        scene.add(planet);

        // Calcula a posição inicial do texto
        const box = new THREE.Box3().setFromObject(planet);
        const size = new THREE.Vector3();
        box.getSize(size);
        textOffset = new THREE.Vector3(
          0,
          size.y * 0.2,
          size.z * 0.2
        );

        hoverTextSprite = createTextSprite('sobre mim');
        hoverTextSprite.position.copy(planet.position).add(textOffset);
        scene.add(hoverTextSprite);
        hoverTextSprite.visible = false;
      },
      undefined,
      (error) => {
        console.error('Erro ao carregar o planeta:', error);
      }
    );

    const updateTextPosition = () => {
      if (planet && hoverTextSprite) {
        hoverTextSprite.position.copy(planet.position).add(textOffset);
      }
    };

    const handleMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(planet, true);

      if (intersects.length > 0 && !hovered) {
        planet.scale.set(2.5, 2.5, 2.5);
        hoverTextSprite.visible = true;
        hovered = true;
      } else if (hovered && intersects.length === 0) {
        planet.scale.set(1, 1, 1);
        hoverTextSprite.visible = false;
        hovered = false;
      }
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      
      if (planet) {
        planet.rotation.y += 0.007;
        updateTextPosition();
      }

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
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}
    />
  );
};

export default PlanetScene;