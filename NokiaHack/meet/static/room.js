const localVideo = document.getElementById('localVideo');
const startButton = document.getElementById('startCallButton');
const endButton = document.getElementById('endCallButton');

// Container for remote videos
const remoteVideosContainer = document.getElementById('remoteVideos');

const meetingId = window.location.pathname.split('/').slice(-2, -1)[0];
const socket = new WebSocket('ws://' + window.location.host + '/ws/meet/' + meetingId + '/');

let localStream;
let peerConnections = {}; // Store peer connections by user ID

startButton.onclick = startCall;
endButton.onclick = endCall;

// When WebSocket message is received
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
        case 'offer':
            handleOffer(data.offer, data.senderId);
            break;
        case 'answer':
            handleAnswer(data.answer, data.senderId);
            break;
        case 'ice-candidate':
            handleNewICECandidate(data.candidate, data.senderId);
            break;
        case 'new-user':
            addNewUser(data.userId);
            break;
        case 'user-left':
            handleUserLeft(data.userId);
            break;
        default:
            console.error('Unknown message type:', data.type);
    }
};

async function startCall() {
    try {
        // Access local media (audio/video)
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        // Notify the server that a new user has joined
        socket.send(JSON.stringify({ type: 'new-user', meeting_id: meetingId }));

    } catch (error) {
        console.error('Error accessing camera or microphone:', error);
    }
}

// Function to handle a new user joining
function addNewUser(userId) {
    const peerConnection = new RTCPeerConnection();
    peerConnections[userId] = peerConnection;

    // Add local stream tracks to the new peer connection
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // Handle the remote video stream
    peerConnection.ontrack = (event) => {
        const remoteVideo = document.createElement('video');
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.autoplay = true;
        remoteVideo.playsInline = true;

        // Append remote video element to the container
        remoteVideosContainer.appendChild(remoteVideo);
    };

    // Create an offer and send it to the server
    createOffer(userId);
}

// Handle incoming offer from another user
async function handleOffer(offer, senderId) {
    const peerConnection = new RTCPeerConnection();
    peerConnections[senderId] = peerConnection;

    // Add local stream tracks to the new peer connection
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // Handle the remote video stream
    peerConnection.ontrack = (event) => {
        const remoteVideo = document.createElement('video');
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.autoplay = true;
        remoteVideo.playsInline = true;

        // Append remote video element to the container
        remoteVideosContainer.appendChild(remoteVideo);
    };

    // Set the remote description (the offer)
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // Create an answer and send it back to the sender
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.send(JSON.stringify({
        type: 'answer',
        answer: answer,
        senderId: senderId,
        meeting_id: meetingId
    }));

    // Listen for ICE candidates from this peer connection
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.send(JSON.stringify({
                type: 'ice-candidate',
                candidate: event.candidate,
                senderId: senderId,
                meeting_id: meetingId
            }));
        }
    };
}

// Handle incoming answer from another user
async function handleAnswer(answer, senderId) {
    const peerConnection = peerConnections[senderId];
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

// Handle incoming ICE candidates from other peers
function handleNewICECandidate(candidate, senderId) {
    const peerConnection = peerConnections[senderId];
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

// Handle end of the call and leaving the meeting
function endCall() {
    // Close all peer connections and stop the media streams
    for (const userId in peerConnections) {
        const peerConnection = peerConnections[userId];
        peerConnection.close();
        delete peerConnections[userId];
    }

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }

    localVideo.srcObject = null;
    remoteVideosContainer.innerHTML = ''; // Clear remote videos

    // Notify the server that the user is leaving the room
    socket.send(JSON.stringify({
        type: 'leave',
        meeting_id: meetingId
    }));

    // Redirect to homepage after leaving
    window.location.href = '/';
}

// Create offer to send to new users joining the room
async function createOffer(userId) {
    const peerConnection = peerConnections[userId];

    // Create an offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Send the offer to the other user
    socket.send(JSON.stringify({
        type: 'offer',
        offer: offer,
        senderId: userId,
        meeting_id: meetingId
    }));

    // Listen for ICE candidates from this peer connection
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.send(JSON.stringify({
                type: 'ice-candidate',
                candidate: event.candidate,
                senderId: userId,
                meeting_id: meetingId
            }));
        }
    };
}
