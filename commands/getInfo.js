import { inlineKeyboard } from "../constants.js";

export const getInfo = async (ctx) => {
  await ctx.sendSticker("https://cdn2.combot.org/frieren37/webp/3xf09f9184.webp")
  await ctx.reply("Я бот, который делает разные штуки", inlineKeyboard)
}