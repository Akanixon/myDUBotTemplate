import { InteractionHandler, InteractionHandlerTypes, container } from '@sapphire/framework';

export class AutocompleteHandler extends InteractionHandler {
    constructor(context, options) {
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Autocomplete
        });
    }
    
    /***
     * @param {import('discord.js').Interaction} interaction
     */
    async run(interaction, result) {
        return interaction.respond(result);
    }

    /***
     * @param {import('discord.js').Interaction} interaction
     */
    async parse(interaction) {

        switch (interaction.commandName) {
            default:
                try {
                    const autocomplete = container.autocomplete.get(interaction.commandName);

                    const rsp = await autocomplete.run({interaction});
    
                    if (rsp) {
                        return this.some(rsp);
                    } else {
                        return this.none();
                    } 
                } catch (error) {
                    console.log("Error running autocomplete:", interaction.commandName,"\n", error);
                }
                
                break;
        }
    }
}