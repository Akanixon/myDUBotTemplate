import { container } from '@sapphire/framework';
export async function sendMessageIngame({ channel = 0, targetId = 1, message }) {

    let messageContent = splitMessage({ username: `[${message.author.displayName ?? message.author.username}]:`, content: message.content });
    for (let e of messageContent) {

        let data = {
            message: e,
            channel: {
                channel: channel,
                targetId: targetId
            },
            fromPlayerId: container.myDUBot.ID,
            fromPlayerName: container.myDUBot.name,
            timestamp: Date.now(),
            roles: {
                admin: false,
                communityHelper: false
            }
        }
        let rsp = await sendMessage(data);
    }
}
function splitMessage({ username, content }, maxLength = 255) {
    const parts = [];
    let part = '';

    while (content.length > 0) {
        if (parts.length == 0 && content.length > maxLength - 2 - username.length) {
            part = content.slice(0, maxLength - 2 - username.length);
            part = `${username} ${part} …`;
            content = content.slice(maxLength - 2 - username.length);
        } else {
            if (username.length + content.length > maxLength - 4) {
                part = content.slice(0, maxLength - 4 - username.length);
                part = `${username} … ${part} …`;
                content = content.slice(maxLength - 4 - username.length);
            } else {
                if (parts.length > 0) {
                    part = `${username} … ${content}`;
                } else {
                    part = `${username} ${content}`;
                }
                content = '';
            }
        }
        parts.push(part);
    }
    return parts;
}

function sendMessage(msg) {
    return fetch(`${container.orleans}/router/641616/by/${container.myDUBot.ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(msg)
    })
        .then(rsp => { return { status: rsp.status, statusText: rsp.statusText } })
        .catch(error => { return error });
}