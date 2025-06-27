"use client";
import { useEffect, useRef, Fragment } from "react";
import * as THREE from "three";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Main = ({ label, desc }: { label: string; desc: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTypes = [
    {
      label: "basic",
      key: "basic",
      demos: [
        {
          label: "BoxGeometry",
          key: "boxGeometry",
          render: (): THREE.Mesh => {
            const width = 1.0;
            const height = 1.0;
            const depth = 1.0;
            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(0, 0, 0); // 设置立方体位置
            return cube;
          },
        },
      ],
    },
  ];

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

  const handleSelectChange = (value: string) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    const scene = initScene();
    const camera = initCamera();
    const selectedDemo = renderTypes
      .flatMap((type) => type.demos)
      .find((demo) => demo.key === value);
    if (selectedDemo && selectedDemo.render) {
      console.log(`Rendering demo: ${selectedDemo.label}`);
      const mesh = selectedDemo.render();
      scene.add(mesh);
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      const animate = (time: number) => {
        time *= 0.001; // 将时间单位变为秒

        const speed = 1;
        const rot = time * speed;
        mesh.rotation.x = rot;
        mesh.rotation.y = rot;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-[16px]">
      <h1>{label}</h1>
      <p className="text-muted-foreground whitespace-pre">{desc}</p>
      <div className="flex-1 flex flex-col gap-[16px]">
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Demo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {renderTypes.map((type) => {
                const { label, key, demos } = type;
                return (
                  <Fragment key={key}>
                    <SelectLabel>{label}</SelectLabel>
                    {demos.map((demo) => {
                      const { label, key } = demo;
                      return (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </Fragment>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <canvas ref={canvasRef} className="w-full"></canvas>
      </div>
    </div>
  );
};

export default Main;
