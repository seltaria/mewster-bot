import { createCanvas, loadImage, registerFont } from "canvas";
import dotenv from 'dotenv';
import process from "process";
import path from 'path';

dotenv.config();

export const getMeme = async (botCtx) => {
  const todayDate = new Date().toLocaleDateString("ru-RU");
  const currentYear = new Date().getFullYear();

  const canvas = createCanvas(400, 600)
  const ctx = canvas.getContext('2d')

  const imgUrl = 'https://i.imgflip.com/8hvoej.jpg?a483408';

  await loadImage(imgUrl).then((image) => {
    ctx.drawImage(image, 0, 0, 400, 600)
  })

  registerFont(path.join(process.cwd(), 'assets/fonts/Montserrat.ttf'), { family: 'Montserrat' });

  ctx.font = "30px Montserrat";
  ctx.fillText(`01.01.${currentYear}`, 220, 100);
  ctx.fillText(todayDate, 220, 500);

  const createdImage = canvas.toBuffer("image/jpeg");

  botCtx.answerCbQuery();
  await botCtx.replyWithPhoto({ source: createdImage })
}