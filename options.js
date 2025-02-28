import { commands } from "./constants.js";

export const numsOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "1", callback_data: 1 }, { text: "2", callback_data: 2 }, { text: "3", callback_data: 3 }],
            [{ text: "4", callback_data: 4 }, { text: "5", callback_data: 5 }, { text: "6", callback_data: 6 }],
            [{ text: "7", callback_data: 7 }, { text: "8", callback_data: 8 }, { text: "9", callback_data: 9 }],
            [{ text: "0", callback_data: 0 }]
        ]
    })
};

export const finishOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Закончить игру", callback_data: commands.finishGame.command }]
        ]
    })
}

export const goToMenuOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Меню", callback_data: commands.menu.command }]
        ]
    })
}

export const getAnotherPostLinkOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Другая запись", callback_data: commands.randomPostLink.command }],
            [{ text: "Меню", callback_data: commands.menu.command }]
        ]
    })
}

export const gamesOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: commands.guessNumber.description, callback_data: commands.guessNumber.command }],
            [{ text: commands.wordsGame.description, callback_data: commands.wordsGame.command }],
        ]
    })
}

export const commandsOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Обо мне", callback_data: commands.info.command }],
            [{ text: "Играть", callback_data: commands.games.command }, { text: "Картинка дня", callback_data: commands.memeOfTheDay.command }],
            [{ text: "Что-то о птицах", callback_data: commands.randomPostLink.command }],
            [{ text: "Хочу такие же стикеры!", callback_data: commands.stickersLink.command }],
        ]
    })
}