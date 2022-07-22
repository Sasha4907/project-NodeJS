import React, {useEffect, useState} from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const navigate = useNavigate();
    const message = useMessage()
    const {loading, request, error, clearError}=useHttp()
    const [form, setForm] = useState({
        email:'', password:''
    })

    useEffect( () =>{
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
                const data = await request('/api/auth/register', 'POST', {...form})
                message(data.message)
        } catch (e) {}
    }

    const loginHandler = async () => {
        try {
                const data = await request('/api/auth/login', 'POST', {...form})
                auth.login(data.token, data.id)
                navigate('/create')
        } catch (e) {}
    }

    return (
        <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <div className= "row">
            <div className='col s8 offset-m2'>
                <h1>Збірник книжок</h1>
                <div className="card amber darken-4">
                    <div className="card-content white-text">
                        <span className="card-title"><i className="material-icons">account_circle</i> Авторизація</span>
                        <div>
                            <div className="input-field">
                                <input placeholder="Введіть email" id="email" type="text" name="email" className="white-input" onChange={changeHandler} value={form.email}/>
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field">
                                <input placeholder="Введіть пароль" id="password" type="password" name="password" className="white-input" onChange={changeHandler} value={form.password}/>
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button className='btn grey darken-1' style={{marginRight: 10}} onClick={loginHandler} disabled={loading}>Вхід</button>
                        <button className='btn grey darken-3' onClick={registerHandler} disabled={loading}>Зареєструватись</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default AuthPage