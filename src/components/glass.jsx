import React from 'react'
import Row from './row'
import Info from "./info";
import Message from './message'

export default function Glass (props){
    const glass = props.value.glass;
    const rowsCount = glass.length;
    const colsCount = glass[0].length;
    const addCols = props.preview ? 0:3;
    const margin = props.preview ? 0:60;
    
    let cellSize = Math.min((props.value.maxWidth-margin) / (colsCount+addCols), (props.value.maxHight-margin) / rowsCount);
    cellSize = Math.floor(cellSize);
    const rowValue = {cellSize: cellSize}

    const rows = glass.map(row=> <Row key={row.id} value={{...rowValue, row:row}}/>)


    const style={width: `${cellSize *colsCount }px`,
           height: `${cellSize * rowsCount}px`}
    
    return <div className='glass--outer'>  
               <div className={props.preview?'':'glass--inner'} style={style}>
                     {!props.preview && props.pause && !props.gameOver && <Message message={['PAUSE']}/>}
                     {!props.preview && props.gameOver && 
                         <Message message={['GAME OVER',  `YOUR SCORE ${props.lastScore}`, `SPEED ${props.lastSpeed}`]}/>}
                          
                     {rows}

               </div>
            {!props.preview && <div><Info  width={cellSize*3+10} score={props.value.score} speed={props.value.speed}></Info>
               <Glass
          value={{
            glass: props.previewGlass,
            maxWidth: cellSize*3,
            maxHight: cellSize*4,
          }}
          preview={true}
        />
            </div>}
           </div>
}