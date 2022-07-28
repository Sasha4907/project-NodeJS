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
                <p>Назва книжки: <strong>{link.name}</strong></p>
                <p>Ваше посилання: <a href={link.to} target="_blank" rel="noopener noreferrer">{link.to}</a></p>
                <p>Статус: <strong>{link.status}</strong></p>
                <p>Кількість відкриттів: <strong>{link.clicks}</strong></p>
                <p>Дата створення: <strong>{new Date(link.date).toLocaleDateString()}</strong></p>
                
            </div>
            </div>
            </div>
        </div>
        </>
    )
}
