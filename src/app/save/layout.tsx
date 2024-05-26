import React, { ReactNode } from "react";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import Navigation from "@/components/navigation";

type Props = {
  children: ReactNode;
};
export default function SavePage({ children }: Props) {
  return (
    <MaxWidthWrapper className="mb-12 mt-28 flex flex-col items-center justify-center text-center">
      <h1 className="max-w-4xl text-5xl tracking-tight w-fit text-balance !leading-tight font-bold md:text-6xl lg:text-7xl">
        Start Saving <span className="bg-primary px-2">Today</span>
      </h1>
      <p className="max-w-prose text-zinc-700 mt-5 sm:text-lg">
        Track Your Expenses, Increase Your Savings
      </p>

      <section className="mt-8 grid gap-5 w-full mx-auto max-w-screen overflow-hidden">
        <Navigation />
        {children}
      </section>
    </MaxWidthWrapper>
  );
}
