import { Markup } from "telegraf";
import { commands } from "../constants.js";

export const getRandomPost = (ctx) => {
  const lastPostId = 2001;
  const randomNumber = Math.floor(Math.random() * (lastPostId - 1) + 1);

  ctx.reply(`https://t.me/expkart/${randomNumber}`, Markup.inlineKeyboard([
    [
      Markup.button.callback("Другая запись", commands.randomPostLink.command),
      Markup.button.callback("Меню", commands.menu.command)
    ]
  ]));
}