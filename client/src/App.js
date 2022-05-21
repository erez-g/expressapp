import React from 'react';
import {Outlet} from 'react-router-dom';
import './App.css';
import Table from './components/Table.jsx';

const App = ()=> {
  
  const createSong = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'React POST Request Example',
        artist_id:1,
        album_id: 1
      })
  };
  fetch('/api/songs', requestOptions)
  // fetch('/api/songs')
      .then(response => response.json())
      .then(data => console.log(data));
  }
  
  return (
    <>
      <h1>Main View</h1>
      <Table/>
      
      {/* <h1>Songs</h1>
      <button onClick={createSong}>create song</button> */}
      
   </>
  );
}


export default App;
