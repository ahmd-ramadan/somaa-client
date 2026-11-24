'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';

export const useOnlineUsers = () => {
    const { isConnected, socket } = useSocket();
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!socket || !isConnected) {
            return;
        }

        const handleError = (socketError: any) => {
            console.error('Socket error:', socketError);
            setError(socketError?.message || 'An error occurred');
        };

        const handleUpdateOnlineUsers = (users: string[]) => {
            setOnlineUsers(users);
        };

        socket.emit('getOnlineUsers');
        socket.on('updateOnlineUsers', handleUpdateOnlineUsers);
        socket.on('error', handleError);

        return () => {
            socket.off('updateOnlineUsers', handleUpdateOnlineUsers);
            socket.off('error', handleError);
        };
    }, [socket, isConnected]);

    return { onlineUsers, error };
};
