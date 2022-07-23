# Проект "Збірник книжок"

У цьому проекті я вирішила зробити додаток, де можна зберігати книжки які хочеш прочитати.

На першому єтапі користувачу треба авторизуватись чи зареєструватись якщо це вперше.

Далі можна додати назву книжки та посилання яке потім перетворюємо.
Також маємо список усіх книжок, подивитися кількість відкривань та дату створення. Посилання можна видалити.

Користувач може змінювати свій пароль або згенерувати його.

# Запуск проекту
Для запуску проекту треба в терміналі ввести `npm run dev`. 
Він запускає серверну частину та клієнтську `npm run server`, `npm run client`.

# База даних
 Таблиця User
 
| **Дані** | **Тип даних**  |
|----------|----------------|
| email    | String         |
| password | String         |
| role     | String         |
| links    | Types.ObjectId |

Таблиця Link

| **Дані** | **Тип даних**  |
|----------|----------------|
| name     | String         |
| from     | String         |
| to       | String         |
| code     | String         |
| date     | Date           |
| clicks   | Number         |
| owner    | Types.ObjectId |