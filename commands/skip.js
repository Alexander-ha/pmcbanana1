const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { useMasterPlayer } = require("discord-player");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("скипает трек")
        .addIntegerOption(option => option
            .setName("number")
            .setDescription("позиция трека")
        ),
async execute(interaction){
    const player = useMasterPlayer()
    const queue = player.nodes.get(interaction.guildId)
    try{
    if (!queue || !queue.node.isPlaying)
        {
            await interaction.reply("Чо ты пропускать собрался, хуй в жопу?)");
            return;
        }
    const pos = interaction.options.getInteger("number")
    if((queue.tracks.toArray().length == 0)){queue.node.skip();}
    if(!pos){
    queue.node.skipTo(0);}
    else{queue.node.skipTo(pos)}
    await interaction.reply("Успешно пропустил")



    }catch(error){

        console.log(error);
}
}
}