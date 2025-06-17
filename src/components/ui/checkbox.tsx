import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, checked, onCheckedChange, ...props }, ref) => {
        const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            onCheckedChange?.(!checked);
        };

        return (
            <div className="relative" onClick={handleClick}>
                <input
                    type="checkbox"
                    className="peer sr-only"
                    ref={ref}
                    checked={checked}
                    onChange={(e) => onCheckedChange?.(e.target.checked)}
                    {...props}
                />
                <div
                    className={cn(
                        "h-4 w-4 rounded border border-gray-400 transition-colors cursor-pointer",
                        "peer-checked:border-primary peer-checked:bg-primary",
                        "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40",
                        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                        "justify-center items-center flex",
                        className
                    )}
                >
                    {checked && (
                        <Check className="h-3 w-3 text-white" />
                    )}
                </div>
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";

export { Checkbox }; 