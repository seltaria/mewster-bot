import dotenv from 'dotenv';
import process from "process";
import { Telegraf } from "telegraf";
import { commands } from "./constants.js";
import { handleWordsGame } from './commands/wordsGame.js';
import { handleStart } from './commands/handleStart.js';
import { getInfo } from './commands/getInfo.js';
import { getStickersLink } from './commands/getStickersLink.js';
import { getMeme } from './commands/getMeme.js';
import { showGamesMenu } from './commands/showGamesMenu.js';
import { showMainMenu } from './commands/showMainMenu.js';
import { getRandomPost } from './commands/getRandomPost.js';
import { handleGuessNumber } from './commands/numbersGame.js';
import { finishGame } from './commands/finishGame.js';
import { handleText } from './commands/handleText.js';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const games = {};

bot.telegram.setMyCommands(Object.values(commands));

const webhookUrl = 'https://mewster-bot.vercel.app';
(async () => {
  try {
      await bot.setWebHook(webhookUrl);
      console.log('Webhook установлен успешно');
  } catch (error) {
      console.error('Ошибка при установке webhook:', error);
  }
})();

bot.start(async (ctx) => handleStart(ctx));
// TODO: обработать не только action, но и вызов через меню
bot.action(commands.info.command, async (ctx) => getInfo(ctx));
bot.action(commands.stickersLink.command, (ctx) => getStickersLink(ctx));
bot.action(commands.memeOfTheDay.command, async (ctx) => getMeme(ctx));
bot.action(commands.games.command, (ctx) => showGamesMenu(ctx));
bot.action(commands.menu.command, (ctx) => showMainMenu(ctx));
bot.action(commands.randomPostLink.command, (ctx) => getRandomPost(ctx));
bot.action(commands.guessNumber.command, (ctx) => handleGuessNumber(ctx, games));
bot.action(commands.finishGame.command, (ctx) => finishGame(ctx, games));
bot.action(commands.wordsGame.command, (ctx) => handleWordsGame(ctx, games));
bot.on('text', (ctx) => handleText(ctx, games));

bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx?.reply('An error occurred, please try again later');
});

bot.launch()

// TODO: обработать неизвестные команды
// return bot.sendMessage(chatId, "Я такое пока не понимаю. Попробуй выбрать одну из существующих команд", commandsOptions);

export default async (req, res) => {
  const body = req.body;
  if (body.message) {
    bot.processUpdate(body);
    res.status(200).end();
  }
};
