import { useState, useCallback, useEffect } from "react"
let isLocalStorageSupported = typeof localStorage === 'object';

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [ready, setReady] = useState(false)

    const login = useCallback( (jwtToken, id)=>{
        setToken(jwtToken)
        setUserId(id) 

        try {
            localStorage.setItem("Person", 'test');
            localStorage.removeItem("Person");
        } catch (e) {
            isLocalStorageSupported = false;
            
            if (e.code === DOMException.QUOTA_EXCEEDED_ERR && localStorage.length === 0) { } 
            else {throw e;}
        }

        if (isLocalStorageSupported) {
            localStorage.setItem('Person', JSON.stringify({token: jwtToken, userId: id}))
        }
    }, [])

    const logout = useCallback( ()=>{
        setToken(null)
        setUserId(null) 

        localStorage.removeItem('Person')
    }, [])

    useEffect( () =>{
        try {
            const data = JSON.parse(localStorage.getItem('Person'))
            if (data && data.token) {
                login(data.token, data.userId)
            }
            setReady(true)
        } catch (error) {}
        
    }, [login])

    return {login, logout, token, userId, ready}
}