"use client"
import React from 'react'

interface ToggleProps {
    size?: 'small' | 'medium' | 'large';
    state?: 'on' | 'off';
    color?: 'neutral' | 'primary';
}

function Toggle({
    size = "medium",
    state = "on",
    color = "primary", 
}: ToggleProps) {
    const properties = {
        size:{
            small:{
                toggle: "w-8 h-4",
                frame: "w-3.5 h-3.5",
            },
            medium:{
                toggle: "w-10 h-5",
                frame: "w-4.5 h-4.5",
            },
            large:{
                toggle: "w-12 h-6",
                frame: "w-5.5 h-5.5",
            }
        },
        state:{
            on:"flex items-center justify-end pt-[1px] pr-[1px]",
            off: "flex items-center justify-start pl-[1px] pt-[1px] "
        },
        color:{
            neutral: "bg-toggle-color-neutral-selected",
            primary: "bg-toggle-color-primary-selected",
        }
    }

    const [toggleState, setToggleState] = React.useState(state);

    const changeToggle = () => {
        setToggleState(toggleState === 'on' ? 'off' : 'on');
    }

    

    return (
        <div className={`${properties.size[size].toggle}  rounded-full  ${properties.state[toggleState]}  ${toggleState === 'on' ? properties.color[color] : 'bg-toggle-color-neutral-default' }`} onClick={changeToggle}>
            <div className={`${properties.size[size].frame} bg-white rounded-full`}></div>
        </div>
    )
}

export { Toggle}


// "use client"

// import * as React from "react"
// import * as SwitchPrimitive from "@radix-ui/react-switch"

// import { cn } from "@/lib/utils"

// function Switch({

//   className,
//   ...props
// }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
//   return (
//     <SwitchPrimitive.Root
//       data-slot="switch"
//       className={cn(
//         "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
//         className
//       )}
//       {...props}
//     >
//       <SwitchPrimitive.Thumb
//         data-slot="switch-thumb"
//         className={cn(
//           "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
//         )}
//       />
//     </SwitchPrimitive.Root>
//   )
// }

// export { Switch }
