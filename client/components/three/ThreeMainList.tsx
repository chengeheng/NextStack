import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type MainDemo = {
  key: string;
  label: string;
  desc: string;
  category: string;
};

type Props = {
  demos: MainDemo[];
  selected: string;
  onSelect: (key: string) => void;
};

const ThreeMainList = ({ demos, selected, onSelect }: Props) => {
  const handleTabClick = (value: string) => {
    // 无论是否相同，都触发onSelect
    onSelect(value);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>学习分类</CardTitle>
        <CardDescription>选择要学习的 Three.js 主题</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-x-hidden">
        <Tabs
          value={selected}
          onValueChange={onSelect}
          className="w-full h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-1 h-auto flex-col overflow-y-auto">
            {demos.map((demo) => (
              <TabsTrigger
                key={demo.key}
                value={demo.key}
                className="justify-start h-auto p-4 text-left whitespace-normal cursor-pointer"
                onClick={() => handleTabClick(demo.key)}
              >
                <div className="flex flex-col items-start gap-1 w-full min-w-0">
                  <div className="flex items-center gap-2 w-full">
                    <span className="font-medium break-words">
                      {demo.label}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs flex-shrink-0"
                    >
                      {demo.category}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground break-words w-full">
                    {demo.desc}
                  </span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};
export default ThreeMainList;
