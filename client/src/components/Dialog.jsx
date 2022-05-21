import React, { useEffect, useState, useRef } from "react";
import * as common from  './../common.js';
import Form from './Form'

const Dialog = (props) => {
    const {id, actionType, 
            recordId, reRender,
            recordData, dbObj
        } = props;
    
    const isInitialMount = useRef(true);
    useEffect(()=>{
        if (isInitialMount.current) {
          isInitialMount.current = false;
        } else {
            toggleModal(true);
        }
      },[actionType, recordId, reRender, (recordId != 0 && actionType != '')]
      );
      const toggleModal = (modalOpen) => {
        const modal = document.getElementById(id);
        if (modalOpen) {
            modal.showModal();
            modal.addEventListener('click', (event) => {
                const rect = modal.getBoundingClientRect();
                const isInModal=(rect.top <= event.clientY && 
                                event.clientY <= rect.top + rect.height &&
                                rect.left <= event.clientX && 
                                event.clientX <= rect.left + rect.width
                                );
                if (!isInModal) {
                    modal.close();
                }
            });
        } else {
            modal.close();
        }
    }
    return (
      <div className="Dialog">
        <dialog id={id}>
        <h2>
            {actionType != 'add' && common.capitalize(actionType) + ' Record'}
            {actionType == 'add' && 'New ' + common.makeSingular(common.capitalize(dbObj))}
        </h2>
            <Form 
                type={actionType}
                dbObj={dbObj}
                recordData={recordData}
                />
        </dialog>
      </div>
    );
  }
  
  export default Dialog;
  