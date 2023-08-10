process.env.FFMPEG_PATH = require('ffmpeg-static')
const fs = require('fs');
const path = require('node:path');
const { Client,Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const{ Player } = require('discord-player');
const {REST} = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Manager  = require('erela.js')
const { EmbedBuilder } = require('discord.js');
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("0b27d2242ef8ef5ceb498345cb34aab8fdbdc51fbe4f438a3011d2432a8699e8");

//выше постоянные ниже клиент - бот и команды

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates] });


//player - единственный экземпляр класса Player, чтобы не перегружать client

const player = Player.singleton(client);
//Загрузка экстракторов


client.commands = new Collection();

client.cooldowns = new Collection();




//указываю путь к командам
const commandsPath = path.join(__dirname, 'commands');

//парсим только js файлы

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//все что загоняется в список file добавляется в список path, далее идет проверка условием на наследование экземпляра класса

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] У команды ${filePath} проебались данные и исполнитель где то.`);
	}
}
//запуск команды поиск по списку через метод interaction. Юзаю асинхронки при создании промисов тк есть шанс что ответ от сервера не будет мгновенным

player.events.on('playerStart', (queue, track) => {
 if(track.url.includes("yandex")){
/*	const params = {
		engine: "yandex_images",
		text: track.author + track.title
	  };
	const callback = function(data) {
		console.log(data["images_results"]);
	  };
	const datas = search.json(params, callback);
    const resic = JSON.stringify(datas);
//	console.log(resic);

//	fs.writeFile("ps1logs.txt", resic, function(error) { 
//		if(error) throw error; // если возникла ошибка
//		console.log("Асинхронная запись файла завершена. Содержимое файла:");
//	}); 

//	const tt = resic["images_results"][1]["thumbnail"];*/
    tt = track.thumbnail.replace('%%','');

	  
	  
	playEmbed = new EmbedBuilder()
	.setColor(0xff0000)
	.setTitle(`Начинаю играть **${track.title}**, Источник:Яндекс.Музыка`)
	.setURL(`${track.url}`)
	.setDescription(`ЧВК БА-УГА-БУГА: Для получения списка всех команд нажмите /help, скоро будет доступен 3D и эквалайзер`)
	.setThumbnail("https://" + tt + "m1000x1000")
    }
 else{
	playEmbed = new EmbedBuilder()
	.setColor(0xff0000)
	.setTitle(`Начинаю играть **${track.title}**`)
	.setURL(`${track.url}`)
	.setDescription(`ЧВК БА-УГА-БУГА: Для получения списка всех команд нажмите /help, скоро будет доступен 3D и эквалайзер`)
	.setThumbnail(track.thumbnail)
 }


  
	
 queue.metadata.channel.send({embeds:[playEmbed]});
	
});


player.events.on('disconnect', (queue) => {
    // Выход из канала
    queue.metadata.channel.send('Счастливо оставаться, сучки!');
});

 

client.on(Events.InteractionCreate, async interaction => {
	const member = interaction.options.getMember();
	//if (member.roles.cache.some(role => role.name === 'inagent')) {
	//	await interaction.reply("ДАННОЕ СООБЩЕНИЕ (МАТЕРИАЛ) СОЗДАНО И (ИЛИ) РАСПРОСТРАНЕНО ИНОСТРАННЫМ СРЕДСТВОМ МАССОВОЙ ИНФОРМАЦИИ, ВЫПОЛНЯЮЩИМ ФУНКЦИИ ИНОСТРАННОГО АГЕНТА, И (ИЛИ) РОССИЙСКИМ ЮРИДИЧЕСКИМ ЛИЦОМ, ВЫПОЛНЯЮЩИМ ФУНКЦИИ ИНАГЕНТА")
//}

	if (!interaction.isChatInputCommand())
	
	return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`В глаза долбишься, где ты  ${interaction.commandName} вообще нашел.`);
		return;
	}
	
	if (interaction.isAutocomplete()) {
        await command.autocompleteRun(interaction);}
   
 

    const { cooldowns } = client;
	//проверка есть ли выход кулдауна к конкретной команды, если нет - используем кнструктор коллекции и ебашим параметры ниже 
    if (!cooldowns.has(command.data.name)) {
	     cooldowns.set(command.data.name, new Collection());
}
    //точка отсчета, в противном случае используется дефолт
     const now = Date.now();
     const timestamps = cooldowns.get(command.data.name);
	 const defaultCooldownDuration = 3;
    //перевод кулдауна команды в милисекунды
     const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

    if (timestamps.has(interaction.user.id)) {
	//Время перезапуска определяется как момент подачи команды + установленный кулдаун
	 const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

	if (now < expirationTime) {
		const expiredTimestamp = Math.round(expirationTime / 1000);
		return interaction.reply({ content: `Жди  \`${command.data.name}\`. Будет доступна в  <t:${expiredTimestamp}:R>.`, ephemeral: true });
	}
} 
    //удаление запроса пользователя из памяти и сброс кулдауна
    timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	try {
		
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Ошибка выполнения блять!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'Сам ты пидор чмо ебаное!', ephemeral: true });
		}
	}






});

client.once(Events.ClientReady, c => {
	console.log(`Я последний, Слава Роду, Слава Русскому народу ${c.user.tag}`);
});
//ДЕБАГГЕР НЕ МОЙ
player.on('debug', async (message) => {
    // Emitted when the player sends debug info
    // Useful for seeing what dependencies, extractors, etc are loaded
    console.log(`General player debug event: ${message}`);
});
 
player.events.on('debug', async (queue, message) => {
    // Emitted when the player queue sends debug info
    // Useful for seeing what state the current queue is at
    console.log(`Player debug event: ${message}`);
});
//ИЩУ АШИБКИ
player.events.on('error', (queue, error) => {
    // Emitted when the player queue encounters error
    console.log(`General player error event: ${error.message}`);
    console.log(error);
});
 
player.events.on('playerError', (queue, error) => {
    // Emitted when the audio player errors while streaming audio track
    console.log(`Player error event: ${error.message}`);
    console.log(error);
});

client.login(token);


