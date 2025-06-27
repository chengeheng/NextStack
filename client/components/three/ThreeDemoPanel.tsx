import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type DemoComponentProps = { label: string; desc: string };

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
  Cmp?: React.ComponentType<DemoComponentProps>;
  subDemos?: SubDemo[];
};

type Props = {
  mainDemo: MainDemo;
  subDemo?: SubDemo;
};

const ThreeDemoPanel = ({ mainDemo, subDemo }: Props) => {
  const DemoCmp = subDemo?.Cmp || mainDemo.Cmp;
  const label = subDemo?.label || mainDemo.label;
  const desc = subDemo?.desc || mainDemo.desc;

  return (
    <div className="h-full">
      {DemoCmp ? (
        <DemoCmp label={label} desc={desc} />
      ) : (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{label}</CardTitle>
            <CardDescription>{desc}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div className="h-full p-6">
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {label} 的演示示例将在这里显示
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
export default ThreeDemoPanel;
