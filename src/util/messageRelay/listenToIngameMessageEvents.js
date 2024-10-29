import { container } from '@sapphire/framework';
export async function ListenToIngameMessageEvents({ discordGeneralChannelID, discordSupportChannelID, allowedRoles }) {
    await container.db.dual.query('LISTEN newMessage')

    container.db.dual.on('notification', async (event) => {
        const payload = JSON.parse(event.payload);
        if (payload.sender_id == container.myDUBot.ID)
            return;
        if (container.dual.cache.users[payload.sender_id] == undefined) {
            const player = await container.db.dual.query("SELECT display_name FROM player WHERE id = $1", [payload.sender_id]).then(res => { return res.rows[0] });
            container.dual.cache.users[payload.sender_id] = player.display_name;
        }
        switch (payload.channel_id) {
            case 1: {
                //myDU-general
                await container.client.channels.cache.get(discordGeneralChannelID).send({
                    content: [
                        `\`${container.dual.cache.users[payload.sender_id]}\`: ${pingShortcut(suppressPings(payload.message, allowedRoles))}`,
                        `-# myDU General chat`
                    ].join("\n"),
                })
            } break;
            case 5: {
                //myDU-support
                await container.client.channels.cache.get(discordSupportChannelID).send({
                    content: [
                        `\`${container.dual.cache.users[payload.sender_id]}\`: ${pingShortcut(suppressPings(payload.message, allowedRoles))}`,
                        `-# myDU Help chat`
                    ].join("\n"),
                })
            } break;
            default:
                return;
                break;
        }
    });
}

function pingShortcut(content) {
    return content.replace(/@Staff/gi, (match, roleId) => {
        return `<@&1297138949567021076>`;
    });
}
function suppressPings(content, allowedRoles) {
    return content.replace(/<@&(\d+)>|<@!?(\d+)>/g, (match, roleId, userId) => {
        if (roleId && allowedRoles.includes(roleId)) {
            return match; // Allow the role mention
        }
        return userId ? `@${userId}` : `@${roleId}`;
    });
}