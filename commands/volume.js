const { useMasterPlayer } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Установка громкости")
        .addIntegerOption(option => option
            .setName("number")
            .setDescription("Громкость")
        ),
    async execute(interaction) {
        const player = useMasterPlayer()
        try{
        
        const queue = player.nodes.get(interaction.guild)
        

        if (!queue || !queue.isPlaying()) {
            return interaction.reply("Не играет ничего")
        }

        const vol = parseInt(interaction.options.getInteger("number"))

        if (!vol) {
            return interaction.reply(`Текущая громкость ${queue.node.volume}`)
        }

        const success = queue.node.setVolume(vol)

        await interaction.reply({ content: success ? `громкость на ${vol}` : "чет не так" })
    }catch (error) {
        console.log(error)
    }
}
}