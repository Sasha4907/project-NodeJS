import React, {useEffect, useState} from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { useContext } from 'react';

export const UpdatePage = () => {
    const {token} = useContext(AuthContext)
    const message = useMessage()
    const {request, error, clearError}=useHttp()
    const [oldpassword, setOldPassword] = useState('')
    const [newpassword, setNewPassword] = useState('')

    useEffect( () =>{
        message(error)
        clearError()
    }, [error, message, clearError])

    const generateHandler = async () => {
            try {
                    const newpassword = await request('/api/auth/generate', 'GET', null, {Authorization: `Bearer ${token}`})
                    setNewPassword(newpassword);
                    message(newpassword.message)
            } catch (e) {}
        }

    const updateHandler = async () => {
        try {
                const data = await request('/api/auth/update', 'POST', {oldpassword, newpassword}, {Authorization: `Bearer ${token}`})
                message(data.message)
        } catch (e) {}
    }

    return (
        <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
        <div className= "row" style={{marginTop: 10}}>
            <div className='col s8 offset-m2'>
                <div className="card amber darken-4">
                    <div className="card-content white-text">
                        <span className="card-title"><td><i className="material-icons">fingerprint</i></td>Змінити пароль</span>
                            <div className="input-field">
                                <h6>Старий пароль</h6>
                                <input placeholder="Введіть старий пароль" id="oldpassword" type="text" name="oldpassword" className="white-input" onChange={e => setOldPassword(e.target.value)} value={oldpassword} />
                                <h6>Новий пароль</h6>
                                <input placeholder="Введіть новий пароль" id="newpassword" type="text" name="newpassword" className="white-input" onChange={e => setNewPassword(e.target.value)} value={newpassword} />
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button className='btn grey darken-3' onClick={updateHandler} style={{marginRight: 10}}>Змінити пароль</button>
                        <button className='btn grey darken-2' onClick={generateHandler}>Згенерувати пароль</button>
                    </div>
                </div>
            </div>
            </>
    )
}

export default UpdatePage