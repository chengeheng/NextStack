"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Fragment, useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BoxGeometry from "./BoxGeometry";
import CircleGeometry from "./CircleGeometry";

const renderTypes = [
  {
    label: "basic",
    key: "basic",
    demos: [
      {
        label: "BoxGeometry",
        key: "boxGeometry",
        component: BoxGeometry,
      },
      {
        label: "CircleGeometry",
        key: "circleGeometry",
        component: CircleGeometry,
      },
    ],
  },
];
const CoreComponents = ({ label, desc }: { label: string; desc: string }) => {
  const [selectedDemo, setSelectedDemo] = useState<string>("boxGeometry");

  const currentRenderDemo = useMemo(() => {
    return renderTypes
      .find((type) => type.demos.some((demo) => demo.key === selectedDemo))
      ?.demos.find((demo) => demo.key === selectedDemo);
  }, [selectedDemo]);

  const handleSelectChange = (value: string) => {
    console.log("select: ", value);
    setSelectedDemo(value);
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>{label}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-6 flex flex-col gap-6 min-h-0">
        <div className="flex-shrink-0">
          <Select
            onValueChange={handleSelectChange}
            defaultValue={selectedDemo}
          >
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
        </div>
        <div className="flex-1 min-h-0">
          {currentRenderDemo?.component && <currentRenderDemo.component />}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoreComponents;
