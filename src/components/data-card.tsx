import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type Props = {
  title: string;
  subTitle?: string;
  children: ReactNode
};

export default function DataCard({ title, subTitle, children }: Props) {
  return (
    <Card className="text-left">
      <CardHeader>
        <CardTitle className="text-xl line-clamp-1">{title}</CardTitle>
        <CardDescription>{subTitle}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
