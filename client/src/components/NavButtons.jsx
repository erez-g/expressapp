import React, {useState, useEffect} from 'react'
export const NavButtons = ({...props}) => {
    const {back,forward,bubbleUp} = props;

    return (
      <>
    <div className="navButtons">
        <button className="navBtn" id="back" disabled={!back} onClick={bubbleUp}>
            &lt;
        </button>
        <button className="navBtn" id="forward" disabled={!forward} onClick={bubbleUp}>
            &gt;
        </button>
    </div>   
    </>
  )
}


export default NavButtons;