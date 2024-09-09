import WebSocket, { WebSocketServer } from "ws";
import { ClientManager } from "./core/clientManager";
import { MatchManager } from "./core/matchManager";
import app from "./app";

interface UserEvent {
    type: string;
    data: any;
}

const clientManager = new ClientManager();
const matchManager = new MatchManager();

const port = 8080;
const server = app.listen(port, () => console.log("Server started!"));
const wss = new WebSocketServer({ server });

wss.on("listening", () => {
    console.log("Websocket started!");

    wss.on("connection", (ws: WebSocket) => {
        ws.send(JSON.stringify({message: "Connected!"}));

        ws.on("message", (message: string) => {
            const data: UserEvent = JSON.parse(message);

            switch(data.type) {
                case "notify":
                    handleNotifyEvent(ws, data.data);
                    break;
                case "update":
                    handleUpdateEvent(data.data);
                    break;
                case "get-ball":
                    handleGetBallEvent(data.data);
                    break;
                case "ball":
                    handleBallEvent(data.data);
                    break;
                default:
                    ws.send(JSON.stringify({error: "Unknown event type!"}));
                    break;
            }
        })
    })
})

function handleGetBallEvent(info: any) {
    const {matchId} = info;

    const match = matchManager.getMatch(matchId);
    
    if (!match)
        return

    const ballData = matchManager.getBallData(matchId);

    const json = JSON.stringify({type: "ball", data: ballData});

    match.clientA?.ws.send(json);
    match.clientB?.ws.send(json);
}

function handleBallEvent(info: any) {
    const { matchId, ball } = info;
    matchManager.updateBallPosition(matchId, ball);

    const ballData = matchManager.getBallData(matchId);

    if (!ballData)
        return;

    const match = matchManager.getMatch(matchId);
    
    if(!match)
        return;

    const ballUpdate = { type: "ball", data: ballData };
    const json = JSON.stringify(ballUpdate);
    
    match.clientA?.ws.send(json);
    match.clientB?.ws.send(json);
}

function handleNotifyEvent(ws: WebSocket, info: any) {
    const { name, target } = info;
    clientManager.addClient(name, ws);

    const client = clientManager.getClient(name);
    if (!client) return;

    const match = matchManager.findOrCreateMatch(client, target);
    ws.send(JSON.stringify({ matchId: match.id, type: "connection", ball: match.ball, host: match.clientA?.id === name }));
}

function handleUpdateEvent(info: any) {
    const { name, match, position } = info;
    const currentMatch = matchManager.getMatch(match);

    if (!currentMatch) return;

    if (currentMatch.clientA?.id === name) {
        currentMatch.clientB?.ws.send(JSON.stringify({ position, type: "update" }));
    } else if (currentMatch.clientB?.id === name) {
        currentMatch.clientA?.ws.send(JSON.stringify({ position, type: "update" }));
    }
}