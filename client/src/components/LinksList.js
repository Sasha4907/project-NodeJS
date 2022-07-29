import React from "react";
import { Link } from "react-router-dom";

export const LinksList = ({links}) => {
    if (!links.length){
        return <h6 className="center">Посилань немає</h6>
    }
    return(
        
        <table className="highlight">
        <thead>
          <tr>
              <th></th>
              <th>№</th>
              <th>Назва</th>
              <th>Оригінальна адреса</th>
              <th>Перетворена адреса</th>
              <th>Відкрити</th>
          </tr>
        </thead>

        <tbody>
            {links.map((link, index) => {
                return(
                <>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
                    <tr key={link._id}>
                        <td><i className="material-icons">book</i></td>
                        <td>{link.status}</td>
                        <td>{index+1}</td>
                        <td>{link.name}</td>
                        <td>{link.from}</td>
                        <td>{link.to}</td>
                        <td><button className='btn grey lighten-1'><Link to={`/detail/${link._id}`}>Відкрити</Link></button></td>
                    </tr>
                </>
                )
            })}
          
        </tbody>
      </table>
    
)}