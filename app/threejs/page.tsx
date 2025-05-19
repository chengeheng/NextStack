"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeJSPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const makeInstance = (
    scene: THREE.Scene,
    geometry: THREE.BoxGeometry,
    color: number,
    x: number
  ) => {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  };

  const resizeRendererToDisplaySize = (renderer: THREE.WebGLRenderer) => {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    const fov = 75; // 视野范围
    const aspect = 2; // 相机默认值，宽高比
    const near = 0.1; // 近平面
    const far = 5; // 远平面
    // 摄像机默认指向Z轴负方向，上方向朝向Y轴正方向
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2; // 摄像机位置

    const scene = new THREE.Scene(); // 场景

    // 创建一个简单的立方体
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    // 创建一个材质
    // 颜色为0x44aa88，使用MeshPhongMaterial（会受灯光影响） MeshBasicMaterial（不会受灯光影响）
    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });

    // 创建一个网格对象
    // 传入几何体和材质
    // 对象在场景中相对于他父对象的位置、朝向、和缩放。下面的代码中父对象即为场景对象。
    const cube = new THREE.Mesh(geometry, material);

    // 将立方体添加到场景中
    // scene.add(cube);

    // 场景和摄像机传递给渲染器来渲染出整个场景
    renderer.render(scene, camera);
    // 补充灯光效果
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    const cubes = [
      makeInstance(scene, geometry, 0x44aa88, 0),
      makeInstance(scene, geometry, 0x8844aa, -2),
      makeInstance(scene, geometry, 0xaa8844, 2),
    ];

    function render(time: number) {
      time *= 0.001; // 将时间单位变为秒

      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, []);

  return (
    <div>
      <h1>Three.js Page</h1>
      <canvas
        width={300}
        height={200}
        ref={canvasRef}
        style={{ width: "1000px", height: "800px" }}
      ></canvas>
    </div>
  );
};
export default ThreeJSPage;
