import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface MaxWidthWrapperProps {
  className?: string;
  children: ReactNode;
}

const MaxWidthWrapper: FC<MaxWidthWrapperProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        className,
        "mx-auto w-full max-w-screen-xl px-2.5 md:px-20"
      )}
    >
      {children}
    </div>
  );
};
export default MaxWidthWrapper;
