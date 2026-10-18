import { useRouteError, isRouteErrorResponse, Link } from "react-router"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export function RouteErrorBoundary() {
  const error = useRouteError()

  let errorMessage = "An unexpected error occurred."
  let errorStatus = 500

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status
    errorMessage = error.statusText || error.data?.message || errorMessage
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === "string") {
    errorMessage = error
  } else if (error && typeof error === "object" && "message" in error) {
    errorMessage = String((error as any).message)
  }

  return (
    <div className="relative min-h-[70vh] w-full flex items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[450px] rounded-full bg-destructive/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-inner">
          <AlertTriangle className="size-8 animate-pulse" />
        </div>

        <span className="mb-2 text-xs font-semibold tracking-wider uppercase text-destructive">
          Error {errorStatus}
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
          Something went wrong
        </h1>

        <p className="text-sm text-muted-foreground mb-6 max-w-sm line-clamp-3">
          {errorMessage}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <Button
            variant="outline"
            className="rounded-full gap-2 text-xs"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="size-3.5" />
            Reload Page
          </Button>

          <Button asChild className="rounded-full gap-2 text-xs">
            <Link to="/">
              <Home className="size-3.5" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RouteErrorBoundary
