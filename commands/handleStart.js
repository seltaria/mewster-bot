import { inlineKeyboard } from "../constants.js";

export const handleStart = async (ctx) => {
  await ctx.sendSticker("https://cdn2.combot.org/frieren37/webp/2xf09f9184.webp");
  ctx.reply(`Yookoso, ${ctx.from.first_name || ctx.from.username}`, inlineKeyboard)
}