import { Markup } from "telegraf";
import { getNoun } from "../utils/utils.js";
import { commands } from "../constants.js";
import { wordsGame } from "./wordsGame.js";

export const handleText = (ctx, games) => {
  const chatId = ctx.chat.id;
  const game = games[chatId];
  
  // Если игра не начата, игнорируем
  if (!game.guessNum || !game.wordsGame) return;

  if (game.guessNum) {
    const guess = parseInt(ctx.message.text);

    // Проверяем, что введено число
    if (isNaN(guess)) {
      ctx.reply("В этой игре нужно писать только числа");
      return;
    }

    // Увеличиваем счетчик попыток
    game.attempts++;

    // Проверяем число
    if (guess === game.targetNumber) {
      ctx.reply(`Ура! Угадал! Тебе потребовалось всего лишь ${game.attempts} ${getNoun(game.attempts, ["попытка","попытки","попыток"])}`,
      Markup.inlineKeyboard([
        [Markup.button.callback(commands.menu.description, commands.menu.command)]
      ]))
      delete games[chatId]; // Завершаем игру
    } else if (guess < game.targetNumber) {
        ctx.reply('Мое число больше. Попробуй еще раз', 
          Markup.inlineKeyboard([
            [Markup.button.callback(commands.finishGame.command, commands.finishGame.command)]
          ])
        );
    } else {
        ctx.reply('Мое число меньше. Попробуй еще раз', 
          Markup.inlineKeyboard([
            [Markup.button.callback(commands.finishGame.description, commands.finishGame.command)]
          ])
        );
    }
  }

  if (game.wordsGame) {
    wordsGame(ctx, games[chatId].wordGame)
  }
}