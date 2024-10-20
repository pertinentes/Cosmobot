const Discord = require('discord.js')
const db = require('quick.db')
const axios = require('axios')
const fs = require('fs')
const Safeness = require("safeness-prevnames")
const { GiveawaysManager } = require('discord-giveaways');
const client = new Discord.Client({
    disableEveryone: true,
    intents: 53608447,
    partials: [
        Discord.Partials.Message,
        Discord.Partials.Channel,
        Discord.Partials.Reaction,
        Discord.Partials.User,
        Discord.Partials.GuildMember
    ],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: false }
})
client.prev = new Safeness.Client({ api: false })
const config = require('./config')
client.db = db;
client.config = config;

client.footer = {
    text: 'Cosmo',
    iconURL: `${config.images.icon}`
}
client.colors = {
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
    yellow: '#ffff00',
    orange: '#ffa500',
    purple: '#800080',
    pink: '#ffc0cb',
    brown: '#a52a2a',
    gray: '#808080',
    black: '#000000',
    white: '#ffffff',
    cyan: '#00ffff',
    magenta: '#ff00ff',
    lime: '#00ff00',
    teal: '#008080',
    navy: '#000080',
    maroon: '#800000',
    olive: '#808000',
    silver: '#c0c0c0',
    gold: '#ffd700',
    indigo: '#4b0082',
    violet: '#8a2be2',
}
client.color = client.colors.blue
client.functions = require('./src/fonctions/utils/index')
client.commands = new Discord.Collection()
client.snipe = new Discord.Collection()
client.aliases = new Discord.Collection()
client.cooldowns = new Discord.Collection()

client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        embedColor: client.color,
        reaction: "🎉"
    }
});

fs.readdirSync('./src/commands').forEach(dossier => {
    fs.readdirSync(`./src/commands/${dossier}`).filter(file => file.endsWith('.js')).forEach(file => {
        const command = require(`./src/commands/${dossier}/${file}`)
        client.commands.set(command.name, command)
        if (command.aliases) {
            command.aliases.forEach(alias => client.aliases.set(alias, command.name))
        }
    })
})

fs.readdirSync('./src/events').forEach(dossier => {
    fs.readdirSync(`./src/events/${dossier}`).filter(file => file.endsWith('.js')).forEach(file => {
        const event = require(`./src/events/${dossier}/${file}`)
        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args))
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args))
        }
    })
})

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received. Shutting down gracefully...');
    client.destroy();
    process.exit(0);
});

client.login(config.token)