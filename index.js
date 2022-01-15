const { Client, Intents, Collection } = require('discord.js');
const DisTube = require('distube');
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { SpotifyPlugin } = require('@distube/spotify')
const fs = require('fs');
const { SlashCommandSubcommandGroupBuilder } = require('@discordjs/builders');
require('dotenv').config();

const intents = new Intents(641);
const client = new Client({ intents });

const distube = new DisTube.default(client, {
    searchSongs: 1,
    searchCooldown: 30,
    leaveOnEmpty: false,
    emptyCooldown: 0,
    leaveOnFinish: false,
    leaveOnStop: false,
    youtubeCookie: "LOGIN_INFO=AFmmF2swRQIhANHWCjefL7oJrNLZVMXhF8nE3dlA2mI4rZS9WAR4BR93AiARSPv2hIMJbtFNNjg7WqEiTp2h64QgZBHLuLu-ue8XIQ:QUQ3MjNmd0FEZ2VMSUZwQnozeUxadXBYb2N1SHQzOXNtdzhNOU5mbWJ4bWN4c3EzVzEzNm9xTHFYaFdQOU55b2NITU1HUk1oQ3hlSlh0XzR2SW94bzE2MmZOVnBhZGtNY0pWZXh1OFI5b1BhT1BIZndlRE52bVZzTWNSaTZNLVY3ckVMSi1aSVBLb19QTHFWVVItR25tVXNsMkFMeXpsV3dn; VISITOR_INFO1_LIVE=IPKicBnVAXo; PREF=tz=Europe.Amsterdam&f6=40000000; HSID=Ah-hp1FTnNcUTPORA; SSID=ATXvDyGBJaWCVpuS2; APISID=lxQgrsK1_YHK8vAR/AQjapf1j86p5l8XNB; SAPISID=B0-PKYnu1mNZS90j/AeAyyKfxlV110LmZY; __Secure-1PAPISID=B0-PKYnu1mNZS90j/AeAyyKfxlV110LmZY; __Secure-3PAPISID=B0-PKYnu1mNZS90j/AeAyyKfxlV110LmZY; SID=FAixObJZ8fY292fhNkkgq4UkTz-jxIQ4lAlw1ZR2Uy7WR9NX0sKjhAnQDU1HgyDJD-k2rQ.; __Secure-1PSID=FAixObJZ8fY292fhNkkgq4UkTz-jxIQ4lAlw1ZR2Uy7WR9NXheMvttjfdRiNxKbv3dCU1w.; __Secure-3PSID=FAixObJZ8fY292fhNkkgq4UkTz-jxIQ4lAlw1ZR2Uy7WR9NXio6LuJZRSbVrnj5KxwjUaQ.; YSC=hXjbvSR2IlI; SIDCC=AJi4QfEiZyI-w2fvzn1Ke7FN2LZ8hc99TxYeqTkiOvwCQfhe3qY9LXUN_sOWGDZOnlczQTLDWAE; __Secure-3PSIDCC=AJi4QfHoV2pFS74oxt5HXVP-3oFypw-29RSGVOEMODejFxetMlmCnbwGci8NtplEg1H7Txuh1Z8",
    plugins: [new SoundCloudPlugin(), new SpotifyPlugin()],
});

client.distube = distube

client.once('ready', client => {
    console.log(`Logged in as ${client.user.tag}`);

    client.user.setPresence({ activities: [{ name: "Try Me Playlist" , type: 'LISTENING', url: "https://open.spotify.com/playlist/6bTfXqBI1UUeweb8XXFY5h?si=8a3aaa4dce28440c"}]})

    const channel = client.channels.cache.get(process.env.VCID)

    client.distube.playVoiceChannel(
        channel,
        "https://open.spotify.com/playlist/6bTfXqBI1UUeweb8XXFY5h?si=1e424aad117d42bf",
    )

    console.log("added playlist to queue")
})

client.distube.on('addList', (queue, playlist) => {
    const guild = client.guilds.cache.get(process.env.GUILDID)

    client.distube.shuffle(guild)
    console.log("Shuffled queue")

    client.distube.setVolume(guild, 50)
    console.log("set Volume to 50%")
})

client.distube.on('error', (channel, error) => {
    console.log(error)
})

client.distube.on('finish', (queue) => {
    console.log("queue has finished")

    const channel = client.channels.cache.get(process.env.VCID)

    client.distube.playVoiceChannel(
        channel,
        "https://open.spotify.com/playlist/6bTfXqBI1UUeweb8XXFY5h?si=1e424aad117d42bf",
    )

    console.log("Updated to latest playlist")

})

client.distube.on('disconnect', queue => {
    const channel = client.channels.cache.get(process.env.VCID)

    client.distube.playVoiceChannel(
        channel,
        "https://open.spotify.com/playlist/6bTfXqBI1UUeweb8XXFY5h?si=1e424aad117d42bf",
    )
    console.log("Bot disconnected, Re-added playlist")
})

client.login(process.env.TOKEN);
