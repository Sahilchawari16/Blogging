"use client";

import { createContext ,ReactNode, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const user_service = "http://localhost:5000";
export const author_service = "http://localhost:5001";
export const blog_service = "http://localhost:5002";

export interface User{
        _id: string;
        name: string;
        email: string;
        image: string;
        instagram: string;
        linkedin: string;
        bio: string;
        facebook: string;
}

export interface Blog{
        id: string;
        title: string;
        description: string;
        blogcontent: string;
        image: string;
        category: string;
        author: string;
        created_at: string;
}

interface AppContextType {
    user: User | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps{
    children: ReactNode;
}



export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    async function fetchUser() {
        try {
            const token = Cookies.get("token");
            const {data} = await axios.get(`${user_service}/api/v1/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser(data);
            setIsAuth(true);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user:", error);
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchUser();
    }, []);

   return <AppContext.Provider value={{user}}></AppContext.Provider>

}

export const useAppData = (): AppContextType => {
    const context =  useContext(AppContext);
    if(!context){
        throw new Error("useAppData must be used within an AppProvider");
    }
    return context;
};