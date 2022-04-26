import React, {useState, useEffect} from 'react'
import './Table.css'
export const Table = ({...props}) => {

    const [source,setSource] = useState('songs');
    const [records,setRecords] = useState([]);
    const [recordsCount,setRecordsCount] = useState(0);
    const [tableHeaders,setTableHeaders] = useState([]);


    useEffect(() => {
        fetch('/api/songs?' +  new URLSearchParams({
            fields:'id,name,artist_id,album_id'})
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
      }, [0])

      const getColumnName =(input)=> {
          switch(input) {
            case 'name':
                return 'Song Name';
            case 'artist_id':
                return 'Artist Id';
            case 'album_id':
                return 'Album Id';
            case 'id':
                return 'Id';
            default:  
                return input;
          }
      }
    // switch (source) {
    //     default: //songs
    // setRecords(
    // }

    if (!records) return;

    return (
      <>
   <div className="tableWrapper">
    <table className="dataView">
    <thead>
        <tr>
        {tableHeaders.map((item,i)=>{
            return <th key={i}>
                {getColumnName(item)}
                </th>
        })}
        
    
    </tr>
    </thead>
    <tbody>
    {records.map((item,i)=>{
    return <tr key={item.id}>
        {tableHeaders.map((key,index)=>{
            return <td key={index}>
                    {item[key]}
            </td>
        })}
        
        </tr>
    })}
    </tbody>
    </table>
    <p className="recordCount">displaying {recordsCount} records</p>
    </div>   
    </>
  )
}
// Table.defaultProps = {
//     colNames: [],
//     records:[]
//   }

export default Table;