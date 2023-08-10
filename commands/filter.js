const { SlashCommandBuilder, SlashCommandStringOption } = require("discord.js");
const { useMasterPlayer } = require("discord-player");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("filter")
        .setDescription("Встроенные фильтры")
        .addStringOption(option => option
            .setName("3d")
            .setDescription('щас спаю')
            .setRequired(false))
        .addStringOption(option => option
            .setName("bass")
            .setDescription('щас спаю')
            .setRequired(false))
        .addStringOption(option => option
            .setName("nightcore")
            .setDescription('щас спаю')
            .setRequired(false))
        .addStringOption(option => option
            .setName("clear")
            .setDescription('щас спаю')
            .setRequired(false)),

        async execute(interaction){
                const player = useMasterPlayer();
                const queue = player.nodes.get(interaction.guildId);
              
/*                const subdata = await interaction.options.getString();*/
        
                // проверка треков в очереди
                if (!queue || !queue.node.isPlaying)
                {
                    await interaction.reply("Пусто добил");
                    return;
                }
                const filters = queue.filters.ffmpeg.getFiltersEnabled();
                queue.setTransitioning(true);
                if(interaction.options.getString('clear') == "да"){
//                   queue.filters.ffmpeg.getFiltersDisabled();
                   queue.filters.ffmpeg.getFiltersDisabled();
//                   queue.setTransitioning(true);
//                   queue.queue.setTransitioning(true);
                }

                if(interaction.options.getString('nightcore') == "да"){
                var nightcore = 'nightcore';
                }

                if(interaction.options.getString('bass') == "да"){ 
                var bass = 'bassboost';
               }

                if(interaction.options.getString('3d') == "да"){ 
                var dim = "8D"
                }
                const currentSong = queue.currentTrack;
                var param = [bass, nightcore, dim];

/*                if(dim){
                    queue.filters.filters.setFilters(['8D'])
                };*/

                if(param.length>0){
                await queue.filters.ffmpeg.toggle(param);}

                await interaction.reply("Фильтры успешно наложены");
                

            
            
            
            }};
