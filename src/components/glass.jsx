import React from 'react'
import Row from './row'

export default function Glass (props){
    const glass = props.value.glass;
    const rowsCount = glass.length;
    const colsCount = glass[0].length;
    let cellSize = Math.min(props.value.maxWidth / colsCount, props.value.maxHight / rowsCount);
    cellSize = Math.floor(cellSize);
    const rowValue = {cellSize: cellSize}

    const rows = glass.map(row=> <Row key={row.id} value={{...rowValue, row:row}}/>)


    const style={width: `${cellSize * colsCount }px`,
           height: `${cellSize * rowsCount}px`}
    return <div className='glass' style={style}>
            {rows}
           </div>
}