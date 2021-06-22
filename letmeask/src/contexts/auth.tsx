import { ReactNode, useEffect } from "react";
import { useContext } from "react";
import { createContext, useState } from "react";
import {auth, firebase} from '../services/firebase'

type UserType = {
    id: string, 
    name: string, 
    avatar: string
}

type AuthContextType = {
    user: UserType | undefined;
    signInWithGoogle: ()=>Promise<void>;
}

type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider ({children}:AuthProviderProps){

    const [user, setUser] = useState<UserType>()

    
    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()
        
        const res = await auth.signInWithPopup(provider)
        if(res.user) {
            const {displayName, photoURL, uid } = res.user
                if(!displayName || !photoURL){
                    throw new Error('Missing information from Google Account');
                }
                setUser({
                    id: uid, 
                    name: displayName, 
                    avatar: photoURL
                })
            }
        }
        
        useEffect(()=> {
            const unsubscribe = auth.onAuthStateChanged(user=>{
                if(user) {
                    const {displayName, photoURL, uid } = user
                        if(!displayName || !photoURL){
                            throw new Error('Missing information from Google Account');
                        }
                        setUser({
                            id: uid, 
                            name: displayName, 
                            avatar: photoURL
                        })
                    }   
            })
            return () => unsubscribe()
        }, [])

        return(
        <AuthContext.Provider value={{
            user,
            signInWithGoogle
        }}>
            {children}
        </AuthContext.Provider>
    )
}

