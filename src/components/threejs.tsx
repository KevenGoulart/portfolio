'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { GLTFLoader } from 'three-stdlib';

const TVWithGif = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#161615');
    const camera = new THREE.PerspectiveCamera(10, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 21);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Model loading
    const loader = new GLTFLoader();
    loader.load(
      '/models/tvoutra.glb', // Path to your exported GLB/GLTF file
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Center the model if it's off-center
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);
        model.position.y += 0.65;

        // Add a video texture plane
        const video = document.createElement('video');
        video.src = '/video.mp4';
        video.loop = true;
        video.muted = true;
        video.play();

        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBAFormat;

        const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
        const videoPlaneGeometry = new THREE.PlaneGeometry(2.5, 2);
        const videoPlane = new THREE.Mesh(videoPlaneGeometry, videoMaterial);

        videoPlane.position.set(-0.46, 0.15, 0.913);
        scene.add(videoPlane);

        // Ensure the camera is facing the model
        camera.lookAt(model.position);
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the GLTF model:', error);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '40vh' }} />;
};

export default TVWithGif;
