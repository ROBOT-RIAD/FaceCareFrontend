import { Link, useNavigate } from "react-router"
import { Home, ArrowLeft } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="relative min-h-[60vh] sm:min-h-[70vh] w-full flex items-center justify-center overflow-hidden bg-background px-4 py-8 sm:py-12">
            {/* Decorative Background Glows */}
            <div
                className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px] dark:bg-primary/20"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute -bottom-40 right-10 h-[400px] w-[400px] rounded-full bg-amber-400/10 blur-[100px] dark:bg-amber-400/15"
                aria-hidden="true"
            />

            {/* Main Content Card */}
            <div className="relative z-10 mx-auto max-w-xl text-center">


                {/* Big Stylized 404 */}
                <div className="relative select-none">
                    <h1 className="text-8xl sm:text-[140px] font-extrabold tracking-tighter leading-none bg-gradient-to-b from-foreground via-foreground/80 to-foreground/30 bg-clip-text text-transparent">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-xl text-8xl sm:text-[140px] font-extrabold text-primary pointer-events-none">
                        404
                    </div>
                </div>

                {/* Message */}
                <div className="mt-4 space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">

                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">

                    </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link to="/" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto rounded-full px-6 py-2.5 gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer">
                            <Home className="size-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto rounded-full px-6 py-2.5 gap-2 transition-all active:scale-95 cursor-pointer"
                    >
                        <ArrowLeft className="size-4" />
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    )
}
