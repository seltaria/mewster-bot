import { createCanvas, loadImage } from "canvas";
import { goToMenuOptions } from "../options.js";

export const getMeme = async (chatId, bot) => {
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
    return bot.sendPhoto(chatId, createdImage, goToMenuOptions);
}