'use client'

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

const TVWithGif = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 5);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Create TV model
    const tvMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const screenMaterial = new THREE.MeshBasicMaterial({});

    const tvBody = new THREE.BoxGeometry(2, 1.5, 0.2);
    const screen = new THREE.PlaneGeometry(1.6, 1);

    const tvMesh = new THREE.Mesh(tvBody, tvMaterial);
    tvMesh.position.set(0, 0, 0);
    scene.add(tvMesh);

    const screenMesh = new THREE.Mesh(screen, screenMaterial);
    screenMesh.position.set(0, 0, 0.11);
    tvMesh.add(screenMesh);

    // Apply GIF texture to the screen
    const video = document.createElement('video');
    video.src = '/video.mp4';
    video.loop = true;
    video.muted = true;
    video.play();

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat;

    screenMaterial.map = videoTexture;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      tvMesh.rotation.y += 0.1;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '30%', height: '70vh' }} />;
};

export default TVWithGif;
