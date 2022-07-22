import { createContext } from "react";

function nul(){}

export const AuthContext = createContext ({
    token: null,
    userId: null,
    roles: "User",
    login: nul,
    logout: nul,
    isAuthenticated: false
})