import React, { useCallback, useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LinkCard } from '../components/LinkCard';
import { Loader } from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';

export const DetailPage =()=>{
    const {token} = useContext(AuthContext)
    const {request, loading} = useHttp()
    const [link, setLink] = useState(null)
    const linkId = useParams().id

    const getLink = useCallback( async () =>{
        try {
            const fetched = await request(`/api/link/${linkId}`, 'GET', null, {Authorization: `Bearer ${token}`})
            setLink(fetched)
        } catch (e) {}
    }, [token, linkId, request])

    const deleteLinks = useCallback( async () =>{
        try {
            await request(`/api/link/delete/${linkId}`, 'GET', null, {Authorization: `Bearer ${token}`})
        } catch (e) {}
    }, [token, linkId, request])

    useEffect( () => {
        getLink()
    }, [getLink])

    if(loading){
        return <Loader />
    }

    return (
        <> 
        
        {!loading && link && <LinkCard link={link}/>}
        <div className="row">
            <div className="col s10 offset-s1">
                <button className='btn grey lighten-1' onClick={deleteLinks}><Link to={`/links`}>Видалити</Link></button>
            </div>
        </div>
        </>
    )
}

export default DetailPage