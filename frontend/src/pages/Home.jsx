import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/Socket"
import { useNavigate, Link } from "react-router-dom";

function Home() {
    const socket = useSocket() ;
    const navigate = useNavigate() ;
    
    const [email , setEmail] = useState("") ;
    const [roomId , setRoomId] = useState("") ;

    const handledRoomJoined = useCallback(({roomId}) => {
        navigate(`/room/${roomId}`)
        console.log(`joined room: ${roomId}`);
    },[navigate])

    useEffect(() =>{
        socket.on("joined-room" , handledRoomJoined)
        return () => {
            socket.off("joined-room", handledRoomJoined) ;
        }
    },[handledRoomJoined ,socket]);

    const handleJoinRoom = () => {
        socket.emit('join-room',{
            email : email ,
            roomId : roomId
        })
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-3xl font-bold mb-6">WebRTC Video Chat</h1>
                <input 
                    value={email}
                    onChange={e => setEmail(e.target.value)} 
                    className="border-2 mb-4 border-gray-600 rounded-lg p-2 mr-2" 
                    type="email" 
                    placeholder="Enter email here"
                />
                <input 
                    value={roomId}
                    onChange={e => setRoomId(e.target.value)}
                    className="border-2 mb-4 border-gray-600 rounded-lg p-2 mr-2"
                    type="text" 
                    placeholder="Enter room code"
                />
                <button
                    onClick={handleJoinRoom}
                    className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 cursor-pointer mb-4"
                >Enter Room</button>
                
                <Link 
                    to="/test"
                    className="text-blue-600 hover:text-blue-800 underline"
                >
                    Test Connection (Debug)
                </Link>
            </div>
        </div>
    )
}

export default Home