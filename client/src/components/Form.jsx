import React, { useEffect, useState, useRef } from "react";
import * as common from  './../common.js';


const initialState = {
    name: '',
    artist: {id:0,name:''},
    album:''
}

const Form = props => {
    const {dbObj} = props;
    const formRef = useRef();
    
    const [
      { name, artist, album},
      setState
    ] = useState(initialState);
    
    const clearState = () => {
      setState({ ...initialState });
    };

    const updateStateVar = (name,value) => {
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit =(e)=>{
        console.log(e.nativeEvent);
        e.preventDefault() 
        return false;//todo remove
        // if (!e.target.reportValidity() || artist.id === 0) return;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                artist_id: artist.id,
                album_id: album
            })
        };
        fetch('/api/' + {dbObj}, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                clearState();
            }).catch(err => {
                console.log('error!', err);
            });
    }


    return (
        <>
        <p>I will be a form</p>
        <form id="handleCRUD" ref={formRef} onSubmit={handleSubmit}>
        {/*
        <div className="formGroup">
            <label htmlFor="name">Name</label>
            <input autoComplete="off" autoFocus  
                    name="name" placeholder='Enter song name...' 
                    value={name}
                    onChange={(e)=>{updateStateVar('name', e.target.value)}}
                // onChange={(e) => setName(e.target.value)}
                required/>
        </div>
        */}
        </form>
        </>
    )
}


export default Form;
