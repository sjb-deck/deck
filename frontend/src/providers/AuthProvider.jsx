import { createContext, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Api } from '../globals/api';
import { staySignedIn, signOut, getRefreshToken } from '../hooks/auth/authHook';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const refreshAuthToken = (options) => {
        const defaultOptions = {
            refetchOnWindowFocus: false,
            onError: (error) => {
                signOut();
                if (error.response?.status === 401) return;
                console.error(error);
                setAlert({
                    severity: 'error',
                    message: error.message,
                    autoHide: false,
                    additionalInfo: error.response?.data?.message,
                });
            },
            onSuccess: (data) => {
                staySignedIn(data.access, data.refresh);
            },
        };
        return useMutation({
            mutationFn: async (data) => {
              const response = await axios.post(Api['refresh'], data);
              return response.data;
            },
            ...defaultOptions,
            ...options,
        });
    }

    const {mutate} = refreshAuthToken();
    const checkTokenExpiration = () => {
        if (getRefreshToken()) {
            mutate({refresh: getRefreshToken()});
        } else {
            signOut();
        }
    }

    useEffect(() => {
        checkTokenExpiration();
        const interval = setInterval(checkTokenExpiration, 1100000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider>
            {children}
        </AuthContext.Provider>
    )

}