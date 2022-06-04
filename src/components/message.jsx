import React from "react";

export default function Message(props){
  
 const messages = props.message.map(msg =><div> {msg}</div>)
    return <div className="message"> 
            {messages}
           </div>
}