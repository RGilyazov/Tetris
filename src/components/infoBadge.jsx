import React from "react";

export default function Info(props){ 
    const message = `${props.description}:${props.value}`
    const fontSize = props.width /  message.length;
    return <div className='infoBadge' style={{fontSize: fontSize}}>
                {message}
           </div>
}