const { SlashCommandBuilder } = require("discord.js");
const { useMasterPlayer } = require("discord-player");
module.exports = {
	data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Kick the bot from the channel."),
	async execute(interaction){
        const player = useMasterPlayer()
        //Нынешняя очередь
		const queue = player.nodes.get(interaction.guildId)

		if (!queue)
		{
			await interaction.reply("Пустооонахуй")
			return;
		}

        // 
		queue.delete();

        await interaction.reply(`Ну ты и шлюха, ${interaction.user.username}!`)
	},
}