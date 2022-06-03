import React from "react";

export default function Info(props){

    const style ={
        width: `${props.width}px`,
        height: `${80}px`
    }
    return <div style={style} className='cell--outer'> 
            <h1>{props.score}</h1>
           </div>
}