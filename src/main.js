import { SapphireClient, LogLevel, container } from '@sapphire/framework';
import '@sapphire/plugin-api/register';
import { GatewayIntentBits, Partials  } from 'discord.js';
import { registerInteractionHandlers } from './util/registerHandlers.js';
import { initDB, getDualDB } from './util/db.js';
import config from "config";
import { sendMessageIngame } from './util/messageRelay/sendIngameMessage.js';
import { ListenToIngameMessageEvents } from './util/messageRelay/listenToIngameMessageEvents.js';

initDB();

container.dual = { cache: { users: {} } };
container.myDUBot = config.get("myDUBot");
container.orleans = config.get("orleans");

//registering handler files
await registerInteractionHandlers();

const client = new SapphireClient({
    defaultPrefix: "!",
    caseInsensitiveCommands: true,
    logger: {
        level: LogLevel.Info
    },
    shards: 'auto',
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel],
    loadMessageCommandListeners: false,
    listenOptions: {
        port: 6002,
        host: "localhost"
    },
    hmr: {
        enabled: true
    }
});

client.login(config.get("discord.token"));

client.on('messageCreate', async (message) => {
    if (message.author.bot || message.content.startsWith("!") || message.content == "")
        return;
    
    switch (message.channel.id) {
        case container.myDUBot.messageRelay.discordSupportChannelID: {
            //myDU-support
            await sendMessageIngame({ channel: 6, targetId: 6, message })
        } break;
        case container.myDUBot.messageRelay.discordGeneralChannelID: {
            //myDU-general
            await sendMessageIngame({ message });
        } break
    }
});

ListenToIngameMessageEvents(container.myDUBot.messageRelay);