import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FirstDemoPage from "@/components/client/three/firstDemo";
import CoreComponents from "@/components/client/three/coreComponents";

type DemoComponentProps = {
  label: string;
  desc: string;
};
const Main = () => {
  const demos = [
    {
      key: "First Demo",
      label: "First Demo",
      desc: "第一个 Three.js 示例，创建一个简单的立方体。",
      Cmp: FirstDemoPage as React.ComponentType<DemoComponentProps>,
    },
    {
      key: "Core Components",
      label: "Core Components",
      desc: `
        场景（Scene）：所有物体的容器。
        相机（Camera）：透视相机（PerspectiveCamera）和正交相机（OrthographicCamera）。
        渲染器（Renderer）：WebGLRenderer 是核心。
      `,
      Cmp: CoreComponents as React.ComponentType<DemoComponentProps>,
    },
    {
      key: "Light",
      label: "Light",
      desc: "环境光（AmbientLight）、平行光（DirectionalLight）、点光源（PointLight）等",
    },
    {
      key: "Animation",
      label: "Animation",
      desc: "使用 requestAnimationFrame 或 THREE.Clock 控制动画。",
    },
    {
      key: "Interaction",
      label: "Interaction",
      desc: "通过 Raycaster 实现物体点击、拖拽。",
    },
    {
      key: "Texture",
      label: "Texture",
      desc: "应用贴图、法线贴图、环境贴图等。",
    },
    {
      key: "Points",
      label: "Points",
      desc: "用 Points 创建雪、火焰等效果。",
    },
    {
      key: "Loading Model",
      label: "Loading Model",
      desc: "使用 GLTFLoader 导入 3D 模型（如 Blender 导出的 .gltf 文件）。",
    },
    {
      key: "Particle System",
      label: "Particle System",
      desc: "学习 GLSL 语言，编写自定义着色器（ShaderMaterial 或 RawShaderMaterial）。实现高级效果：水面波纹、溶解动画等。",
    },
    {
      key: "Shaders",
      label: "Shaders",
      desc: "合并几何体（BufferGeometryUtils.mergeBufferGeometries）。使用实例化渲染（InstancedMesh）。减少实时阴影计算（如预烘焙阴影）。",
    },
    {
      key: "Physics Engine",
      label: "Physics Engine",
      desc: "集成 Cannon.js 或 Ammo.js 实现碰撞检测",
    },
    {
      key: "Post Processing",
      label: "Post Processing",
      desc: "使用 EffectComposer 添加辉光（Bloom）、景深（Depth of Field）等特效。",
    },
  ];

  return (
    <Tabs defaultValue="First Demo" className="w-full h-full">
      <TabsList>
        {demos
          .filter((i) => i.Cmp)
          .map((demo) => (
            <TabsTrigger key={demo.key} value={demo.key}>
              {demo.label}
            </TabsTrigger>
          ))}
      </TabsList>
      {demos.map((demo) => {
        const { Cmp } = demo;
        return (
          <TabsContent key={demo.key} value={demo.key} className="w-full">
            <div className="w-full h-full">
              {Cmp ? <Cmp label={demo.label} desc={demo.desc} /> : ""}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default Main;
