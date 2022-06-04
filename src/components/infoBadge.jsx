import React from "react";

export default function Info(props){


    return <div className='infoBadge'>
                {props.description}:{props.value}
           </div>
}