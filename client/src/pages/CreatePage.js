import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useNavigate } from 'react-router-dom';

export const CreatePage =()=>{
    const navigate = useNavigate();
    const {token} = useContext(AuthContext)
    const {request} = useHttp()
    const [link, setLink] = useState('')
    const [name, setName] = useState('')

    useEffect( () => {
        window.M.updateTextFields()
    }, [])

    const createHandler = async () =>{
            try {
                const data = await request('/api/link/create', 'POST', {from: link, name: name}, {Authorization: `Bearer ${token}`})
                navigate(`/detail/${data.link._id}`)
            } catch (e) {}
    }

    return (
        <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <div className='row'>
            <div className='col s8 offset-s2'>
                <div className='input-field' style={{marginTop: '5rem'}}>
                <h5><i className="material-icons">add_circle_outline</i> Додати книжку</h5>
                <p>Назва книжки</p>
                <input placeholder="Введіть назву книжки" id="Name" type="text" onChange={e => setName(e.target.value)} value={name}/>
                <p>Введіть посилання</p>
                <input placeholder="Вcтавте посилання" id="Link" type="text" onChange={e => setLink(e.target.value)} value={link}/>
                <button className='btn grey lighten-1 black-text' onClick={createHandler}>Додати</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default CreatePage