'use client';

import React, { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function About() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const spaceshipRef = useRef<THREE.Object3D | null>(null);
  const planetRef = useRef<THREE.Object3D | null>(null);
  const astroRef = useRef<THREE.Object3D | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useLayoutEffect(() => {
    if (!mountRef.current) return;

    const { clientWidth, clientHeight } = mountRef.current;
    if (clientWidth === 0 || clientHeight === 0) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(clientWidth, clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const calculateSpaceshipPosition = () => {
      if (!spaceshipRef.current || !cameraRef.current) return;
      
      const distance = cameraRef.current.position.z - spaceshipRef.current.position.z;
      const aspect = cameraRef.current.aspect;
      const fov = cameraRef.current.fov * (Math.PI / 180);
      const visibleHeight = 2 * Math.tan(fov / 2) * distance;
      const visibleWidth = visibleHeight * aspect;
      const marginX = visibleWidth * 0.05;
      const marginY = visibleHeight * 0.05;
      
      spaceshipRef.current.position.set(
        -visibleWidth / 2 + marginX,
        visibleHeight / 2 - marginY,
        0
      );
    };

    const calculateAstroPosition = () => {
      if (!astroRef.current || !cameraRef.current) return;
      
      const distance = cameraRef.current.position.z - astroRef.current.position.z;
      const aspect = cameraRef.current.aspect;
      const fov = cameraRef.current.fov * (Math.PI / 180);
      const visibleHeight = 2 * Math.tan(fov / 2) * distance;
      const visibleWidth = visibleHeight * aspect;
      const marginX = visibleWidth * 0.23;
      const marginY = visibleHeight * 0.25;
      
      astroRef.current.position.set(
        visibleWidth / 1.78 - marginX,
        -visibleHeight / 2.5 + marginY,
        0
      );
    };

    loader.load(
      '/models/earth.glb',
      (gltf) => {
        planetRef.current = gltf.scene;
        planetRef.current.position.set(0, -3.5, 0);
        planetRef.current.scale.set(0.09, 0.09, 0.09);
        scene.add(planetRef.current);
      },
      undefined,
      (error) => console.error(error)
    );

    loader.load(
      '/models/naveAlien.glb',
      (gltf) => {
        spaceshipRef.current = gltf.scene;
        spaceshipRef.current.scale.set(0.6, 0.6, 0.6);
        spaceshipRef.current.rotation.set(0.8, 0, -0.1);
        scene.add(spaceshipRef.current);
        calculateSpaceshipPosition();
      },
      undefined,
      (error) => console.error(error)
    );

    loader.load(
      '/models/astro.glb',
      (gltf) => {
        astroRef.current = gltf.scene;
        astroRef.current.scale.set(0.5, 0.5, 0.5);
        astroRef.current.rotation.set(0, Math.PI / -4, 0);
        scene.add(astroRef.current);
        calculateAstroPosition();
      },
      undefined,
      (error) => console.error(error)
    );

    const animate = () => {
      requestAnimationFrame(animate);

      if (planetRef.current) planetRef.current.rotation.y += 0.007;
      if (spaceshipRef.current) spaceshipRef.current.rotation.y += 0.02;
      
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      cameraRef.current.aspect = clientWidth / clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(clientWidth, clientHeight);
      calculateSpaceshipPosition();
      calculateAstroPosition();
    };

    const handlePointerMove = (event: MouseEvent) => {
      if (!mountRef.current || !cameraRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, cameraRef.current);
      
      let cursor = 'default';
      if (spaceshipRef.current && raycaster.intersectObjects(spaceshipRef.current.children, true).length > 0) cursor = 'pointer';
      if (astroRef.current && raycaster.intersectObjects(astroRef.current.children, true).length > 0) cursor = 'pointer';
      mountRef.current.style.cursor = cursor;
    };

    const handleClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('a')) return;
      
      if (!mountRef.current || !cameraRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, cameraRef.current);

      if (spaceshipRef.current && raycaster.intersectObjects(spaceshipRef.current.children, true).length > 0) {
        window.location.href = '/';
      }
      if (astroRef.current && raycaster.intersectObjects(astroRef.current.children, true).length > 0) {
        window.location.href = 'https://github.com/KevenGoulart?tab=repositories';
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div className="absolute left-32 top-1/2 transform -translate-y-1/2 z-10 max-w-sm text-white text-center text-3xl">
        <p className="mb-6">GeekLog</p>
        <p>My biggest project yet, a social network based on rating different types of media and sharing with friends</p>
      </div>

      <div className="absolute right-32 top-1/2 transform -translate-y-[40%] z-10 max-w-sm text-white text-3xl text-center space-y-4">
        <p>You can check my other projects on my GitHub</p>
      </div>
    </div>
  );
}