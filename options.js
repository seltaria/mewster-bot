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
            [{ text: "Закончить игру", callback_data: "/finish" }]
        ]
    })
}

export const goToMenuOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Меню", callback_data: "/menu" }]
        ]
    })
}

export const gamesOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Угадай число", callback_data: "/guessNumber" }],
            [{ text: "Игра в слова", callback_data: "/words" }],
        ]
    })
}

export const commandsOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Обо мне", callback_data: "/info" }],
            [{ text: "Играть", callback_data: "/games" }, { text: "Картинка дня", callback_data: "/meme" }],
            [{ text: "Что-то о птицах", callback_data: "/randomPost" }],
            [{ text: "Хочу такие же стикеры!", callback_data: "/stickers" }],
        ]
    })
}