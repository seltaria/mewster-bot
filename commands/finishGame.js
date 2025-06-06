import { Markup } from "telegraf";
import { commands } from "../constants.js";

export const finishGame = (ctx, games) => {
  const chatId = ctx.chat.id;
  if (games[chatId]) {
    if (games[chatId].guessNum) {
      ctx.reply(`Я загадывала число ${games[chatId].guessNum.targetNumber}. Приходи поиграть ещё!`,
        Markup.inlineKeyboard([
          [Markup.button.callback(commands.menu.description, commands.menu.command)]
        ])
      );
    }
    if (games[chatId].wordsGame) {
      ctx.reply("Приходи поиграть ещё!",
        Markup.inlineKeyboard([
          [Markup.button.callback(commands.menu.description, commands.menu.command)]
        ])
      );
    }
    delete games[chatId];
  } else {
    ctx.reply("Сейчас нет активной игры, можешь начать новую", 
      Markup.inlineKeyboard([
        [Markup.button.callback(commands.games.description, commands.games.command)]
      ])
    );
  }
}