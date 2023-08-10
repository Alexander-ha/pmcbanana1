const { useMasterPlayer } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");
const { QueryType } = require('discord-player');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("playnext")
        .setDescription("Играть трек из очереди")
        .addIntegerOption(option => option
            .setName("position")
            .setDescription("Позиция трека в очереди"))
        .addStringOption(option => option
            .setName("name")
            .setDescription("Название трека")
        ),
    async execute(interaction) {
        const player = useMasterPlayer()
        try{

            const queue = player.nodes.get(interaction.guild)

        if (!queue || !queue.isPlaying()) {
            return interaction.reply("Не играет ничего")
        }
        const pos = parseInt(interaction.options.getInteger("position"))
        if (!pos) {
            return interaction.reply(`Текущий трек ${queue.currentTrack}`)
        }
        
        const query = interaction.options.getString("name")
        const searchResults = await player.search(query, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        })
        
        if (!searchResults || !searchResults.tracks.length) {
            return interaction.reply({ content: 'Ничего нет' })
        }
        queue.node.insert(searchResults.tracks[pos])
        await interaction.reply("Порядок успешно изменен")





    }catch (error) {
        console.log(error)





}}}