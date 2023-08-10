const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { useMasterPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Показывает 10 треков в очереди"),

     async execute(interaction){
        const player = useMasterPlayer()
        const queue = player.nodes.get(interaction.guildId)

        // проверка треков в очереди
        if (!queue || !queue.node.isPlaying)
        {
            await interaction.reply("Пусто добил");
            return;
        }

        // вывод 10 треков
        const queueString = queue.tracks.toArray().slice(0, 10).map((song, i) => {
            return `${i}) [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`
        }).join("\n")

        // Вывод нынешней песни 
        const currentSong = queue.currentTrack
        if (!currentSong)
        {
            await interaction.reply("Пусто добил");
            return;
        }
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Сейчас играет**\n` + 
                        (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None") +
                        `\n\n**Очередь**\n${queueString}`
                    )
                    .setThumbnail(currentSong.setThumbnail)
            ]
        })
    }
}