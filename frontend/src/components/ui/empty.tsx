import * as React from "react"
import { cn } from "@/utils/utils"

interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, icon, title, description, action, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-4",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
      {children}
    </div>
  )
)
Empty.displayName = "Empty"

export { Empty }
