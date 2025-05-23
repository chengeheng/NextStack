import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicPage from "@/components/client/three/basic";
import SecondPage from "@/components/client/three/second";

const Main = ({ children }: { children: React.ReactNode }) => {
  const demos = [
    {
      key: "basic",
      label: "Basic",
      cmp: <BasicPage />,
    },
    {
      key: "second",
      label: "Second",
      cmp: <SecondPage />,
    },
  ];

  return (
    <Tabs defaultValue="basic" className="w-[400px]">
      <TabsList>
        {demos.map((demo) => (
          <TabsTrigger key={demo.key} value={demo.key}>
            {demo.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {demos.map((demo) => (
        <TabsContent key={demo.key} value={demo.key}>
          {demo.cmp}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Main;
