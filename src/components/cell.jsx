import React from "react";

export default function Cell(props){

    const style ={
        width: `${props.value.cellSize}px`,
        height: `${props.value.cellSize}px`
    }
    return <div style={style} className='cell--outer'> 
                 <div className={`cell ${props.value.cell.filled?'cell--full':'cell--empty'}` }
                 style={{backgroundColor: props.value.cell.color} }>
                     </div> 
           </div>
}