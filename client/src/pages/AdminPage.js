import React, {useEffect, useState} from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { useContext } from 'react';

export const AdminPage = () => {
    const {token} = useContext(AuthContext)
    const message = useMessage()
    const {request, error, clearError}=useHttp()
    const [form, setForm] = useState({})

    useEffect( () =>{
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value})
    }

    const updateHandler = async () => {
        try {
                const data = await request('/api/admin/adminpanel', 'POST', {...form}, {Authorization: `Bearer ${token}`})
                message(data.message)
        } catch (e) {}
    }

    return (
        <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
        <div className= "row">
            <div className='col s8 offset-m2'>
                <div className="card amber darken-4">
                    <div className="card-content white-text">
                        <span className="card-title"><td><i className="material-icons">fingerprint</i></td>Змінити пароль користувача</span>
                        <div>
                            <label style={{color: "white"}}>
                                <input type="checkbox" name="role" onChange={changeHandler} value={true} /><span>Admin</span> 
                            </label>
                            <div className="input-field">
                            <h6>Email</h6>
                                <input placeholder="Введіть email" id="email" type="text" name="email" className="white-input" onChange={changeHandler} value={form.email}/>
                            </div>
                            <div className="input-field">
                            <h6>Password</h6>
                                <input placeholder="Введіть пароль" id="password" type="text" name="password" className="white-input" onChange={changeHandler} value={form.password}/>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-action">
                    <button className='btn grey darken-3' onClick={updateHandler}>Змінити пароль</button>
                </div>
            </div>
        </div>
    </>
    )
}

export default AdminPage