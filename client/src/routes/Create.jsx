import React, { useRef, useState } from 'react';
import Dropdown from '../components/Dropdown';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'



const initialState = {
    name: '',
    artist: {id:0,name:''},
    album:''
}

const Create = () => {
    const formRef = useRef();
    
    const [
      { name, artist, album},
      setState
    ] = useState(initialState);
    
    const clearState = () => {
      setState({ ...initialState });
    };
    // const [name, setName] = useState('');
    // const [artist, setArtist] = useState({id:0,name:''});
    // const [album, setAlbum] = useState('');
    
    const handleSubmit =(e)=>{
        console.log(e.nativeEvent);
        e.preventDefault() 
        if (!e.target.reportValidity() || artist.id === 0) return;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                artist_id: artist.id,
                album_id: album
            })
        };
        fetch('/api/songs', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                clearState();
            }).catch(err => {
                console.log('error!', err);
            });
    }
    const updateStateVar = (name,value) => {
        setState((prevState) => ({ ...prevState, [name]: value }));
      };
      const getVal = (data,field) => {
        switch (field) {
            case 'artist':
                // setArtist(data);
                updateStateVar('artist', data);
                break;
            // case 'album':
                // setAlbum(data.id);
                // break;
            default:
                return;
        }
        console.log('getVal:');
        console.log(data);
        console.log(field);
    }   

    return (
    <>
        <h1>Insert New Song</h1>
        <form id="createNewSong" ref={formRef} onSubmit={handleSubmit}>
            <h2>Enter new record details:</h2>
            <div className="formGroup">
                <label htmlFor="name">Name</label>
                <input autoComplete="off" autoFocus  
                        name="name" placeholder='Enter song name...' 
                        value={name}
                        onChange={(e)=>{updateStateVar('name', e.target.value)}}
                        // onChange={(e) => setName(e.target.value)}
                        required/>
            </div>
            <div className="formGroup">
                <label htmlFor="artistSelect">Artist</label>
                <Dropdown type="artist" externalEffect={getVal}
                        value={artist}
                        className="dropDown selectArtist" 
                        fieldName="artist"
                        required/>
            </div>
                <OverlayTrigger
                        delay={{ hide: 450, show: 300 }}
                        overlay={(props) => (
                        <Tooltip {...props}>
                            just the id for now, no albums table yet
                        </Tooltip>
                        )}
                        placement="bottom">
            <div className="formGroup">
                <label htmlFor="album">Album</label>
                    <input name="album" placeholder='Enter album name...' 
                            onChange={(e)=>{updateStateVar('album', e.target.value)}}
                            // onChange={(e) => setAlbum(e.target.value)}
                            value={album}
                            pattern="[0-9]"
                            required/>
                {/*<Dropdown type="album" disabled={1} externalEffect={getVal}*/}
                        {/* className="dropDown selectAlbum" fieldName="album"/> */}
            </div>
                </OverlayTrigger>,
            <button className="submit" type="submit">Create!</button>
        </form>
    </>
  )
}

export default Create
