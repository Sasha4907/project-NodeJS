import 'materialize-css';
import React from 'react';
import { Loader } from './components/Loader';
import {Routes, Route} from 'react-router-dom';
import LinksPage from './pages/LinksPage';
import CreatePage from './pages/CreatePage';
import DetailPage from './pages/DetailPage';
import UpdatePage from './pages/UpdatePage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';

function App() {
        const {token, login, logout, userId, ready} = useAuth()
        const isAuthenticated = !!token

        if(!ready){
            return <Loader />
        }

            if (isAuthenticated){
            return(
                <> 
                <main>
                <AuthContext.Provider value={{token, login, logout, userId, isAuthenticated}}>
                    <Routes>
                        <Route path="/" element={<AuthPage />} />
                        <Route path="/links" element={<LinksPage />} />
                        <Route path="/create"  element={<CreatePage />} />
                        <Route path="/detail/:id"  element={<DetailPage />} />
                        <Route path="/update"  element={<UpdatePage />} />
                        <Route path="/adminpanel"  element={<AdminPage />} />
                    </Routes>
                </AuthContext.Provider>
                </main>
                </>
        )} else{
            return(
                <>
                <main>
                <AuthContext.Provider value={{token, login, logout, userId, isAuthenticated}}>
                    <Routes>
                        <Route path="/" element={<AuthPage />} />
                    </Routes>
                </AuthContext.Provider>
                </main>
                </>
            )
        }
        
    }

    export default App