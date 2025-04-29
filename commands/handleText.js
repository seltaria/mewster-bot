import { Markup } from "telegraf";
import { getNoun } from "../utils/utils.js";
import { commands, inlineKeyboard } from "../constants.js";
import { wordsGame } from "./wordsGame.js";

export const handleText = (ctx, games) => {
  const chatId = ctx.chat.id;
  const game = games[chatId];

  const numGameData = game?.guessNum;
  const wordsGameData = game?.wordsGame;
  
  // Если игра не начата, игнорируем
  if (!numGameData && !wordsGameData) return;

  if (numGameData) {
    const guess = parseInt(ctx.message.text);

    // Проверяем, что введено число
    if (isNaN(guess)) {
      ctx.reply("В этой игре нужно писать только числа");
      return;
    }

    // Увеличиваем счетчик попыток
    numGameData.attempts++;

    // Проверяем число
    if (guess === numGameData.targetNumber) {
      ctx.reply(`Ура! Угадал! Тебе потребовалось всего лишь ${numGameData.attempts} ${getNoun(numGameData.attempts, ["попытка","попытки","попыток"])}`,
      Markup.inlineKeyboard([
        [Markup.button.callback(commands.menu.description, commands.menu.command)]
      ]))
      delete games[chatId]; // Завершаем игру
      return;
    } else if (guess < numGameData.targetNumber) {
        ctx.reply('Мое число больше. Попробуй еще раз', 
          Markup.inlineKeyboard([
            [Markup.button.callback(commands.finishGame.description, commands.finishGame.command)]
          ])
        );
        return;
    } else {
        ctx.reply('Мое число меньше. Попробуй еще раз', 
          Markup.inlineKeyboard([
            [Markup.button.callback(commands.finishGame.description, commands.finishGame.command)]
          ])
        );
        return;
    }
  }

  if (wordsGameData) {
    return wordsGame(ctx, wordsGameData)
  }

  ctx.reply("Я такое пока не понимаю. Попробуй выбрать одну из существующих команд", inlineKeyboard)
}