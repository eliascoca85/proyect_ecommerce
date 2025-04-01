import { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

// Componente del modelo animado
export default function AnimaLaptop(props) {
  const group = useRef()

  // Cargar el modelo y las animaciones desde la ruta pública
  const { scene, animations } = useGLTF('/models/laptop/scene.gltf')

  // Animaciones disponibles del modelo
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      actions[Object.keys(actions)[0]].play()
    }
  }, [actions])

  return (
    <primitive
      ref={group}
      object={scene}
      scale={0.5} // Puedes ajustar el tamaño
      position={[0, -1, 0]} // Puedes moverlo en el eje Y si quieres centrarlo mejor
      {...props}
    />
  )
}

useGLTF.preload('/models/laptop/scene.gltf') // Optimización para precargar el modelo
