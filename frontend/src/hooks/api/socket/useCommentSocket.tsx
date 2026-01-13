// import { useEffect } from "react";
// import {io, Socket} from 'socket.io-client';

// const socket: Socket = io("ws://localhost:4040", {
//   autoConnect: false,
// })

// export const useCommentSocket = (postID: string, onCommentReceived: () => void) => {
//   useEffect(() => {
//     socket.connect();
    
//     socket.emit("post_page", postID); //join room 

//     socket.on("comment_received", (newComment: string) => { //listen for comments
//       onCommentReceived() 
//     });

//     return () => {
//       socket.emit("leave_post", postID)
//       socket.off("comment_received")
//       socket.disconnect();
//     };
//   }, [postID])

//   const sendComment = (comment: string, username: string) => {
//     socket.emit("comment_sent", {
//       postID,
//       comment,
//       username,
//       createAt: new Date().toISOString()
//     });
//   };

//   return {sendComment};
// };