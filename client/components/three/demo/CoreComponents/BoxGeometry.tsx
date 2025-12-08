"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const BoxGeometry = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = (): THREE.Mesh => {
    const width = 1.0;
    const height = 1.0;
    const depth = 1.0;
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0); // 设置立方体位置
    return cube;
  };

  const initCamera = () => {
    const fov = 75; // 视野范围
    const aspect = 2; // 相机默认值，宽高比
    const near = 0.1; // 近平面
    const far = 5; // 远平面
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2; // 摄像机位置
    return camera;
  };

  const initScene = () => {
    const scene = new THREE.Scene(); // 场景
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(2, 2, 2).normalize();
    scene.add(light);
    return scene;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    const scene = initScene();
    const camera = initCamera();
    const mesh = render();
    scene.add(mesh);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.render(scene, camera);

    let animationId: number;
    const animate = (time: number) => {
      time *= 0.001; // 将时间单位变为秒

      const speed = 1;
      const rot = time * speed;
      mesh.rotation.x = rot;
      mesh.rotation.y = rot;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    // 启动动画
    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="flex-1 min-h-0">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
};

export default BoxGeometry;
