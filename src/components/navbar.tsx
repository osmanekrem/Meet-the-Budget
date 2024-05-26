import Link from "next/link"
import MaxWidthWrapper from "./max-width-wrapper"
import { ArrowRight } from "lucide-react"
import { buttonVariants } from "./ui/button"

const Navbar = () => {    
  return (
    <nav className="sticky z-[100] top-0 h-14 inset-x-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
        <MaxWidthWrapper>
            <div className="flex h-14 justify-between items-center">
                <Link href="/"><span className="font-bold text-xl md:text-3xl tracking-tighter whitespace-nowrap flex-nowrap">Meet<span className="font-medium text-base md:text-lg">the</span>Budget</span></Link>

                <div className="h-full flex space-x-4 items-center">
                    <Link href="/save" className={buttonVariants({
                        size: "sm",
                        className: "hidden sm:flex items-center gap-1"
                    })} >
                        Start Saving
                        <ArrowRight className="ml-1.5 h-5 w-5" />
                    </Link>
                </div>
            </div>
        </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar