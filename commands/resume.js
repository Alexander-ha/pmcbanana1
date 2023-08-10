const { SlashCommandBuilder } = require("discord.js");
const { useMasterPlayer } = require("discord-player");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("продолжаем трек!"),
    async execute(interaction, track) {
        const player = useMasterPlayer();
        try{
        const queue = player.nodes.get(interaction.guild)

        if (!queue || !queue.isPlaying()) {
            return interaction.reply("Ничего не играет")
        }
        const currentSong = queue.currentTrack
        const paused = queue.node.setPaused(false)
        await interaction.reply(`Продолжаем драть тебя в жопу под **${currentSong}**`)
    }catch (error) {
        console.log(error)
    }
}};