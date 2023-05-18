import { WebSocketServer } from "ws";

const PORT = 7071;

const wss = new WebSocketServer({ port: PORT });
const clients = new Map();

wss.on("connection", (ws) => {
    const metadata = { id: uuidv4(), color: Math.floor(Math.random() * 360) };
    clients.set(ws, metadata);

    ws.on("message", (messageAsString) => {
        const message = JSON.parse(messageAsString);
        const metadata = clients.get(ws);
        message.sender = metadata.id;
        message.color = metadata.color;

        [...clients.keys()].forEach((client) => {
            client.send(JSON.stringify(message));
        });
    });

    ws.on("close", () => {
        clients.delete(ws);
    });
});

function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}
