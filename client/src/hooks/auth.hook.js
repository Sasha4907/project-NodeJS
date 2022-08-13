import { useState, useCallback, useEffect } from "react"
import LocalStorage from "./localStorage"

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [ready, setReady] = useState(false)

    const login = useCallback( (jwtToken, id)=>{
        setToken(jwtToken)
        setUserId(id) 

        LocalStorage.setItem('Person', {token: jwtToken, userId: id})
    }, [])

    const logout = useCallback( ()=>{
        setToken(null)
        setUserId(null) 

        LocalStorage.removeItem('Person')
    }, [])

    useEffect( () =>{
        try {
            const data = JSON.parse(LocalStorage.getItem('Person'))
            if (data && data.token) {
                login(data.token, data.userId)
            }
            setReady(true)
        } catch (error) {}
        
    }, [login])

    return {login, logout, token, userId, ready}
}