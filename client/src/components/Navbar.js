import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Navbar =()=> {
    const navigate = useNavigate()
    const auth = useContext(AuthContext)

    const logoutHandler =event=>{
        event.preventDefault()
        auth.logout()
        navigate('/')
    }

    return(
    <nav>
    <div className="nav-wrapper red darken-4" style={{padding: '0 2rem', width: '100%'}}>
      <span className="brand-logo">Збірник книжок</span>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li><NavLink to="/adminpanel">Адміністративна панель</NavLink></li>
        <li><NavLink to="/create">Додати нову</NavLink></li>
        <li><NavLink to="/links">Перелік</NavLink></li>
        <li><NavLink to="/update">Змінити пароль</NavLink></li>
        <li><a href="/" onClick={logoutHandler}>Авторизація</a></li>
      </ul>
    </div>
  </nav>
    )}