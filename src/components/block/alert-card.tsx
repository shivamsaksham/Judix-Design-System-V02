import React, { useState } from 'react'
import { Icon } from 'judix-icon';
const AlertCard = ()=>{
    return(
    <div
        className=''
    >
            This project is no longer associated with your profile. Request the admin to share.
            <button
                style={{
                    background : 'var(--primitives-color-primary-200)',
                    color : 
                }}
                >
                Request access
            </button>

    </div>
    
    );
}

export default AlertCard