// import React, { useEffect, useState } from 'react';
// import { useSocket } from '@/hooks/useSocket';
// import { useTranslations } from 'next-intl';
// import { IAnalysis } from '@/interfaces/analysis.types';

// export const OnlineUsers = () => {
//     const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
//     const socket = useSocket();
//     // const t = useTranslations('OnlineUsers');

//     useEffect(() => {
//         if (!socket) {
//             console.log('No socket connection available');
//             return;
//         }

//         console.log('Setting up online users listener');

//         const handleOnlineUsers = (users: string[]) => {
//             console.log('Received online users update:', users);
//             if (Array.isArray(users)) {
//                 setOnlineUsers(users);
//             } else {
//                 console.error('Received invalid online users data:', users);
//             }
//         };

//         socket.on('updateOnlineUsers', handleOnlineUsers);
//         socket.emit('getAllAnalysis')
//         socket.on('allAnalysis', (allAnalysis: IAnalysis[]) => console.log(allAnalysis));

//         // Request initial online users list
//         console.log('Requesting initial online users list');
//         socket.emit('getOnlineUsers');

//         return () => {
//             console.log('Cleaning up online users listener');
//             socket.off('updateOnlineUsers', handleOnlineUsers);
//         };
//     }, [socket]);

//     return (
//         <div className="bg-white rounded-lg shadow p-4">
//             <h2 className="text-lg font-semibold text-primary mb-4">Online Users</h2>
//             <div className="space-y-2">
//                 {onlineUsers.length > 0 ? (
//                     onlineUsers.map((userId) => (
//                         <div key={userId} className="flex items-center gap-2">
//                             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                             <span className="text-sm text-gray-700">{userId}</span>
//                         </div>
//                     ))
//                 ) : (
//                     <p className="text-sm text-gray-500">No Users Online</p>
//                 )}
//             </div>
//         </div>
//     );
// }; 