import React, {useState, useEffect} from 'react'
import './Table.css';
import NavButtons from './NavButtons';
import Dialog from './Dialog';
export const Table = ({...props}) => {
    const [dbObject,setDbObject] = useState('songs');
    const [records,setRecords] = useState([]);
    const [recordsCount,setRecordsCount] = useState(0);
    const [tableHeaders,setTableHeaders] = useState([]);
    const [limit,setLimit] = useState(10);
    const [offset,setOffset] = useState(0);
    const [searchTerm,setSearchTerm] = useState('');
    const [sortField,setSortField] = useState('');
    const [sortDir,setSortDir] = useState('ASC');
    const [recordId,setRecordId] = useState('');
    const [actionType,setActionType] = useState('');
    const [dialogToggle, setDialogToggle] = useState(false);
    const [recordToHandle,setRecordToHandle] = useState({});

    const useEffectDependencies = [dbObject,
                                    limit,
                                    offset,
                                    sortField,
                                    sortDir,
                                    (searchTerm != '' && 
                                        searchTerm.length>=3
                                    )
                                ];

    useEffect(()=>{
        fetch('/api/' + dbObject + '?' +  new URLSearchParams({
            limit:+limit,
            offset: +offset,
            sortField: sortField,
            sortDir: sortDir.toUpperCase(),
            searchTerm: searchTerm
            // fields:'id,name,album_id'
        })
        ).then(response => {
            return response.json()
            .then(({result}) => {
                setRecords(result.rows);
                setRecordsCount(result.count);
                if (result.rows.length) {
                    setTableHeaders(Object.keys(result.rows[0]));
                }
            });
        });
    }, useEffectDependencies)


    const getColumnName =(input)=> {
        switch(input) {
        case 'name':
            return 'Name';
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

    const handleObjectChoice = e => {
        setOffset(0);
        setDbObject(e.target.id.toLowerCase());
    }

    
    const handleRowAction = e => {
        const recordId = e.target.closest('tr').id;
        setRecordId(recordId);
        setActionType(e.target.dataset.action);
        setRecordToHandle(records.find(obj => obj.id.toString() === recordId))
        setDialogToggle(!dialogToggle);
    }

    const prepareNewRecord = e => {
        setActionType('add');
        setDialogToggle(!dialogToggle);
    }

    if (!records) return;
    const limitOptions = [10,25,50].filter((item)=>{
        return item <= recordsCount;
    });


    return (
      <>
   <div className="tableWrapper">
   <div id="tableControls">
       <input name="textInput"
            value={searchTerm} placeholder="search..." 
            onChange={e=>{setSearchTerm(e.target.value)}}/>
           <div id="sortContainer">
               <label htmlFor="sortType">Sort </label>
               {dbObject !== 'artists' &&
               <>
               <label htmlFor="sortType">By</label>
                <select value={sortField} onChange={e=>{setSortField(e.target.value)}} name="sortType">
                    <option value="" disabled>Select one...</option>
                    <option value="artist">Artist</option>
                    <option value="album">Album</option>
                    {dbObject === 'songs' && 
                        <option value="song">Song Name</option>
                    }
                </select>
                </>
                }
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
                    {limitOptions.map((item,index)=>{
                        return <option key={index} value={item}>{item}</option>
                    })
                    }
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
    <div id="tableTopButtons">
        <div id="objectChoiceContainer">
            {['Songs','Albums','Artists'].map((item,index)=>{
                const activeState = (item.toLowerCase() === dbObject) ? 'active' : '';
                    return <button key={index} id={item} 
                                onClick={handleObjectChoice}
                                className={"objectChoice " + activeState}>
                                {item}
                            </button>
                })
            }
        </div>
            <div className="actions" id="addRecordContainer">
                <button data-action="add" 
                    title="add"
                    onClick={prepareNewRecord}>
                    + Add new record
                </button>
            </div>
    </div>
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
        <th id="actions-col"></th>
        
    
    </tr>
    </thead>
    <tbody>
    {records.map((item,i)=>{
    return <tr key={item.id}
            id={item.id}
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
        <td className="actions">
            <button data-action="edit" 
                    title="edit"
                    onClick={handleRowAction}>
                📝
            </button>
            <button data-action="delete" 
                    title="delete"
                    onClick={handleRowAction}>
                ❌
            </button>
        </td>
        </tr>
    })}
    
    </tbody>
    </table>
    <Dialog id='userActionsModal'
            recordId={recordId} 
            actionType={actionType}
            reRender={dialogToggle}
            recordData={recordToHandle}
            dbObj={dbObject}
    />
    </div>   
    </>
  )
}
// Table.defaultProps = {
//     colNames: [],
//     records:[]
//   }

export default Table;