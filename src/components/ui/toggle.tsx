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

    return (
        <div className={`${properties.size[size].toggle}  rounded-full  ${properties.state[state]}  ${state === 'on' ? properties.color[color] : 'bg-toggle-color-neutral-default' }`}>
            <div className={`${properties.size[size].frame} bg-white rounded-full`}></div>
        </div>
    )
}

export { Toggle}
