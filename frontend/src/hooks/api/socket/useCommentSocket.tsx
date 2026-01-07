import { useEffect, useState } from "react";
import { connectWS, sendWS, disconnectWS } from "../../../api/ws.ts";
import { Comment } from "../../../types/Comment.tsx";

const useCommentSocket = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    connectWS((data) => {
      setComments((prev) => [...prev, data]);
    });

    return () => {
      disconnectWS();
    };
  }, []);

  const sendComment = (content: string) => {
    sendWS({
      type: "send_comment",
      content,
    });
  };

  return { comments, sendComment };
};

export default useCommentSocket;
