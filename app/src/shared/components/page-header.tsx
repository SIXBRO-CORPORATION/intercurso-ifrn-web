import { cn } from "cn"

type PageHeaderProps = {
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <header className={cn("space-y-1", className)}>
      <h1 className="type-large-title text-ink">{title}</h1>
      {description && <p className="type-body text-muted-foreground">{description}</p>}
    </header>
  )
}
