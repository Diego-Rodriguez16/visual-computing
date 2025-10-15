import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ModelViewer = forwardRef(({ modelPath, format, onModelLoaded }, ref) => {
  const mountRef = useRef(null);
  const [renderer, setRenderer] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [model, setModel] = useState(null);
  const [controls, setControls] = useState(null);
  const requestRef = useRef();

  const getLoaderForFormat = (format) => {
    switch (format) {
      case "obj":
        return new OBJLoader();
      case "stl":
        return new STLLoader();
      case "gltf":
        return new GLTFLoader();
      default:
        throw new Error("Formato no soportado");
    }
  };

  const calculateModelStats = (modelObject) => {
    let vertexCount = 0;
    let faceCount = 0;
    let hasNormals = false;
    let hasTextures = false;

    modelObject.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) {
          if (child.geometry.attributes.position) {
            vertexCount += child.geometry.attributes.position.count;
          }
          if (child.geometry.index) {
            faceCount += child.geometry.index.count / 3;
          } else if (child.geometry.attributes.position) {
            faceCount += child.geometry.attributes.position.count / 3;
          }
          hasNormals = hasNormals || !!child.geometry.attributes.normal;
          hasTextures = hasTextures || !!child.geometry.attributes.uv;
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            hasTextures = hasTextures || child.material.some(m => m.map);
          } else {
            hasTextures = hasTextures || !!child.material.map;
          }
        }
      }
    });

    return {
      format: format.toUpperCase(),
      vertexCount,
      faceCount,
      hasNormals,
      hasTextures
    };
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI;
    setControls(controls);

    renderer.domElement.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      alert("¡Ups! 😵 Se perdió el contexto WebGL. Recarga la página.");
    });

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      if (controls) controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (camera && renderer && mountRef.current) {
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
      if (controls) controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!scene || !modelPath || !format) return;

    const startTime = performance.now();
    const loader = getLoaderForFormat(format);
    let newModel = null;

    loader.load(
      modelPath,
      (modelData) => {
        if (model) {
          scene.remove(model);
          model.traverse((child) => {
            if (child.isMesh) {
              child.geometry?.dispose?.();
              if (Array.isArray(child.material)) {
                child.material.forEach((m) => m.dispose?.());
              } else {
                child.material?.dispose?.();
              }
            }
          });
        }

        if (format === 'stl') {
          const material = new THREE.MeshStandardMaterial({ 
            color: 0x7C9CBF,
            roughness: 0.7,
            metalness: 0.2
          });
          newModel = new THREE.Mesh(modelData, material);
        } else if (format === 'gltf') {
          newModel = modelData.scene;
        } else {
          newModel = modelData;
        }

        const box = new THREE.Box3().setFromObject(newModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        newModel.position.x -= 0;
        newModel.position.z -= 0;
        
        // Escalar antes de modificar Y
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const scale = 2 / maxDim;
          newModel.scale.setScalar(scale);
        }
        
        // Forzar altura específica en Y
        newModel.position.y = 0.5;
        

        const stats = calculateModelStats(newModel);

        if (onModelLoaded) {
          const endTime = performance.now();
          stats.loadTime = endTime - startTime;
          onModelLoaded(stats);
        }

        scene.add(newModel);
        setModel(newModel);
      },
      (progress) => {
        console.log(`Cargando: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
      },
      (error) => {
        console.error("❌ Error al cargar el modelo:", error);
      }
    );

    return () => {
      if (newModel) {
        scene.remove(newModel);
        newModel.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.dispose?.();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose?.());
            } else {
              child.material?.dispose?.();
            }
          }
        });
      }
    };
  }, [modelPath, format, scene, onModelLoaded]);

  const resetView = () => {
    if (controls) {
      controls.reset();
    }
  };

  const applyHumanScale = () => {
    if (model && scene) {
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      if (maxDim > 0) {
        const scale = 1.75 / maxDim;
        model.scale.setScalar(scale);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    resetView,
    applyHumanScale
  }));

  return <div ref={mountRef} style={{ width: "100%", height: "500px" }} />;
});

export default ModelViewer;
