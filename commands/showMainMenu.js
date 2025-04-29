import { inlineKeyboard } from "../constants.js";

export const showMainMenu = (ctx) => {
  ctx.answerCbQuery();
  ctx.reply("Чем займёмся сегодня?", inlineKeyboard)
}