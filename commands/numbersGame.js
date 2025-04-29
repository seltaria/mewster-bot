export const handleGuessNumber = (ctx, games) => {
  const chatId = ctx.chat.id;
  games[chatId] = {
    guessNum: {
      targetNumber: Math.floor(Math.random() * 1000) + 1,
      attempts: 0
    }
  };
  const maxNumber = 1000;

  ctx.reply(`Я загадала число от 1 до ${maxNumber}, а ты попробуй его угадать`);
}
