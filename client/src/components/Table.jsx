import React, {useState, useEffect} from 'react'
import './Table.css'
import NavButtons from './NavButtons';
export const Table = ({...props}) => {

    const [records,setRecords] = useState([]);
    const [recordsCount,setRecordsCount] = useState(0);
    const [tableHeaders,setTableHeaders] = useState([]);
    const [limit,setLimit] = useState(10);
    const [offset,setOffset] = useState(0);
    const [searchTerm,setSearchTerm] = useState('');
    const [sortField,setSortField] = useState('');
    const [sortDir,setSortDir] = useState('ASC');

    const useEffectDependencies = [limit,
                                    offset,
                                    sortField,
                                    sortDir,
                                    (searchTerm != '' && 
                                        searchTerm.length>=3
                                    )
                                ];
    useEffect(() => {
        fetch('/api/songs?' +  new URLSearchParams({
            limit:limit,
            offset: offset,
            sortField: sortField,
            sortDir: sortDir.toUpperCase(),
            searchTerm: searchTerm
            // fields:'id,name,album_id'
        })
        ).then(response => {
            return response.json()
            .then(data => {
                setRecords(data.rows);
                setRecordsCount(data.count);
                if (data.rows.length) {
                    setTableHeaders(Object.keys(data.rows[0]));
                }
            });
        });
    }, useEffectDependencies)

    const getColumnName =(input)=> {
        switch(input) {
        case 'name':
            return 'Song Name';
        case 'artist_name':
            return 'Artist';
        case 'album_name':
            return 'Album';
        case 'id':
            return 'Id';
        default:  
            return input;
        }
    }

    const handleNavButton = e => {
        const direction = e.target.id;
        setOffset(()=>{
            return direction === 'forward' ?
            +offset+limit :
            +offset-limit
        });
    }

    if (!records) return;

    return (
      <>
   <div className="tableWrapper">
   <div id="tableControls">
       <input name="textInput"
            value={searchTerm} placeholder="search..." 
            onChange={e=>{setSearchTerm(e.target.value)}}/>
           <div id="sortContainer">
               <label htmlFor="sortType">Sort By</label>
                <select value={sortField} onChange={e=>{setSortField(e.target.value)}} name="sortType">
                    <option value="" disabled>Select one...</option>
                    <option value="artist">Artist</option>
                    <option value="album">Album</option>
                    <option value="song">Song Name</option>
                </select>
                <select name="sortDir" value={sortDir} onChange={e=>{
                    setOffset(0);
                    setSortDir(e.target.value)}
                    }>
                    <option value="asc">A-Z</option>
                    <option value="desc">Z-A</option>
                </select>
            </div>
            <div id="limitContainer">
                <label htmlFor="limit">Show </label>
                <select name="limit" value={limit} onChange={e=>{
                    setOffset(0);
                    setLimit(+(e.target.value));
                    // debugger;
                    if (+e.target.value == 0) {
                        setLimit(recordsCount);
                    } 
                    
                }}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value={recordsCount}>All</option>
                </select>
                <label htmlFor="limit"> records</label>
            </div>
        <NavButtons 
            back={(offset > 0)}
            forward={((+offset+limit) < recordsCount )}
            bubbleUp={handleNavButton}
        />
   </div>
    <p className="recordCount">
        displaying records {+offset+1}-
        {+(offset+limit) >= recordsCount ? 
            +recordsCount : +(offset+limit)} 
        {' of'} {recordsCount} records
    </p>
    <table className="dataView">
    <thead>
        <tr>
        {tableHeaders.map((item,i)=>{
            if (!['artist_id','album_id'].includes(item)) {
                return <th key={i}>
                    {getColumnName(item)}
                    </th>
            }
        })}
        
    
    </tr>
    </thead>
    <tbody>
    {records.map((item,i)=>{
    return <tr key={item.id}
            data-artist={item.artist_id}
            data-album={item.album_id}
            >
                
        {tableHeaders.map((key,index)=>{
            if (!['artist_id','album_id'].includes(key)) {
                return <td key={index}>
                        {item[key]}
                </td>
            }
        })}
        
        </tr>
    })}
    </tbody>
    </table>
    </div>   
    </>
  )
}
// Table.defaultProps = {
//     colNames: [],
//     records:[]
//   }

export default Table;