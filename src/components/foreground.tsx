'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import LanguageSelector from './language-selector'

const CombinedScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const router = useRouter()
  const t = useTranslations('HomePage')

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const video = document.createElement('video')
    video.src = '/fundomain.mp4'
    video.loop = true
    video.muted = true
    video.autoplay = true
    video.playsInline = true
    Object.assign(video.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      objectFit: 'cover',
      zIndex: '0',
    })
    document.body.appendChild(video)
    videoRef.current = video
    video.play().catch((err) => console.warn('Autoplay prevented:', err))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    )

    camera.position.set(0, 2, 30)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.1
    controls.rotateSpeed = 0.5

    scene.add(new THREE.AmbientLight(0x404040, 2))
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(1, 1, 1)
    scene.add(dirLight)

    let planet: THREE.Object3D | null = null
    let earth: THREE.Object3D | null = null
    let whitePlanet: THREE.Object3D | null = null
    let planetLabel: THREE.Sprite,
      earthLabel: THREE.Sprite,
      whiteLabel: THREE.Sprite

    const hovered = { planet: false, earth: false, white: false }
    const offsets = {
      planet: new THREE.Vector3(),
      earth: new THREE.Vector3(),
      white: new THREE.Vector3(),
    }

    const createTextSprite = (msg: string) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const fontSize = 100
      ctx.font = `${fontSize}px evafont`
      const textWidth = ctx.measureText(msg).width
      canvas.width = textWidth * 1.2
      canvas.height = fontSize * 2
      ctx.font = `${fontSize}px evafont`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'white'
      ctx.fillText(msg, canvas.width / 2, canvas.height / 2)
      const tex = new THREE.CanvasTexture(canvas)
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthTest: false,
      })
      const sprite = new THREE.Sprite(mat)
      sprite.scale.set(10, 5, 1)
      sprite.renderOrder = 999
      return sprite
    }

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const loader = new GLTFLoader()

    const isMobile = window.innerWidth <= 768

    loader.load('/models/planet.glb', (gltf) => {
      planet = gltf.scene
      if (planet) {
        if (isMobile) {
          planet.position.set(-8, -13, -20)
        } else {
          planet.position.set(-30, -5, -20)
        }
      }
      planet.scale.set(2.4, 2.4, 2.4)
      scene.add(planet)

      const box = new THREE.Box3().setFromObject(planet)
      const size = new THREE.Vector3()
      box.getSize(size)
      offsets.planet.set(0, size.y * 0, size.z * 0.1)

      planetLabel = createTextSprite(t('aboutMe'))
      planetLabel.position.copy(planet.position).add(offsets.planet)
      planetLabel.visible = true
      scene.add(planetLabel)
    })

    loader.load('/models/earth.glb', (gltf) => {
      earth = gltf.scene
      if (earth) {
        if (isMobile) {
          earth.position.set(8, 0, -20)
        } else {
          earth.position.set(30, -5, -20)
        }
      }
      earth.scale.set(0.12, 0.12, 0.12)
      scene.add(earth)

      const box = new THREE.Box3().setFromObject(earth)
      const size = new THREE.Vector3()
      box.getSize(size)
      offsets.earth.set(1, 5, 0.1)

      earthLabel = createTextSprite(t('projects'))
      earthLabel.position.copy(earth.position).add(offsets.earth)
      earthLabel.visible = true
      scene.add(earthLabel)
    })

    loader.load('/models/whitePlanet.glb', (gltf) => {
      whitePlanet = gltf.scene
      whitePlanet.position.set(-3, 8, 10)
      whitePlanet.scale.set(1, 1, 1)
      scene.add(whitePlanet)

      const box = new THREE.Box3().setFromObject(whitePlanet)
      const size = new THREE.Vector3()
      box.getSize(size)
      offsets.white.set(0, size.y * 0, size.z * 0.1)

      whiteLabel = createTextSprite(t('experience'))
      whiteLabel.position.copy(whitePlanet.position).add(offsets.white)
      whiteLabel.scale.set(4, 2, 4)
      whiteLabel.visible = true
      scene.add(whiteLabel)
    })

    const updateLabels = () => {
      if (planet && planetLabel)
        planetLabel.position.copy(planet.position).add(offsets.planet)
      if (earth && earthLabel)
        earthLabel.position.copy(earth.position).add(offsets.earth)
      if (whitePlanet && whiteLabel)
        whiteLabel.position.copy(whitePlanet.position).add(offsets.white)
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)

      const intersects = {
        planet: planet ? raycaster.intersectObject(planet, true) : [],
        earth: earth ? raycaster.intersectObject(earth, true) : [],
        white: whitePlanet ? raycaster.intersectObject(whitePlanet, true) : [],
      }

      document.body.style.cursor =
        intersects.planet.length ||
        intersects.earth.length ||
        intersects.white.length
          ? 'pointer'
          : 'auto'

      if (intersects.planet.length) {
        if (!hovered.planet && planet) {
          planet.scale.set(3, 3, 3)
          hovered.planet = true
        }
      } else if (hovered.planet && planet) {
        planet.scale.set(2.4, 2.4, 2.4)
        hovered.planet = false
      }

      if (intersects.earth.length) {
        if (!hovered.earth && earth) {
          earth.scale.set(0.15, 0.15, 0.15)
          offsets.earth.set(1, 6, 0)
          hovered.earth = true
        }
      } else if (hovered.earth && earth) {
        earth.scale.set(0.12, 0.12, 0.12)
        offsets.earth.set(1, 5, 0.1)
        hovered.earth = false
      }

      if (intersects.white.length) {
        if (!hovered.white && whitePlanet) {
          whitePlanet.scale.set(1.3, 1.3, 1.3)
          hovered.white = true
        }
      } else if (hovered.white && whitePlanet) {
        whitePlanet.scale.set(1, 1, 1)
        hovered.white = false
      }
    }

    const onClick = () => {
      if (hovered.planet) router.push('/about')
      else if (hovered.earth) router.push('/projects')
      else if (hovered.white) router.push('/experience')
    }

    renderer.domElement.addEventListener('mousemove', onMouseMove)
    renderer.domElement.addEventListener('click', onClick)

    const animate = () => {
      requestAnimationFrame(animate)
      if (planet) planet.rotation.y += 0.00175
      if (earth) earth.rotation.y += 0.00175
      if (whitePlanet) whitePlanet.rotation.y += 0.00175
      updateLabels()
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      renderer.domElement.removeEventListener('mousemove', onMouseMove)
      renderer.domElement.removeEventListener('click', onClick)
      controls.dispose()
      renderer.dispose()
      scene.clear()
      mount.removeChild(renderer.domElement)
      if (videoRef.current) {
        videoRef.current.pause()
        document.body.removeChild(videoRef.current)
      }
    }
  }, [router, t])

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
          pointerEvents: 'auto',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 10,
        }}
      >
        <LanguageSelector />
      </div>
    </div>
  )
}

export default CombinedScene
