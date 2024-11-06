import React, { createContext, useState, useEffect, useContext } from 'react';
import {useRouter} from "next/router";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCurrentUser = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('jwtToken');
            console.log('Token:', token); // 토큰 로깅
            if (!token) {
                setUser(null);
                return;
            }

            const response = await fetch('http://localhost:8080/api/auth/current-user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'  // Content-Type 추가
                }
            });

            console.log('Full response:', response); // 전체 응답 로깅

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log('Server response:', data);  // 서버 응답 로깅
            if (data && data.data) {  // 서버 응답 구조에 따라 조정
                setUser(data.data);
            } else {
                console.error('Unexpected server response structure');
                setUser(null);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setUser(null);
        router.push('/');
    };

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token && token !== 'undefined') {
            fetchCurrentUser();
        } else {
            console.log('No token found, skipping fetchCurrentUser');
            setLoading(false);
        }
    }, []);
    return (
        <AuthContext.Provider value={{ user, loading, error, logout, fetchCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);