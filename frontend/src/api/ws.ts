let ws: WebSocket | null = null;

export const connectWS = (onMessage: (data: any) => void) => {
  if (ws) return; // prevent duplicates

  ws = new WebSocket("ws://localhost:5000/ws");

  ws.onopen = () => {
    console.log("WS connected");
  };

  ws.onmessage = (e) => {
    onMessage(JSON.parse(e.data));
  };

  ws.onclose = () => {
    console.log("WS closed");
    ws = null;
  };
};

export const sendWS = (data: any) => {
  console.log("function is called")
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  console.log("can bypass the checking")
  ws.send(JSON.stringify(data));
};

export const disconnectWS = () => {
  ws?.close();
  ws = null;
};
