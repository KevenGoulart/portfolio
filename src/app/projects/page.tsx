'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FaGithub } from 'react-icons/fa';

export default function About() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const spaceshipRef = useRef<THREE.Object3D | null>(null);
  const planetRef = useRef<THREE.Object3D | null>(null);
  const astroRef = useRef<THREE.Object3D | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [githubPosition, setGithubPosition] = useState({ x: 0, y: 0 });

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

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const loader = new GLTFLoader();

    const calculateGithubIcon = () => {
      if (!astroRef.current || !cameraRef.current) return;
      const distance = cameraRef.current.position.z - astroRef.current.position.z;
      const fov = cameraRef.current.fov * (Math.PI / 180);
      const visibleHeight = 2 * Math.tan(fov / 2) * distance;
      const visibleWidth = visibleHeight * cameraRef.current.aspect;
      const marginX = visibleWidth * 0.23;
      const marginY = visibleHeight * 0.25;

      astroRef.current.position.set(
        visibleWidth / 1.775 - marginX,
        -visibleHeight / 2.6 + marginY,
        0
      );

      const worldPos = new THREE.Vector3();
      astroRef.current.getWorldPosition(worldPos);
      worldPos.project(cameraRef.current!);

      setGithubPosition({
        x: (worldPos.x * 0.5 + 0.5) * window.innerWidth,
        y: (worldPos.y * -0.5 + 0.5) * window.innerHeight,
      });
    };

    loader.load('/models/earth.glb', gltf => {
      planetRef.current = gltf.scene;
      planetRef.current.position.set(0, -3.5, 0);
      planetRef.current.scale.set(0.09, 0.09, 0.09);
      scene.add(planetRef.current);
    });

    loader.load('/models/naveAlien.glb', gltf => {
      spaceshipRef.current = gltf.scene;
      spaceshipRef.current.scale.set(0.6, 0.6, 0.6);
      spaceshipRef.current.rotation.set(0.8, 0, -0.1);
      scene.add(spaceshipRef.current);
    });

    loader.load('/models/astro.glb', gltf => {
      astroRef.current = gltf.scene;
      astroRef.current.scale.set(0.5, 0.5, 0.5);
      astroRef.current.rotation.set(0, Math.PI / -4, 0);
      scene.add(astroRef.current);
      calculateGithubIcon();
    });

    const animate = () => {
      requestAnimationFrame(animate);
      if (planetRef.current) planetRef.current.rotation.y += 0.007 / 6;
      if (spaceshipRef.current) spaceshipRef.current.rotation.y += 0.02 / 6;
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        calculateGithubIcon();
      }
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      cameraRef.current.aspect = clientWidth / clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(clientWidth, clientHeight);
      calculateGithubIcon();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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
        src="/fundo3.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div ref={mountRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* Desktop: dois blocos laterais */}
      <div className="hidden md:block">
        <div className="absolute left-28 top-1/2 transform -translate-y-1/2 z-20 max-w-sm text-white text-3xl text-center space-y-6">
          <p className="font-bold">GeekLog</p>
          <p>
            Meu maior projeto até agora, trata-se de uma rede social baseada na avaliação de
            diferentes tipos de mídia e no compartilhamento com amigos. (link em breve)
          </p>
        </div>
        <div className="absolute right-28 top-1/2 transform -translate-y-1/2 z-20 max-w-sm text-white text-3xl text-center">
          <p>Você pode conferir outros projetos no meu GitHub</p>
        </div>
      </div>

      {/* Mobile: GeekLog acima, título, GitHub abaixo */}
      <div className="md:hidden absolute inset-x-0 top-24 z-20 flex flex-col items-center px-4 space-y-6">
        <div className="text-white text-lg text-center max-w-xs space-y-2">
          <p className="font-bold text-xl">GeekLog</p>
          <p>
            Meu maior projeto até agora, trata-se de uma rede social baseada na avaliação de
            diferentes tipos de mídia e no compartilhamento com amigos. (link em breve)
          </p>
        </div>

        <h1 className="text-white text-4xl font-bold drop-shadow-lg text-center tracking-wide">
          Projetos
        </h1>

        <div className="text-white text-lg text-center max-w-xs">
          <p>Você pode conferir outros projetos no meu GitHub</p>
        </div>
      </div>

      {/* Github icon (always visible) */}
      <div
        style={{
          position: 'absolute',
          left: `${githubPosition.x}px`,
          top: `${githubPosition.y}px`,
          transform: 'translate(-50%, -135%)',
          zIndex: 30,
        }}
      >
        <a
          href="https://github.com/KevenGoulart?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300 transition-colors pointer-events-auto"
        >
          <FaGithub className="w-16 h-16" />
        </a>
      </div>

      {/* Desktop title (hidden on mobile) */}
      <div className="hidden md:flex relative z-10 items-center justify-center h-full">
        <h1 className="text-white text-5xl font-bold drop-shadow-lg text-center tracking-wide">
          Projetos
        </h1>
      </div>
    </div>
  );
}
