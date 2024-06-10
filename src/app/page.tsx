import MaxWidthWrapper from "@/components/max-width-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
      <h1 className="max-w-4xl text-5xl tracking-tight w-fit text-balance !leading-tight font-bold md:text-6xl lg:text-7xl">
        Achieve Your <span className="bg-primary px-2">Financial</span> Goals with Ease
      </h1>
      <p className="max-w-prose text-zinc-700 mt-5 sm:text-lg">Monitor your expenses, create a budget, and increase your savings. Meet the Budget helps you achieve both financial freedom and your specific monetary targets!</p>
      <Link href="/save" className={buttonVariants({
        size: "lg",
        className: "mt-5"
      })}>
        Start Saving
        <ArrowRight className="ml-2 size-5" />
      </Link>
    </MaxWidthWrapper>
  );
}
