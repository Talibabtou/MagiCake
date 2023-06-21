// Bot's private outputs logs are in french while public outputs are in english
// Requires also node_modules to run
// Call your list participants holders.txt
// There is no weighting, holders.txt must contain the number of registration proportionnal to odds

console.log("début du programme");

const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences
  ]
});

const token = "INSERT TOKEN"; // insert secret token given by discord here.

client.on('ready', () => {
  console.log(Le bot est prêt en tant que ${client.user.tag});
});

client.on('messageCreate', message => {
  console.log(Nouveau message "${message.content}" reçu de ${message.author.username});

  if (message.content.startsWith('!raffle ')) {
    const winnersCount = parseInt(message.content.split(' ')[1]);
    if (!winnersCount || winnersCount < 1) {
      console.log("Nombre de gagnants invalide");
      message.reply('Nombre de gagnants invalide');
      return;
    }
    fs.readFile('holders.txt', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Participants lus depuis le fichier", data);

      const participants = data.split('\n');
      const longPart = participants.slice()
      const winners = [];
      while (winners.length < winnersCount && participants.length > 0) {
        const randomIndex = Math.floor(Math.random() * participants.length);
        const winner = participants[randomIndex];
        participants.splice(randomIndex, 1);
        winners.push(winner);
      }
      console.log("The winner is ", winners, " from " , longPart.length , " Holders");
      message.reply( \n ${winners.join('\n')} + " - From " + (longPart.length ) + " registered Cakes" );

    });
  }
});

client.login(token).then(() => {
  console.log('Le bot est connecté');
}).catch((error) => {
  console.error("Erreur lors de la connexion du bot", error);
});
