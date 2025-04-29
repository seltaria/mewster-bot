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

// const webhookUrl = 'https://mewster-bot.vercel.app';
// (async () => {
//   try {
//       await bot.telegram.setWebhook(webhookUrl);
//       console.log('Webhook установлен успешно');
//   } catch (error) {
//       console.error('Ошибка при установке webhook:', error);
//   }
// })();

bot.start(async (ctx) => handleStart(ctx));

bot.action(commands.info.command, async (ctx) => getInfo(ctx));
bot.hears(commands.info.command, async (ctx) => getInfo(ctx));

bot.action(commands.stickersLink.command, (ctx) => getStickersLink(ctx));
bot.hears(commands.stickersLink.command, async (ctx) => getStickersLink(ctx));

bot.action(commands.memeOfTheDay.command, async (ctx) => getMeme(ctx));
bot.hears(commands.memeOfTheDay.command, async (ctx) => getMeme(ctx));

bot.action(commands.games.command, (ctx) => showGamesMenu(ctx));
bot.hears(commands.games.command, async (ctx) => showGamesMenu(ctx));

bot.action(commands.menu.command, (ctx) => showMainMenu(ctx));
bot.hears(commands.menu.command, async (ctx) => showMainMenu(ctx));

bot.action(commands.randomPostLink.command, (ctx) => getRandomPost(ctx));
bot.hears(commands.randomPostLink.command, async (ctx) => getRandomPost(ctx));

bot.action(commands.guessNumber.command, (ctx) => handleGuessNumber(ctx, games));
bot.hears(commands.guessNumber.command, async (ctx) => handleGuessNumber(ctx, games));

bot.action(commands.finishGame.command, (ctx) => finishGame(ctx, games));
bot.hears(commands.finishGame.command, async (ctx) => finishGame(ctx, games));

bot.action(commands.wordsGame.command, (ctx) => handleWordsGame(ctx, games));
bot.hears(commands.wordsGame.command, async (ctx) => handleWordsGame(ctx, games));

bot.on('text', (ctx) => handleText(ctx, games));

bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx?.reply(`Упс! Ошибка: ${err}. Не смотрите на неё, скоро исправится`);
});

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    await bot.handleUpdate(req.body, res);
    if (!res.headersSent) res.status(200).end();
  } catch (err) {
    console.error('Error:', err);
    if (!res.headersSent) res.status(500).end();
  }
};
