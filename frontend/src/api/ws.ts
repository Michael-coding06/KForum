let socket: WebSocket | null = null;

export const connectWS = (
  onMessage: (data: any) => void
) => {
  socket = new WebSocket("ws://localhost:5000/ws");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch {
      console.log("Raw message:", event.data);
    }
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
  };
};

export const sendWS = (data: any) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
};

export const disconnectWS = () => {
  socket?.close();
};
