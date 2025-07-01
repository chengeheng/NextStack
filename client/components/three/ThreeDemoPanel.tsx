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
    <div className="flex flex-col">
      {DemoCmp ? (
        <div className="flex-1 min-h-0">
          <DemoCmp label={label} desc={desc} />
        </div>
      ) : (
        <Card className="flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle>{label}</CardTitle>
            <CardDescription>{desc}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 min-h-0">
            <div className="p-6">
              <div className="flex items-center justify-center text-muted-foreground">
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
