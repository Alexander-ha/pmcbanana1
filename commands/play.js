const { QueryType, Track } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');
const {SlashCommandBuilder} = require('discord.js');
const { useMasterPlayer } = require("discord-player");
const{ SpotifyExtractor, SoundCloudExtractor, YoutubeExtractor } = require('@discord-player/extractor');
const { YandexMusicExtractor } = require("discord-player-yandexmusic");
const ymext = `ext:${YandexMusicExtractor.identifier}`
module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Лабает музон')
    .addStringOption(option => option
        .setName("song")
        .setDescription('щас спаю')
        .setRequired(true))
    .addStringOption(option => option
        .setName("repeat")
        .setDescription('щас спаю')
        .setRequired(false)),

    


    async autocompleteRun(interaction) {
            await player.extractors.register(YoutubeExtractor, {});
            await player.extractors.register(YandexMusicExtractor, { access_token: "y0_AgAAAABAnIqeAAG8XgAAAADowXG2fyIcNPZDRbuu7i_feM-2P4aiHgo", uid: "1084000926" });
            const player = useMasterPlayer();
            const query = interaction.options.getString('query', true);
            const results = await player.search(query);
            return interaction.respond(
                results.tracks.slice(0, 10).map((t) => ({
                    name: t.title,
                    value: t.url
                }))
            );
            },




    async execute(interaction, client) {
        const player = useMasterPlayer()
        const channel = interaction.member.voice.channel;
        await player.extractors.register(YoutubeExtractor, {});
        await player.extractors.register(SpotifyExtractor, {});
        await player.extractors.register(YandexMusicExtractor, { access_token: "y0_AgAAAABAnIqeAAG8XgAAAADowXG2fyIcNPZDRbuu7i_feM-2P4aiHgo", uid: "1084000926" });


        if (!channel) return interaction.reply('Зайди в канал дура!');
	    await interaction.deferReply()

        
        

        const song = interaction.options.getString('song');
        var repeat = interaction.options.getString('repeat');
        if(repeat == "да"){repeat = true};
        const res = await player.search(song, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });
        


        if (!res || !res.tracks.length) return interaction.editReply({ content: `не нешал ниче ${interaction.member}... снова пробуем ? ❌`, ephemeral: true });

        const queue = await player.nodes.create(interaction.guild, {
            metadata: {
                channel: interaction.channel,
                client: interaction.guild.members.me,
                requestedBy: interaction.user, //
              },
              selfDeaf: true,
                 volume: 80,
                 leaveOnEmpty: true,
                 leaveOnEmptyCooldown: 300000,
                 leaveOnEnd: true,
                 leaveOnEndCooldown: 300000,
        });


       
//установка фильтров и режимов
       if (repeat == true){
            queue.setRepeatMode(1);}
/*        try{
            var nightcore = interaction.options.getString("nightcore");
            var bass = interaction.options.getString("bass");
            var dim = interaction.options.getString("3d");
            var param = [bass, nightcore];
            if(dim){                
                queue.filters.filters.setFilters(['8D'])
            };

            if(param){                
                await queue.filters.ffmpeg.toggle(param);
            };
        }catch(e){
            return interaction.editReply("Невозможно наложить фильтры")
//            console.log(e);
       }*/
//проверка состояния подключения
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            await player.deleteQueue(interaction.guildId);
            return interaction.editReply({ content: `Не могу войти в канал ${interaction.member}... давай по новой чмо? ❌`, ephemeral: true});
        }

       await interaction.editReply({ content:`Врубаю музяку ${res.playlist ? 'playlist' : 'song'}... 🎧`});


       



       await interaction.followUp({
        content: `⏱| Добавляю в плейлист ${res.playlist ? "playlist" : "track"}`,
        ephemeral: true,
        
    }).then(async (message) => {
        queue.addTrack(res.playlist ? res.tracks : res.tracks[0])
/*            const res = await player.search(song, {
                requestedBy: interaction.member,
                searchEngine: QueryType.AUTO
            });
        queue.addTrack(res.playlist ? res.tracks : res.tracks[0])*/       
        if (!queue.node.isPlaying()){ 
            await queue.node.play()
            }
    });
        
    },
};