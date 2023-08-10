const { SlashCommandBuilder, Client, Role } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply(`Команда запущена ${interaction.user.username}, который присоединился к ${interaction.member.joinedAt}, выполняет роль ${interaction.member.Role}.`);
	},
};
