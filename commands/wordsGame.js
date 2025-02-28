import { finishOptions } from "../options.js";
import dictionary from "../assets/nouns.json" with { type: "json" };

export const onWordsCommand = (chats, chatId, bot) => {
    chats[chatId] = { words: [] };
    return bot.sendMessage(chatId, "Сыграем в слова? Нужно по очереди писать слово, которое начинается на последнюю букву предыдущего слова. Ты начинаешь", finishOptions);
}

export const wordsGame = (chats, chatId, text, bot) => {
    const dict = JSON.parse(JSON.stringify(dictionary));
    const formattedText = text.toLowerCase();

    const savedData = chats[chatId].words;

    if (text.length < 2) {
        return bot.sendMessage(chatId, "В слове должно быть хотя бы две буквы");
    }
    if (savedData.includes(formattedText)) {
        return bot.sendMessage(chatId, "Это слово уже было, придумай другое");
    }
    const previousWord = chats[chatId].words?.at(-1);
    if (previousWord && formattedText[0] !== previousWord.at(-1)) {
        return bot.sendMessage(chatId, `Слово должно начинаться на последнюю букву слова ${previousWord}`);
    }
    if (dict[formattedText[0]] && !dict[formattedText[0]].includes(formattedText)) {
        return bot.sendMessage(chatId, "Я не знаю такого слова 😭, придумай другое, пожалуйста");
    }
    
    let wordsByLetter = dict[formattedText.at(-1)] || [];

    if (!wordsByLetter.length) {
        const letter = formattedText.at(-2);
        wordsByLetter = dict[letter] || [];

        if (!wordsByLetter.length) {
            return bot.sendMessage(chatId, `Кажется, слов на букву "${letter}" не существует или я их пока не знаю`);
        }
    }

    // TODO: выбор случайного слова из слов, которые не называли,
    // иначе бот проигрывает, если не знает других слов
    const randomWord = wordsByLetter[Math.floor(Math.random() * wordsByLetter.length)];
    savedData.push(formattedText, randomWord);

    return bot.sendMessage(chatId, randomWord, finishOptions);
}