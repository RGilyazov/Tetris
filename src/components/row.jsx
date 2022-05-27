import React from "react";
import Cell from "./cell";

export default function Row(props){
    const cells = props.value.row.map((cell,index) =><Cell key={index} value={{cellSize:props.value.cellSize, cell:cell}} />)

    return <div className="row"> {cells} </div>
}