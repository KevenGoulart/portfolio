/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useLayoutEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FaGithub } from 'react-icons/fa'
import Image from 'next/image'
import Geeklog from '../../../public/assets/logo.png'
import { useTranslations } from 'next-intl'

export default function About() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const spaceshipRef = useRef<THREE.Object3D | null>(null)
  const planetRef = useRef<THREE.Object3D | null>(null)
  const astroRef = useRef<THREE.Object3D | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const [githubPosition, setGithubPosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const t = useTranslations('Projects')

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  useLayoutEffect(() => {
    if (!mountRef.current) return

    const { clientWidth, clientHeight } = mountRef.current
    if (clientWidth === 0 || clientHeight === 0) return

    setIsMobile(window.innerWidth < 768)

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      clientWidth / clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 10)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(clientWidth, clientHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    scene.add(new THREE.AmbientLight(0xffffff, 1.5))
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)

    const loader = new GLTFLoader()

    const calculateSpaceshipPosition = () => {
      if (!spaceshipRef.current || !cameraRef.current) return
      const distance =
        cameraRef.current.position.z - spaceshipRef.current.position.z
      const fov = cameraRef.current.fov * (Math.PI / 180)
      const visibleHeight = 2 * Math.tan(fov / 2) * distance
      const visibleWidth = visibleHeight * cameraRef.current.aspect
      const marginX = visibleWidth * 0.05
      const marginY = visibleHeight * 0.05

      spaceshipRef.current.position.set(
        -visibleWidth / 2 + marginX,
        visibleHeight / 2 - marginY,
        0
      )
    }

    const calculateGithubIcon = () => {
      if (!astroRef.current || !cameraRef.current || isMobile) return
      const distance =
        cameraRef.current.position.z - astroRef.current.position.z
      const fov = cameraRef.current.fov * (Math.PI / 180)
      const visibleHeight = 2 * Math.tan(fov / 2) * distance
      const visibleWidth = visibleHeight * cameraRef.current.aspect
      const marginX = visibleWidth * 0.23
      const marginY = visibleHeight * 0.25

      astroRef.current.position.set(
        visibleWidth / 1.775 - marginX,
        -visibleHeight / 2.6 + marginY,
        0
      )

      const worldPos = new THREE.Vector3()
      astroRef.current.getWorldPosition(worldPos)
      worldPos.project(cameraRef.current!)

      setGithubPosition({
        x: (worldPos.x * 0.5 + 0.5) * window.innerWidth,
        y: (worldPos.y * -0.5 + 0.5) * window.innerHeight
      })
    }

    loader.load('/models/earth.glb', (gltf) => {
      planetRef.current = gltf.scene
      planetRef.current.position.set(0, -3.5, 0)
      planetRef.current.scale.set(0.09, 0.09, 0.09)
      scene.add(planetRef.current)
    })

    loader.load('/models/naveAlien.glb', (gltf) => {
      spaceshipRef.current = gltf.scene
      spaceshipRef.current.scale.set(0.6, 0.6, 0.6)
      spaceshipRef.current.rotation.set(0.8, 0, -0.1)
      scene.add(spaceshipRef.current)
      calculateSpaceshipPosition()
    })

    if (!isMobile) {
      loader.load('/models/astro.glb', (gltf) => {
        astroRef.current = gltf.scene
        astroRef.current.scale.set(0.5, 0.5, 0.5)
        astroRef.current.rotation.set(0, Math.PI / -4, 0)
        scene.add(astroRef.current)
        calculateGithubIcon()
      })
    }

    const animate = () => {
      requestAnimationFrame(animate)
      if (planetRef.current) planetRef.current.rotation.y += 0.007 / 6
      if (spaceshipRef.current) spaceshipRef.current.rotation.y += 0.02 / 6
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
        calculateGithubIcon()
      }
    }
    animate()

    const handlePointerMove = (event: MouseEvent) => {
      if (!mountRef.current || !spaceshipRef.current || !cameraRef.current)
        return
      const rect = mountRef.current.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, cameraRef.current)
      const intersects = raycaster.intersectObjects(
        spaceshipRef.current.children,
        true
      )
      mountRef.current.style.cursor =
        intersects.length > 0 ? 'pointer' : 'default'
    }

    const handleClick = (event: MouseEvent) => {
      if (!spaceshipRef.current || !mountRef.current || !cameraRef.current)
        return
      const rect = mountRef.current.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, cameraRef.current)
      const intersects = raycaster.intersectObjects(
        spaceshipRef.current.children,
        true
      )
      if (intersects.length > 0) {
        window.location.href = '/'
      }
    }

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current)
        return
      const { clientWidth, clientHeight } = mountRef.current
      cameraRef.current.aspect = clientWidth / clientHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(clientWidth, clientHeight)

      setIsMobile(window.innerWidth < 768)
      calculateSpaceshipPosition()
      calculateGithubIcon()
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('click', handleClick)
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [])

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

      <div
        ref={mountRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      <div className="hidden md:block">
        <div className="absolute left-28 top-1/2 transform -translate-y-1/2 z-20 max-w-sm text-white text-3xl flex flex-col items-center text-center space-y-6">
          <div>
            <p className="font-bold">GeekLog</p>
            <p className="mt-2">{t('biggestProject')}</p>
          </div>
          <a
            href="https://geek-log-web.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            <Image src={Geeklog} alt="Geeklog-logo" width={100} height={100} />
          </a>
        </div>

        <div className="absolute right-28 top-1/2 transform -translate-y-1/2 z-20 max-w-sm text-white text-3xl text-center">
          <p>{t('otherProjects')}</p>
        </div>
      </div>

      <div className="md:hidden absolute inset-0 z-20 flex flex-col justify-between items-center px-4 text-white text-center">
        <div className="pt-8 flex flex-col items-center space-y-2">
          <p className="font-bold text-xl">GeekLog</p>
          <p className="max-w-xs">{t('biggestProject')}</p>
          <a
            href="https://geek-log-web.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={Geeklog}
              alt="Geeklog-logo"
              width={50}
              height={50}
              className="block"
            />
          </a>
        </div>

        <h1 className="text-4xl font-bold drop-shadow-lg tracking-wide">
          {t('title')}
        </h1>

        <div className="pb-24 flex flex-col items-center space-y-2">
          <p>{t('otherProjectsInParts1')}</p>
          <p>{t('otherProjectsInParts2')}</p>
          <a
            href="https://github.com/KevenGoulart?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="pt-2"
          >
            <FaGithub className="w-16 h-16" />
          </a>
        </div>
      </div>

      {(isMobile || githubPosition.x !== 0) && (
        <div
          style={
            isMobile
              ? {
                  position: 'absolute',
                  left: '50%',
                  top: '87%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 30
                }
              : {
                  position: 'absolute',
                  left: `${githubPosition.x}px`,
                  top: `${githubPosition.y}px`,
                  transform: 'translate(-50%, -135%)',
                  zIndex: 30
                }
          }
          className="pointer-events-auto max-sm:hidden"
        >
          <a
            href="https://github.com/KevenGoulart?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors"
          >
            <FaGithub className="w-16 h-16" />
          </a>
        </div>
      )}

      <div className="hidden md:flex relative z-10 items-center justify-center h-full">
        <h1 className="text-white text-5xl font-bold drop-shadow-lg text-center tracking-wide">
          {t('title')}
        </h1>
      </div>
    </div>
  )
}
