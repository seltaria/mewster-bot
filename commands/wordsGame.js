import { Markup } from "telegraf";
import { commands, inlineKeyboard } from "../constants.js";
import { readFileSync } from "fs";
import path from 'path';
import process from "process";

export const handleWordsGame = (ctx, games) => {
  const chatId = ctx.chat.id;
  games[chatId] = { wordsGame: { words: new Set(), expectedLetter: null } };
  ctx.reply("Сыграем в слова? Нужно по очереди писать слово, которое начинается на последнюю букву предыдущего слова. Ты начинаешь",
    Markup.inlineKeyboard([
      [Markup.button.callback(commands.finishGame.description, commands.finishGame.command)]
    ])
  )
}

export const wordsGame = async (ctx, savedData) => {
  const text = ctx.text;

  let usersPath = path.join(process.cwd(), 'nouns.json');
  let rawData = readFileSync(usersPath);

  const data = await JSON.parse(rawData);
  
  const dict = Object.entries(data).reduce((acc, [letter, words]) => {
    acc[letter] = new Set(words);
    return acc;
  }, {})

  const formattedText = text.toLowerCase();
  const dictLetters = new Set(Object.keys(dict));

  if (text.length < 2) {
    return ctx.reply("В слове должно быть хотя бы две буквы");
  }
  if (savedData.words.has(formattedText)) {
    return ctx.reply("Это слово уже было, придумай другое");
  }

  const firstLetter = formattedText[0];

  if (savedData.expectedLetter && firstLetter !== savedData.expectedLetter) {
    return ctx.reply(`Слово должно начинаться на букву ${savedData.expectedLetter}`);
  }

  if (!dict[firstLetter] || dict[firstLetter] && !dict[firstLetter].has(formattedText)) {
    return ctx.reply("Я не знаю такого слова 😭, придумай другое, пожалуйста");
  }

  const getAvailableRandomWord = async () => {
    const lastLetter = dictLetters.has(formattedText.at(-1)) ? formattedText.at(-1) : formattedText.at(-2);
    if (!dictLetters.has(lastLetter)) {
      return ctx.reply(`Кажется, слов на букву "${lastLetter}" не существует или я их пока не знаю`);
    }

    const setOfWordsInDict = dict[lastLetter];
    const setOfAvailableWords = setOfWordsInDict.difference(savedData.words);
    const wordsArray = [...setOfAvailableWords];
    const availableRandomWord = wordsArray[Math.floor(Math.random() * setOfAvailableWords.size)];

    if (setOfAvailableWords.size === 0) {
      return ctx.reply(`У меня нет слов, ты победил ✨`, inlineKeyboard);
    }
    return availableRandomWord;
  }
  
  const randomWord = await getAvailableRandomWord();
  if (typeof randomWord === "string") {
    savedData.words.add(formattedText);
    savedData.words.add(randomWord);
    savedData.expectedLetter = dictLetters.has(randomWord.at(-1)) ? randomWord.at(-1) : randomWord.at(-2);
    return ctx.reply(randomWord, Markup.inlineKeyboard([
      [Markup.button.callback(commands.finishGame.description, commands.finishGame.command)]
    ]));
  }
}