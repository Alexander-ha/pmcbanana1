const { SlashCommandBuilder } = require("discord.js");
const { useMasterPlayer } = require("discord-player");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("repeat")
        .setDescription("Хуярю на бис!"),
        async execute(interaction, track) {
            const player = useMasterPlayer();
            try{
            const queue = player.nodes.get(interaction.guild)
    
            if (!queue || !queue.isPlaying()) {
                return interaction.reply("Ничего не играет")
            }
            const currentSong = queue.currentTrack
            queue.addTrack(currentSong);
            await interaction.reply(`Ща повторю! **${currentSong}**`)
        }catch (error) {
            console.log(error)
        }
    }}