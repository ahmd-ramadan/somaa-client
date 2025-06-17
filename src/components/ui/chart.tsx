import { ReactNode } from "react"

export type ChartConfig = {
  [key: string]: {
    label: string
    color?: string
  }
}

interface ChartContainerProps {
  children: ReactNode
  config: ChartConfig
  className?: string
}

export function ChartContainer({
  children,
  config,
  className,
}: ChartContainerProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
} 