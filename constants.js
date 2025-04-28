import { Markup } from "telegraf";

export const commands = {
  start: 
    { 
      command: "/start", 
      description: "Сначала" 
    },
  menu: 
    { 
      command: "/menu", 
      description: "Меню" 
    },
  info: 
    { 
      command: "/info", 
      description: "Информация" 
    },
  games: 
    { 
      command: "/games", 
      description: "Игры" 
    },
  guessNumber: 
    { 
      command: "/guessnum", 
      description: "Угадай число" 
    },
  wordsGame: 
    { 
      command: "/words", 
      description: "Играть в слова" 
    },
  finishGame: 
    { 
      command: "/finish", 
      description: "Закончить игру" 
    },
  memeOfTheDay: 
    { 
      command: "/meme", 
      description: "Картинка дня" 
    },
  randomPostLink: 
    { 
      command: "/randompost", 
      description: "Экспедиционный пост" 
    },
  stickersLink: 
    { 
      command: "/stickers", 
      description: "Ссылка на стикеры" 
    },
};

export const inlineKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('Обо мне', commands.info.command),
  ],
  [
    Markup.button.callback("Играть", commands.games.command),
    Markup.button.callback("Картинка дня", commands.memeOfTheDay.command),
  ],
  [
    Markup.button.callback("Что-то о птицах", commands.randomPostLink.command),
  ],
  [
    Markup.button.callback("Хочу такие же стикеры!", commands.stickersLink.command),
  ],
])