import MaxWidthWrapper from "@/components/max-width-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center w-full h-full">
      <h2 className="max-w-4xl text-5xl mt-3 tracking-tight w-fit text-balance !leading-tight font-bold md:text-6xl lg:text-7xl">
        404 Not Found
      </h2>
      <p className="max-w-prose text-zinc-700 sm:text-lg mt-5">
        Could not find requested resource
      </p>
      <Link
        className={buttonVariants({ size: "lg", className: "mt-5" })}
        href="/"
      >
        Return Home
        <HomeIcon className="size-5 ml-2" /> 
      </Link>
    </MaxWidthWrapper>
  );
}
