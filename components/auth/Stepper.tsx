import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepperProps {
    steps: string[]
    currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const stepNumber = index + 1
                    const isCompleted = stepNumber < currentStep
                    const isCurrent = stepNumber === currentStep
                    const isUpcoming = stepNumber > currentStep

                    return (
                        <div key={index} className="flex items-center flex-1">
                            {/* Step Circle */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300",
                                        isCompleted && "bg-primary text-primary-foreground",
                                        isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                                        isUpcoming && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <span>{stepNumber}</span>
                                    )}
                                </div>
                                <p
                                    className={cn(
                                        "text-xs mt-2 text-center hidden sm:block",
                                        isCurrent && "font-semibold text-foreground",
                                        !isCurrent && "text-muted-foreground"
                                    )}
                                >
                                    {step}
                                </p>
                            </div>

                            {/* Connecting Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        "h-0.5 flex-1 mx-2 transition-all duration-300",
                                        stepNumber < currentStep ? "bg-primary" : "bg-muted"
                                    )}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
