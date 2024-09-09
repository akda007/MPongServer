import WebSocket from "ws";

export interface Client {
    id: string;
    ws: WebSocket;
}


export class ClientManager {
    private clients: Record<string, Client> = {};

    addClient(id: string, ws: WebSocket) {
        this.clients[id] = {id, ws}
    }

    getClient(id: string): Client | undefined {
        return this.clients[id];    
    }
}