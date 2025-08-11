// Debug utility for WebRTC connections
export const logPeerConnectionState = (peer, label = 'Peer') => {
    console.log(`=== ${label} Connection State ===`);
    console.log(`ICE Connection State: ${peer.iceConnectionState}`);
    console.log(`Connection State: ${peer.connectionState}`);
    console.log(`Signaling State: ${peer.signalingState}`);
    console.log(`ICE Gathering State: ${peer.iceGatheringState}`);
    console.log(`Remote Description:`, peer.remoteDescription);
    console.log(`Local Description:`, peer.localDescription);
    console.log(`Senders:`, peer.getSenders());
    console.log(`Receivers:`, peer.getReceivers());
    console.log(`================================`);
};

export const logStreamInfo = (stream, label = 'Stream') => {
    if (!stream) {
        console.log(`${label}: No stream`);
        return;
    }
    console.log(`=== ${label} Info ===`);
    console.log(`Stream ID: ${stream.id}`);
    console.log(`Active: ${stream.active}`);
    console.log(`Tracks:`, stream.getTracks().map(track => ({
        kind: track.kind,
        id: track.id,
        enabled: track.enabled,
        readyState: track.readyState
    })));
    console.log(`====================`);
};

export const checkWebRTCSupport = () => {
    console.log('=== WebRTC Support Check ===');
    console.log(`RTCPeerConnection: ${typeof RTCPeerConnection !== 'undefined' ? 'Supported' : 'Not Supported'}`);
    console.log(`getUserMedia: ${navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? 'Supported' : 'Not Supported'}`);
    console.log(`WebSocket: ${typeof WebSocket !== 'undefined' ? 'Supported' : 'Not Supported'}`);
    console.log(`===========================`);
}; 