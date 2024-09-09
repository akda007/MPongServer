import { v4 as uuidv4 } from "uuid"
import { Client } from "./clientManager";
import { Ball } from "./ball";

interface Match {
    id: string
    clientA: Client | undefined;
    clientB: Client | undefined;
    ball: Ball;
}

export class MatchManager {
    private matches: Record<string, Match> = {};

    createMatch(clientA: Client): Match {
        const matchId = uuidv4();
        const ball = new Ball(400, 300, 100,100);
        const newMatch: Match = { id: matchId, clientA, clientB: undefined, ball};
        this.matches[matchId] = newMatch;
        return newMatch;
    }

    getMatch(matchId: string): Match | undefined {
        return this.matches[matchId]
    }

    updateBallPosition(matchId: string, ball: Ball) {
        const match = this.getMatch(matchId);
        if (!match) return;
        
        match.ball = ball;
    }

    getBallData(matchId: string) {
        const match = this.getMatch(matchId);
                    return match ? { x: match.ball.x, y: match.ball.y, vx: match.ball.vx, vy: match.ball.vy} : null;
    }

    findOrCreateMatch(client: Client, target: string): Match {
        let match: Match | undefined = Object.values(this.matches).find(
            (match) => match.clientA?.id === target && !match.clientB
        )

        if (!match) {
            match = this.createMatch(client);
        } else {
            match.clientB = client;
        }

        return match;
    }
}