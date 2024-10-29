import { InteractionHandler, InteractionHandlerTypes, container } from "@sapphire/framework";

export class ModalHandler extends InteractionHandler {
    constructor(context, options) {
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.ModalSubmit
        });
    }

    /***
     * @param {import('discord.js').Interaction} interaction
     */
    async run(interaction, result) {
        const modal = container.modals.get(interaction.customId);

        const rsp = await modal.run({ interaction });
    }

    /***
     * @param {import('discord.js').Interaction} interaction
     */
    parse(interaction) {
        if (!container.modals.get(interaction.customId)) return this.none();
        return this.some();
    }
}