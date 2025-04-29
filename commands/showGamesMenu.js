import { Markup } from "telegraf";
import { commands } from "../constants.js";

export const showGamesMenu = (ctx) => {
  ctx.reply("Во что хочешь поиграть?", Markup.inlineKeyboard([
    [
      Markup.button.callback(commands.guessNumber.description, commands.guessNumber.command),
      Markup.button.callback(commands.wordsGame.description, commands.wordsGame.command),
    ],
  ]))
}