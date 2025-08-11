import {usePeer} from "../providers/Peer";
import { useSocket } from "../providers/Socket"
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRef } from "react";

export const Room = () => {
    const { roomId } = useParams();
    const socket = useSocket() ;
    const {peer, createOffer ,createAnswer,setRemoteAnswer,sendStream,remoteStream} = usePeer() ;

    const [myStream, setMyStream] = useState(null);
    const [remoteEmail , setRemoteEmail] = useState(null);
    const videoRef = useRef(null);
    const videoRef2 = useRef(null);
    //console.log("Room component mounted with roomId:", roomId);
    //console.log("Socket instance:", socket);
    //console.log("Peer instance:", peer);

    const handleNewUserJoined = useCallback(async (data) => {
        const {email} = data ;
        console.log("new user joined ", email)
        const offer = await createOffer() ;
        socket.emit("call-user", {email , offer})
        setRemoteEmail(email) ;
    },[ createOffer, socket]) ;

    const handleIncomingCall = useCallback(async (data) => {
        const {from, offer} = data ;
        console.log("incoming call from " , from , offer ) ;
        const answer = await createAnswer(offer) ;
        socket.emit("call-accepted", {email: from, answer}) ;
        setRemoteEmail(from) ;
    } , [createAnswer , socket])

    const handleAcceptedCall = useCallback(async (data) => {
        const {answer} = data ;
        console.log("call accepted with answer", answer) ;
        await setRemoteAnswer(answer) ;
    }, [setRemoteAnswer]) ;

    const getUserMediaStream = useCallback(async() => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio:true ,
            video: true
        })
        setMyStream(stream);
    },[])

    const handleNegotiation = useCallback(async ()=>{
        const localOffer = peer.localDescription ;
        socket.emit("call-user" ,{email : remoteEmail , offer :localOffer})
    },[peer.localDescription , remoteEmail, socket])


    useEffect(() => {
        console.log("Setting up socket event listeners");
        socket.on("user-joined",handleNewUserJoined) 
        socket.on("incoming-call" , handleIncomingCall)
        socket.on("call-accepted" , handleAcceptedCall)

        return () => {
            console.log("Cleaning up socket event listeners");
            socket.off("user-joined", handleNewUserJoined) ;
            socket.off("incoming-call", handleIncomingCall) ;
            socket.off("call-accepted", handleAcceptedCall) ;
        }
    },[handleNewUserJoined , handleIncomingCall , handleAcceptedCall,socket])    

    useEffect(() => {
        peer.addEventListener("negotiationneeded" , handleNegotiation) ;
        return () => {
            peer.removeEventListener("negotiationneeded", handleNegotiation) ;
        }
    },[])

    useEffect(() => {
        getUserMediaStream() ;
    },[getUserMediaStream])

    useEffect(() => {
        if (myStream && videoRef.current) {
            videoRef.current.srcObject = myStream;
        }
    }, [myStream]);

    useEffect(() => {
        return () => {
            if (myStream) {
                myStream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        };
    }, [myStream]);

    return (
        <div className="">
            <h1>Room: {roomId}</h1>
            {/* <p>You are under surveillance</p> */}
            {/* <ReactPlayer url={myStream} playing={true}/> */}
            <h4>you are conneted to {remoteEmail}</h4>
            <button 
                className="border p-2 m-2" 
                onClick={e => sendStream(myStream)}>send my stream</button>
            <video 
                ref={videoRef}
                autoPlay
                muted
                playsInline
                width="400"
                height="300"
                style={{ border: '1px solid #ccc' }}
            />

            <video
                ref={videoRef2}
                autoPlay
                playsInline
                width="400"
                height="300"
                style={{ border: '1px solid #ccc' }}
            />
        </div>
    )
}
