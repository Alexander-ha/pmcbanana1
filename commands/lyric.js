const {EmbedBuilder} = require("discord.js")
const { useMasterPlayer } = require("discord-player");
const {lyricsExtractor} = require('@discord-player/extractor')
const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("текст песни")
    .addStringOption(option => option
        .setName("imya")
        .setDescription("название песни")
    ),

    async execute(interaction) {
        const search = lyricsExtractor()
        const player = useMasterPlayer()
    try{
        await interaction.deferReply('Извлекаю текст')

        const queue = player.nodes.get(interaction.guild)
        const track = interaction.options.getString('imya')

        if(!queue && !track){
            return interaction.editReply({content: "Ничего не играет, или ты не ввел название песни, еблан"})
        }

        if(queue || track){
            const res = await search.search(track ?? queue.currentTrack.title)
            if (!res) {
                return interaction.editReply({ content: `Нету текста для: ${music ? music : queue.currentTrack.title}` })
            } 
            const lyrics = await lyricFinder.search(track ?? queue.currentTrack.title).catch(() => null);

        const trimmedLyrics = lyrics.lyrics.substring(0, 1997);
        const embed = new EmbedBuilder()
          .setTitle(`${res.title}`)
          .setURL(`${res.url}`)
          .setThumbnail(`${res.thumbnail}`)
          .setAuthor({
              name: res.lyrics.artist.name,
              iconURL: res.lyrics.artist.image,
              url: res.lyrics.artist.url
    })
    .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
    .setColor('green');
    return interaction.followUp({ embeds: [embed] });
    } }catch(error){
        console.log(error)
       }

     }

}