import { useState, useCallback, useEffect } from "react"

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [ready, setReady] = useState(false)

    const login = useCallback( (jwtToken, id)=>{
        setToken(jwtToken)
        setUserId(id) 

        localStorage.setItem('Person', JSON.stringify({token: jwtToken, userId: id}))
    }, [])

    const logout = useCallback( ()=>{
        setToken(null)
        setUserId(null) 

        localStorage.setItem('Person')
    }, [])

    useEffect( () =>{
        const data = JSON.parse(localStorage.getItem('Person'))
        if (data && data.token) {
            login(data.token, data.userId)
        }
        setReady(true)
    }, [login])

    return {login, logout, token, userId, ready}
}