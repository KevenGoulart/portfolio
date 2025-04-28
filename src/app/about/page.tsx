'use client';

import React, { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function About() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const spaceshipRef = useRef<THREE.Object3D | null>(null);
  const planetRef = useRef<THREE.Object3D | null>(null);
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

    loader.load(
      '/models/planet.glb',
      (gltf) => {
        planetRef.current = gltf.scene;
        planetRef.current.position.set(0, 0, 0);
        planetRef.current.scale.set(2.3, 2.3, 2.3);
        scene.add(planetRef.current);
      },
      undefined,
      (error) => console.error('Erro ao carregar planeta:', error)
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
      (error) => console.error('Erro ao carregar nave:', error)
    );

    const animate = () => {
      requestAnimationFrame(animate);

      if (planetRef.current) {
        planetRef.current.rotation.y += 0.007 / 6;
      }

      if (spaceshipRef.current) {
        spaceshipRef.current.rotation.y += 0.02 / 6;
      }

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
    };

    const handlePointerMove = (event: MouseEvent) => {
      if (!mountRef.current || !spaceshipRef.current || !cameraRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, cameraRef.current);
      const intersects = raycaster.intersectObjects(spaceshipRef.current.children, true);
      mountRef.current.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    };

    const handleClick = (event: MouseEvent) => {
      if (!spaceshipRef.current || !mountRef.current || !cameraRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, cameraRef.current);
      const intersects = raycaster.intersectObjects(spaceshipRef.current.children, true);
      if (intersects.length > 0) {
        window.location.href = '/';
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
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/fundo1.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div ref={mountRef} className="absolute inset-0 z-10" />

      <div className="absolute left-24 top-1/2 transform -translate-y-1/2 z-20 max-w-sm text-white text-center text-3xl">
        <p>
          Hello! I’m looking for an opportunity to grow as a professional. I work as a developer specialized in TypeScript, Node.js, React, Next.js, and Nest.
        </p>
      </div>

      <div className="absolute right-24 top-1/2 transform -translate-y-1/2 z-20 max-w-sm text-white text-3xl text-center">
        <p>
          I have experience in developing complete applications, working on both the front-end and back-end, with a focus on scalable and well-structured solutions.
        </p>
      </div>

      <div className="relative z-20 flex items-center justify-center h-full">
        <h1 className="text-white text-4xl font-bold drop-shadow-lg text-center">
          Keven Goulart <br /> FullStack Developer
        </h1>
      </div>

      <div className="absolute bottom-10 left-20 right-20 text-center text-2xl text-white z-20">
        <p>Phone: +55 33 9 9808-8464 / Email: kevengoulartmm@gmail.com</p>
      </div>
    </div>
  );
}
