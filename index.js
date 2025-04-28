import dotenv from 'dotenv';
import process from "process";
import { Markup, Telegraf } from "telegraf";
import { commands, inlineKeyboard } from "./constants.js";
import { createCanvas, loadImage } from "canvas";
import { getNoun } from "./utils.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.telegram.setMyCommands(Object.values(commands));

bot.start(async (ctx) => {
  await ctx.sendSticker("https://cdn2.combot.org/frieren37/webp/2xf09f9184.webp");
  ctx.reply(`Yookoso, ${ctx.from.first_name || ctx.from.username}`, inlineKeyboard)
})

bot.action(commands.info.command, async (ctx) => {
  ctx.answerCbQuery();
  await ctx.sendSticker("https://cdn2.combot.org/frieren37/webp/3xf09f9184.webp")
  ctx.reply("Я бот, который делает разные штуки", inlineKeyboard)
})

bot.action(commands.stickersLink.command, (ctx) => {
  ctx.answerCbQuery();
  ctx.reply("https://t.me/addstickers/frieren37")
})

bot.action(commands.memeOfTheDay.command, async (botCtx) => {
  const todayDate = new Date().toLocaleDateString();
  const currentYear = new Date().getFullYear();

  const canvas = createCanvas(400, 600)
  const ctx = canvas.getContext('2d')

  const imgUrl = 'https://i.imgflip.com/8hvoej.jpg?a483408';

  await loadImage(imgUrl).then((image) => {
    ctx.drawImage(image, 0, 0, 400, 600)
  })

  ctx.font = "30px";
  ctx.fillText(`01.01.${currentYear}`, 220, 100);
  ctx.fillText(todayDate, 220, 500);

  const createdImage = canvas.toBuffer("image/jpeg");

  botCtx.answerCbQuery();
  await botCtx.replyWithPhoto({ source: createdImage })
})

bot.action(commands.games.command, (ctx) => {
  ctx.answerCbQuery();
  ctx.reply("Во что хочешь поиграть?", Markup.inlineKeyboard([
    [
      Markup.button.callback(commands.guessNumber.description, commands.guessNumber.command),
      Markup.button.callback(commands.wordsGame.description, commands.wordsGame.command),
    ],
  ]))
})

bot.action(commands.menu.command, (ctx) => {
  ctx.answerCbQuery();
  ctx.reply("Чем займёмся сегодня?", inlineKeyboard)
})

bot.action(commands.randomPostLink.command, (ctx) => {
  const lastPostId = 2001;
  const randomNumber = Math.floor(Math.random() * (lastPostId - 1) + 1);

  ctx.answerCbQuery();
  ctx.reply(`https://t.me/expkart/${randomNumber}`, Markup.inlineKeyboard([
    [
      Markup.button.callback("Другая запись", commands.randomPostLink.command),
      Markup.button.callback("Меню", commands.menu.command)
    ]
  ]));
})

const games = {};

bot.action(commands.guessNumber.command, (ctx) => {
  const chatId = ctx.chat.id;
  games[chatId] = {
    targetNumber: Math.floor(Math.random() * 1000) + 1,
    attempts: 0
  };
  const maxNumber = 1000;

  ctx.reply(`Я загадала число от 1 до ${maxNumber}, а ты попробуй его угадать`);
})

bot.on('text', (ctx) => {
  const chatId = ctx.chat.id;
  const game = games[chatId];
  
  // Если игра не начата, игнорируем
  if (!game) return;
  
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
});

bot.action(commands.finishGame.command, (ctx) => {
  const chatId = ctx.chat.id;
  if (games[chatId]) {
      ctx.reply(`Я загадывала число ${games[chatId].targetNumber}. Приходи поиграть ещё!`);
      delete games[chatId];
  } else {
      ctx.reply("Сейчас нет активной игры, можешь начать новую", 
        Markup.inlineKeyboard([
          [Markup.button.callback(commands.games.description, commands.games.command)]
        ])
      );
  }
});

bot.launch()

// TODO: обработать неизвестные команды
// return bot.sendMessage(chatId, "Я такое пока не понимаю. Попробуй выбрать одну из существующих команд", commandsOptions);

export default async (req, res) => {
  try {
    const webhookUrl = 'https://mewster-bot.vercel.app';
    bot.telegram.setWebhook(webhookUrl)
      .then(() => console.log('Webhook установлен'))
      .catch(console.error);

    await bot.handleUpdate(req.body);
  } catch (err) {
      console.error('Error handling update:', err);
  }

  res.status(200);
};
