import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type SubDemo = {
  key: string;
  label: string;
  desc: string;
};

type Props = {
  subDemos: SubDemo[];
  selected: string;
  onSelect: (key: string) => void;
  onBack: () => void;
};

const ThreeSubList = ({ subDemos, selected, onSelect, onBack }: Props) => (
  <Card className="flex flex-col">
    <CardHeader className="flex flex-row items-center gap-2 flex-shrink-0">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="mr-2 cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <CardTitle>选择具体的示例</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 flex-1 overflow-y-auto">
      {subDemos.map((subDemo) => (
        <Button
          key={subDemo.key}
          variant={selected === subDemo.key ? "default" : "outline"}
          className="w-full justify-start h-auto p-3 text-left whitespace-normal cursor-pointer"
          onClick={() => onSelect(subDemo.key)}
        >
          <div className="flex flex-col items-start gap-1 w-full min-w-0">
            <span className="font-medium break-words w-full">
              {subDemo.label}
            </span>
            <span className="text-xs text-muted-foreground break-words w-full">
              {subDemo.desc}
            </span>
          </div>
        </Button>
      ))}
    </CardContent>
  </Card>
);
export default ThreeSubList;
