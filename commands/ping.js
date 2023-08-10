const { SlashCommandBuilder } = require('discord.js');

module.exports={
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
    async execute(interaction){
     
      await interaction.reply(`Слава роду! ${(Date.now() - interaction.createdTimestamp)/10} ms`);
    }
   

};