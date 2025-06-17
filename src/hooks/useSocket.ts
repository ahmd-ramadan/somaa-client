import { useAppSelector } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);

    useEffect(() => {
        if (!token) {
            console.log('No token available, skipping socket connection');
            return;
        }

        console.log('Attempting to connect to socket server...');
        
        // Initialize socket connection
        socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
            auth: {
                token
            },
            transports: ['websocket', 'polling'],
            path: '/socket.io/',
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 45000,
            maxHttpBufferSize: 1e8 // 100MB
        } as any);

        // Add connection status handlers
        socketRef.current.on('connect', () => {
            console.log('Socket connected successfully');
            setIsConnected(true);
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        socketRef.current.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            setIsConnected(false);
        });

        socketRef.current.on('error', (error) => {
            console.error('Socket error:', error);
            // Handle specific error types
            if (error.status === 401) {
                // Handle unauthorized error
                console.error('Authentication error:', error.message);
            } else if (error.status === 400) {
                // Handle bad request error
                console.error('Bad request:', error.message);
            }
        });

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                console.log('Cleaning up socket connection');
                socketRef.current.disconnect();
            }
        };
    }, [token]);

    return { socket: socketRef.current, isConnected };
};