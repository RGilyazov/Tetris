import React from 'react'
import Row from './row'
import Info from "./info";
import Message from './message'

export default function Glass (props){
    const glass = props.value.glass;
    const rowsCount = glass.length;
    const colsCount = glass[0].length;
    
    const margin = props.preview ? 0:65;
    
    
    let cellSizeByRows = (props.value.maxHight-margin) / rowsCount;
    let cellSizeByCols =(props.value.maxWidth-margin) / colsCount;

    const direction = cellSizeByRows > cellSizeByCols? 'column':'row';
    const addCols = props.preview || direction ==='column'? 0:3;
    const addRows = props.preview || direction ==='row'? 0:4;
    
    cellSizeByRows = (props.value.maxHight-margin) / (rowsCount + addRows);
    cellSizeByCols =(props.value.maxWidth-margin) / (colsCount + addCols);
    
    let cellSize = Math.min(cellSizeByRows, cellSizeByCols);
    cellSize = Math.floor(cellSize)-1;
    const rowValue = {cellSize: cellSize}

    const rows = glass.map(row=> <Row key={row.id} value={{...rowValue, row:row}}/>)

    
    const style={width: `${cellSize *colsCount }px`,
           height: `${cellSize * rowsCount}px`}    
    
    return <div className={`glass--outer  glass--outer--${direction==='row'?'right': 'bottom'}`} style={{'flexDirection': direction}}>  
               <div className={props.preview?'':'glass--inner'} style={style}>
                     {!props.preview && props.pause && !props.gameOver && <Message message={['PAUSE']}/>}
                     {!props.preview && props.gameOver && 
                         <Message message={['GAME OVER',  `YOUR SCORE ${props.lastScore}`, `SPEED ${props.lastSpeed}`]}/>}
                          
                     {rows}

               </div>
            {!props.preview && <div className={`glass--preview glass--preview--${direction==='row'?'right': 'bottom'}`}  style={{'flexDirection': direction ==='row'?'column':'row'}}>
                                   <Info  width={cellSize*3+10}  score={props.value.score} speed={props.value.speed}></Info>
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