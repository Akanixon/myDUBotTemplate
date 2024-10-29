
import { InteractionHandler, InteractionHandlerTypes, container } from '@sapphire/framework';

export class ButtonHandler extends InteractionHandler {
    constructor(context, options) {
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    /***
     * @param {import('discord.js').Interaction} interaction
     */
    async run(interaction) {
        switch (interaction.customId) {
            default:
                try {
                    const button = container.buttons.get(interaction.customId.split("-")[0]);

                    await button.run({ interaction });
                } catch (error) {
                    console.log("Error running button:", interaction.customId,"\n", error);
                }
                break;
        }
    }
}