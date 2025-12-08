"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const CircleGeometry = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initCamera = () => {
    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 8;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5;
    return camera;
  };

  const initScene = () => {
    const scene = new THREE.Scene();
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(0, 0, 2).normalize();
    scene.add(light);
    return scene;
  };

  const render = () => {
    const radius = 2;
    const segments = 24;
    const geometry = new THREE.CircleGeometry(radius, segments);
    const material = new THREE.MeshPhongMaterial({
      color: 0x44aa88,
      side: THREE.DoubleSide, // 设置双面渲染
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    return cube;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });
    const scene = initScene();
    const camera = initCamera();
    const mesh = render();
    scene.add(mesh);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.render(scene, camera);

    let animationId: number;
    const animate = (time: number) => {
      time *= 0.001;
      const speed = 1;
      const rot = time * speed;
      // console.log("rot: ", rot);
      //   mesh.rotation.z = rot;
      mesh.rotation.x = rot;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className="flex-1 min-h-0">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
};

export default CircleGeometry;
