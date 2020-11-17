const Discord = require("discord.js"),
client = new Discord.Client();

const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

const config = require("./config");

client.on("ready", () => {
    console.log(`Ready to serve ${client.guilds.size} servers. Logged in as ${client.user.tag}.`);
});

client.on("message", (message) => {

    // Don't listen bot users
    if(message.author.bot) return;

    let clientMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if(message.content.match(clientMention)){
        return message.channel.send(`:wave: Bonjour, **${message.author}** ! Tape \`${config.prefix}random\` pour obtenir une image aléatoire !`);
    }

    let ljdcMention = new RegExp(`^<@!?388465585983586323>( |)$`);
    if(message.content.match(ljdcMention)){
        return message.channel.send(`:x: Ne mentionnez pas Les Joies du Code svp !`);
    }

    if(message.content.indexOf(config.prefix) !== 0) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g),
    command = args.shift().toLowerCase();

    if(command === "random"){
        let rand = Math.floor(Math.random() * 1420);
        let url = `https://lesjoiesducode.fr/page/${rand}`;
        fetch(url).then(async (res) => {
            let dom = new JSDOM(await res.text()),
            text = dom.window.document.getElementsByClassName("index-blog-post-title")[0].textContent,
            image = dom.window.document.getElementsByClassName("blog-post-content")[0].getElementsByTagName("object")[0].data,
            embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            .setTitle(text)
            .setURL(url)
            .setColor(message.member ? message.member.displayColor : "#FF0000")
            .setImage(image);
            return message.channel.send(embed);
        }).catch((err) => {
            console.log(err)
            return message.channel.send(":x: | Une erreur est survenue !");
        });
    }

});

client.login(config.token);
