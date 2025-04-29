import { inlineKeyboard } from "../constants.js";

export const showMainMenu = (ctx) => {
  ctx.reply("Чем займёмся сегодня?", inlineKeyboard)
}