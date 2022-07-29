import React from "react";

export const LinkCard = ({link}) => {
    return(
        <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <div className="row">
            <div className="col s10 offset-s1">
            <div className="card amber darken-4">
            <div className="card-content white-text">
                <span className="card-title"><i className="material-icons">attach_file</i> Посилання</span>
                <h6>Назва книжки: <strong>{link.name}</strong></h6>
                <h6>Ваше посилання: <a href={link.to} target="_blank" rel="noopener noreferrer">{link.to}</a></h6>
                <h6>Статус: <strong>{link.status}</strong></h6>
                <h6>Кількість відкриттів: <strong>{link.clicks}</strong></h6>
                <h6>Дата створення: <strong>{new Date(link.date).toLocaleDateString()}</strong></h6>
                
            </div>
            </div>
            </div>
        </div>
        </>
    )
}
