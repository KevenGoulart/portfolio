'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useRouter } from 'next/navigation'

const EarthScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // --- Cena, câmera e renderer ---
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 2, 30)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // --- Controles ---
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.1
    controls.rotateSpeed = 0.5

    // --- Iluminação ---
    const ambientLight = new THREE.AmbientLight(0x404040, 2)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // --- Variáveis de estado da Terra e do texto ---
    let earth: THREE.Group | null = null
    let hoverTextSprite: THREE.Sprite | null = null
    let hovered = false
    let textOffset = new THREE.Vector3()

    // --- Função para criar o sprite de texto ---
    const createTextSprite = (message: string): THREE.Sprite => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error('Não foi possível obter o contexto 2D do canvas.')
      }

      const fontSize = 64
      context.font = `${fontSize}px evafont`
      const textWidth = context.measureText(message).width

      canvas.width = textWidth * 1.2
      canvas.height = fontSize * 2

      context.clearRect(0, 0, canvas.width, canvas.height)
      context.font = `${fontSize}px evafont`
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillStyle = 'white'
      context.fillText(message, canvas.width / 2, canvas.height / 2)

      const texture = new THREE.CanvasTexture(canvas)
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false
      })

      const sprite = new THREE.Sprite(material)
      sprite.scale.set(10, 5, 1)
      sprite.renderOrder = 999
      return sprite
    }

    // --- Raycaster para detectar hover ---
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // --- Carregamento do modelo glTF da Terra ---
    const loader = new GLTFLoader()
    loader.load(
      '/models/earth.glb',
      (gltf) => {
        earth = gltf.scene as THREE.Group
        earth.position.set(30, -5, -20)
        earth.scale.set(1.7, 1.7, 1.7)
        scene.add(earth)

        // Calcula o deslocamento para posicionar o texto acima da Terra
        const box = new THREE.Box3().setFromObject(earth)
        const size = new THREE.Vector3()
        box.getSize(size)
        textOffset = new THREE.Vector3(0, size.y * 0.2, size.z * 0.2)

        hoverTextSprite = createTextSprite('Earth')
        hoverTextSprite.position.copy(earth.position).add(textOffset)
        scene.add(hoverTextSprite)
        hoverTextSprite.visible = false
      },
      undefined,
      (error) => {
        console.error('Erro ao carregar a Terra:', error)
      }
    )

    // --- Atualiza posição do texto a cada frame ---
    const updateTextPosition = (): void => {
      if (earth && hoverTextSprite) {
        hoverTextSprite.position.copy(earth.position).add(textOffset)
      }
    }

    // --- Eventos de mouse ---
    const handleMouseMove = (event: MouseEvent): void => {
      if (!earth || !hoverTextSprite) return

      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(earth, true)

      if (intersects.length > 0) {
        if (!hovered) {
          document.body.style.cursor = 'pointer'
          earth.scale.set(2.5, 2.5, 2.5)
          hoverTextSprite.visible = true
          hovered = true
        }
      } else if (hovered) {
        document.body.style.cursor = 'auto'
        earth.scale.set(1.7, 1.7, 1.7)
        hoverTextSprite.visible = false
        hovered = false
      }
    }

    const handleClick = (): void => {
      if (hovered) {
        router.push('/earth-details')
      }
    }

    renderer.domElement.addEventListener('mousemove', handleMouseMove)
    renderer.domElement.addEventListener('click', handleClick)

    // --- Loop de animação ---
    const animate = (): void => {
      requestAnimationFrame(animate)
      if (earth) {
        earth.rotation.y += 0.007
        updateTextPosition()
      }
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // --- Redimensionamento da janela ---
    const handleResize = (): void => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // --- Cleanup na desmontagem ---
    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('mousemove', handleMouseMove)
      renderer.domElement.removeEventListener('click', handleClick)
      document.body.style.cursor = 'auto'

      controls.dispose()
      renderer.dispose()
      scene.clear()

      mount.removeChild(renderer.domElement)
    }
  }, [router])

  return (
    <div
      ref={mountRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0
      }}
    />
  )
}

export default EarthScene
