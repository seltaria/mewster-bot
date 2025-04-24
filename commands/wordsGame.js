import { finishOptions, goToMenuOptions } from "../options.js";
import dictionary from "../assets/nouns.json" with { type: "json" };

export const onWordsCommand = (chats, chatId, bot) => {
    chats[chatId] = { wordGame: { words: new Set(), expectedLetter: null } };
    return bot.sendMessage(chatId, "Сыграем в слова? Нужно по очереди писать слово, которое начинается на последнюю букву предыдущего слова. Ты начинаешь", finishOptions);
}

export const wordsGame = async (chats, chatId, text, bot) => {
    const data = JSON.parse(JSON.stringify(dictionary));
    const dict = Object.entries(data).reduce((acc, [letter, words]) => {
        acc[letter] = new Set(words);
        return acc;
    }, {})
    
    const formattedText = text.toLowerCase();
    const dictLetters = new Set(Object.keys(dict));

    const savedData = chats[chatId].wordGame;

    if (text.length < 2) {
        return bot.sendMessage(chatId, "В слове должно быть хотя бы две буквы");
    }
    if (savedData.words.has(formattedText)) {
        return bot.sendMessage(chatId, "Это слово уже было, придумай другое");
    }

    const firstLetter = formattedText[0];

    if (savedData.expectedLetter && firstLetter !== savedData.expectedLetter) {
        return bot.sendMessage(chatId, `Слово должно начинаться на букву ${savedData.expectedLetter}`);
    }

    if (!dict[firstLetter] || dict[firstLetter] && !dict[firstLetter].has(formattedText)) {
        return bot.sendMessage(chatId, "Я не знаю такого слова 😭, придумай другое, пожалуйста");
    }

    const getAvailableRandomWord = async () => {
        const lastLetter = dictLetters.has(formattedText.at(-1)) ? formattedText.at(-1) : formattedText.at(-2);
        if (!dictLetters.has(lastLetter)) {
            return bot.sendMessage(chatId, `Кажется, слов на букву "${lastLetter}" не существует или я их пока не знаю`);
        }

        const setOfWordsInDict = dict[lastLetter];
        const setOfAvailableWords = setOfWordsInDict.difference(savedData.words);
        const wordsArray = [...setOfAvailableWords];
        const availableRandomWord = wordsArray[Math.floor(Math.random() * setOfAvailableWords.size)];

        if (setOfAvailableWords.size === 0) {
            return bot.sendMessage(chatId, `У меня нет слов, ты победил ✨`, goToMenuOptions);
        }
        return availableRandomWord;
    }
    
    const randomWord = await getAvailableRandomWord();
    if (typeof randomWord === "string") {
        savedData.words.add(formattedText);
        savedData.words.add(randomWord);
        savedData.expectedLetter = dictLetters.has(randomWord.at(-1)) ? randomWord.at(-1) : randomWord.at(-2);
        return bot.sendMessage(chatId, randomWord, finishOptions);
    }
}