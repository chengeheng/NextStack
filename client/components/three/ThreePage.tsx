"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import ThreeHeader from "./ThreeHeader";
import ThreeMainList from "./ThreeMainList";
import ThreeSubList from "./ThreeSubList";
import ThreeDemoPanel from "./ThreeDemoPanel";
import FirstDemo from "./demo/firstDemo";
import CoreComponents from "./demo/coreComponents";

type DemoComponentProps = {
  label: string;
  desc: string;
};

type SubDemo = {
  key: string;
  label: string;
  desc: string;
  Cmp?: React.ComponentType<DemoComponentProps>;
};

type MainDemo = {
  key: string;
  label: string;
  desc: string;
  category: string;
  subDemos?: SubDemo[];
  Cmp?: React.ComponentType<DemoComponentProps>;
};

const ThreePage = () => {
  const [selectedMainDemo, setSelectedMainDemo] =
    useState<string>("first-demo");
  const [selectedSubDemo, setSelectedSubDemo] = useState<string | null>(null);
  const [isInSubMenu, setIsInSubMenu] = useState(false);

  const demos: MainDemo[] = [
    {
      key: "first-demo",
      label: "First Demo",
      desc: "第一个 Three.js 示例，创建一个简单的立方体。",
      category: "基础入门",
      Cmp: FirstDemo as React.ComponentType<DemoComponentProps>,
    },
    {
      key: "core-components",
      label: "Core Components",
      desc: "Three.js 核心组件：场景、相机、渲染器等",
      category: "基础组件",
      subDemos: [
        {
          key: "scene",
          label: "Scene（场景）",
          desc: "所有物体的容器，管理3D世界中的所有对象",
        },
        {
          key: "camera",
          label: "Camera（相机）",
          desc: "透视相机（PerspectiveCamera）和正交相机（OrthographicCamera）",
        },
        {
          key: "renderer",
          label: "Renderer（渲染器）",
          desc: "WebGLRenderer 是核心渲染引擎",
        },
        {
          key: "geometry",
          label: "Geometry（几何体）",
          desc: "BoxGeometry、SphereGeometry、CylinderGeometry 等",
        },
        {
          key: "material",
          label: "Material（材质）",
          desc: "MeshBasicMaterial、MeshPhongMaterial、MeshStandardMaterial 等",
        },
      ],
      Cmp: CoreComponents as React.ComponentType<DemoComponentProps>,
    },
    {
      key: "lighting",
      label: "Lighting",
      desc: "光照系统：环境光、平行光、点光源等",
      category: "光照系统",
      subDemos: [
        {
          key: "ambient-light",
          label: "Ambient Light（环境光）",
          desc: "提供均匀的环境光照",
        },
        {
          key: "directional-light",
          label: "Directional Light（平行光）",
          desc: "模拟太阳光，方向性光照",
        },
        {
          key: "point-light",
          label: "Point Light（点光源）",
          desc: "从一个点向所有方向发射光线",
        },
        {
          key: "spot-light",
          label: "Spot Light（聚光灯）",
          desc: "锥形光束，类似手电筒效果",
        },
      ],
    },
    {
      key: "animation",
      label: "Animation",
      desc: "动画系统：使用 requestAnimationFrame 或 THREE.Clock 控制动画",
      category: "动画系统",
      subDemos: [
        {
          key: "rotation",
          label: "Rotation（旋转）",
          desc: "物体的旋转动画",
        },
        {
          key: "translation",
          label: "Translation（平移）",
          desc: "物体的移动动画",
        },
        {
          key: "scale",
          label: "Scale（缩放）",
          desc: "物体的缩放动画",
        },
      ],
    },
    {
      key: "interaction",
      label: "Interaction",
      desc: "交互系统：通过 Raycaster 实现物体点击、拖拽",
      category: "交互系统",
      subDemos: [
        {
          key: "raycasting",
          label: "Raycasting（射线检测）",
          desc: "鼠标点击检测物体",
        },
        {
          key: "drag-controls",
          label: "Drag Controls（拖拽控制）",
          desc: "物体拖拽功能",
        },
      ],
    },
    {
      key: "texture",
      label: "Texture",
      desc: "纹理系统：应用贴图、法线贴图、环境贴图等",
      category: "纹理材质",
      subDemos: [
        {
          key: "basic-texture",
          label: "Basic Texture（基础纹理）",
          desc: "简单的图片纹理应用",
        },
        {
          key: "normal-map",
          label: "Normal Map（法线贴图）",
          desc: "增加表面细节的法线贴图",
        },
        {
          key: "environment-map",
          label: "Environment Map（环境贴图）",
          desc: "反射和折射环境贴图",
        },
      ],
    },
    {
      key: "particles",
      label: "Particle System",
      desc: "粒子系统：创建雪、火焰等特效",
      category: "特效系统",
      subDemos: [
        {
          key: "basic-particles",
          label: "Basic Particles（基础粒子）",
          desc: "简单的粒子效果",
        },
        {
          key: "fire-effect",
          label: "Fire Effect（火焰效果）",
          desc: "模拟火焰的粒子系统",
        },
        {
          key: "snow-effect",
          label: "Snow Effect（雪花效果）",
          desc: "模拟雪花的粒子系统",
        },
      ],
    },
    {
      key: "models",
      label: "Loading Model",
      desc: "模型加载：使用 GLTFLoader 导入 3D 模型",
      category: "模型加载",
      subDemos: [
        {
          key: "gltf-loader",
          label: "GLTF Loader",
          desc: "加载 GLTF/GLB 格式的3D模型",
        },
        {
          key: "obj-loader",
          label: "OBJ Loader",
          desc: "加载 OBJ 格式的3D模型",
        },
      ],
    },
    {
      key: "shaders",
      label: "Shaders",
      desc: "着色器：学习 GLSL 语言，编写自定义着色器",
      category: "高级渲染",
      subDemos: [
        {
          key: "vertex-shader",
          label: "Vertex Shader（顶点着色器）",
          desc: "处理顶点位置和属性",
        },
        {
          key: "fragment-shader",
          label: "Fragment Shader（片段着色器）",
          desc: "处理像素颜色和效果",
        },
        {
          key: "custom-material",
          label: "Custom Material（自定义材质）",
          desc: "创建自定义的着色器材质",
        },
      ],
    },
    {
      key: "physics",
      label: "Physics Engine",
      desc: "物理引擎：集成 Cannon.js 或 Ammo.js 实现碰撞检测",
      category: "物理系统",
      subDemos: [
        {
          key: "gravity",
          label: "Gravity（重力）",
          desc: "实现重力效果",
        },
        {
          key: "collision",
          label: "Collision（碰撞）",
          desc: "物体间的碰撞检测",
        },
      ],
    },
    {
      key: "post-processing",
      label: "Post Processing",
      desc: "后期处理：使用 EffectComposer 添加特效",
      category: "后期处理",
      subDemos: [
        {
          key: "bloom",
          label: "Bloom（辉光）",
          desc: "添加辉光效果",
        },
        {
          key: "depth-of-field",
          label: "Depth of Field（景深）",
          desc: "景深模糊效果",
        },
        {
          key: "ssao",
          label: "SSAO（环境光遮蔽）",
          desc: "环境光遮蔽效果",
        },
      ],
    },
  ];

  const selectedDemo = demos.find((demo) => demo.key === selectedMainDemo);
  const hasSubDemos =
    selectedDemo?.subDemos && selectedDemo.subDemos.length > 0;
  const selectedSubDemoData = selectedDemo?.subDemos?.find(
    (sub) => sub.key === selectedSubDemo
  );

  const handleMainDemoChange = (value: string) => {
    const demo = demos.find((d) => d.key === value);
    if (demo?.subDemos && demo.subDemos.length > 0) {
      // 如果有子菜单，切换到子菜单并默认选中第一个
      setSelectedMainDemo(value);
      setSelectedSubDemo(demo.subDemos[0].key);
      setIsInSubMenu(true);
    } else {
      // 如果没有子菜单，直接显示主demo
      setSelectedMainDemo(value);
      setSelectedSubDemo(null);
      setIsInSubMenu(false);
    }
  };

  const handleSubDemoChange = (value: string) => {
    setSelectedSubDemo(value);
  };

  const handleBack = () => {
    setIsInSubMenu(false);
    setSelectedSubDemo(null);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <ThreeHeader />
      <Separator />

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="w-80 flex-shrink-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {!isInSubMenu ? (
              <motion.div
                key="main-list"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 400, damping: 40 },
                  opacity: { duration: 0.15 },
                }}
                className="w-full"
              >
                <ThreeMainList
                  demos={demos}
                  selected={selectedMainDemo}
                  onSelect={handleMainDemoChange}
                />
              </motion.div>
            ) : (
              <motion.div
                key="sub-list"
                custom={-1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 400, damping: 40 },
                  opacity: { duration: 0.15 },
                }}
                className="w-full"
              >
                <ThreeSubList
                  subDemos={selectedDemo?.subDemos || []}
                  selected={selectedSubDemo || ""}
                  onSelect={handleSubDemoChange}
                  onBack={handleBack}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1">
          <ThreeDemoPanel
            mainDemo={selectedDemo!}
            subDemo={selectedSubDemoData}
          />
        </div>
      </div>
    </div>
  );
};

export default ThreePage;
