let ws, match, savedName, savedTarget;

const connect = async (name, target) => {
    ws = new WebSocket("ws://localhost:8080");

    savedName = name;
    savedTarget = target;

    ws.addEventListener("open", () => {
        ws.send(JSON.stringify({
            type: "notify",
            data: {
                name, target
            }
        }))
    })

    ws.addEventListener("message", (ev) => {
        console.log(ev.data);
        const data = JSON.parse(ev.data);

        switch (data.type) {
            case "connection":
                match = data.matchId
                break;

            default:
                console.log(data);
        }
    })
}

const sendPosition = async (pos) => {
    ws.send(JSON.stringify(
        {
            type: "update",
            data: {
                name: savedName,
                match: match,
                position: pos        
            }
        }))
}
