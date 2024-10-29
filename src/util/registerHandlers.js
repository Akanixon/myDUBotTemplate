import { container } from '@sapphire/framework';
import { Collection } from 'discord.js';

import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function registerInteractionHandlers() {
    const handlers = fs.readdirSync(__dirname.replace("util", "interaction-handlers"))
        .filter(file => file.endsWith('.js')).map(file => file.replace(".js", ""));
    console.log(handlers);
    for (const handler of handlers) {
        container[handler] = new Collection();
        const location = __dirname.replace("util", `/interactions/${handler}`)
        const files = fs.readdirSync(location).filter(file => file.endsWith('.js'));

        for (const file of files) {
            const filePath = path.join(location, file);
            const interaction = await import(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('run' in interaction) {
                container[handler].set(file.replace(".js", ""), interaction);
            } else {
                console.log(`[WARN] The ${handler} at ${filePath} is missing a required "run" property.`);
            }
        }

        console.log(`Registered ${container[handler].size} ${handler} handlers`);
    }
}