import "dotenv/config";

import { createReadStream, rm } from "fs";
import { Input, Telegraf } from 'telegraf';
import { DownloadVideo } from "./download";

const bot = new Telegraf(process.env.BOT_TOKEN as string);

const chatsAutheticate: number[] = []

bot.command('authenticate', (ctx) => {

  const userAndPass = ctx.message.text.split("/authenticate")[1];

  const [user, password] = userAndPass.split("@");

  if (user.trim() === process.env.USERNAME?.trim() && password.trim() === process.env.PASSWORD?.trim()) {
    if (!chatsAutheticate.includes(ctx.message.chat.id)) {
      chatsAutheticate.push(ctx.message.chat.id);
    }
    ctx.reply('Authenticated')
  }

})

bot.command('yt', async (ctx) => {

  if (!chatsAutheticate.includes(ctx.message.chat.id)) {
    ctx.reply('NOT AUTHORIZED')
    return
  }

  const url = ctx.message.text.split("/yt")[1];

  const response = await new DownloadVideo().video(url);
  //
  await ctx.replyWithAudio(
    Input.fromReadableStream(createReadStream(response.path), response.name),
    {
      thumbnail: response.thumb
    }
  )
  rm(response.path, () => {

  })

});

bot.launch()
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))