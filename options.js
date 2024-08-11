//Обробка команд та кнопок
bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === 'read_more') {
        const verse = await getRandomVerse(); // Отримуємо новий вірш з тієї ж глави
        return bot.sendMessage(chatId, verse);
    }
});
