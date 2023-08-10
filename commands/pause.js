const { SlashCommandBuilder } = require("discord.js");
const { useMasterPlayer } = require("discord-player");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("паузим трек!"),
    async execute(interaction) {
        const player = useMasterPlayer()
        try {
        const queue = player.nodes.get(interaction.guild)

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: "Ниче не играет", ephemeral: true })
        }

        const paused = queue.node.setPaused(true)
        return interaction.reply({ content: paused ? 'Трек теперь на паузе' : "чет не так" })
    }catch (error) {
        console.log(error)
    }
}
}