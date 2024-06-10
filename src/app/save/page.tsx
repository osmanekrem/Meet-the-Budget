import DataGrid from "@/components/data-grid";
import React from "react";
import { Suspense } from "react";
export default function SummaryPage() {
  return (
    <Suspense>
      <DataGrid />
    </Suspense>
  );
}
