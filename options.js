// /* -- Опції для кнопок -- */

// module.exports = {

//   // кнопка "Перелік книг"
//   booksOptions: {
//     reply_markup: JSON.stringify({
//       inline_keyboard: [[{ text: "Перелік книг", callback_data: "/books" }]],
//     }),
//   },
// };

// /* module.exports = {
//     // Кнопки для вибору вірша (0-9)

//     booksOptions: {
//         reply_markup: JSON.stringify({
//             inline_keyboard: [
//                 [{ text: '1', callback_data: '1' }, { text: '2', callback_data: '2' }, { text: '3', callback_data: '3' }],
//                 [{ text: '4', callback_data: '4' }, { text: '5', callback_data: '5' }, { text: '6', callback_data: '6' }],
//                 [{ text: '7', callback_data: '7' }, { text: '8', callback_data: '8' }, { text: '9', callback_data: '9' }],
//                 [{ text: '0', callback_data: '0' }]
//             ]
//         })
//     },

//     // Кнопка "Обрати знов" для повторного вибору або отримання іншого вірша
//     againOptions: {
//         reply_markup: JSON.stringify({
//             inline_keyboard: [
//                 [{ text: 'Обрати знов', callback_data: '/again' }]
//             ]
//         })
//     }
// }; */

// // //Обробка команд та кнопок
// // bot.on('callback_query', async msg => {
// //     const data = msg.data;
// //     const chatId = msg.message.chat.id;

// //     if (data === 'read_more') {
// //         const verse = await getRandomVerse(); // Отримуємо новий вірш з тієї ж глави
// //         return bot.sendMessage(chatId, verse);
// //     }
// // });
