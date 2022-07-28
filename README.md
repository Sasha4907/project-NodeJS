# Проект "Збірник книжок"

У цьому проекті я вирішила зробити додаток, який відтворює домашню електронну бібліотеку.

На першому єтапі користувачу треба авторизуватись чи зареєструватись якщо це вперше.

Далі користувач може додати нову книжку до переліку ввівши її назву, посилання та категорію куди помістити.
Є три категорії книжок:
⋅⋅* Улюблені книжки
⋅⋅* Прочитати пізніше
⋅⋅* Прочитані

Читач може відслідковувати як часто він читає дану книжку, видалити її з переліку якщо набридне та переміщати прочитані книги до потрібної категорії.

# Tехнологічний стек

У даній роботі я використовувала стек MERN
⋅⋅* MongoDB
⋅⋅* Express
⋅⋅* ReactJS
⋅⋅* NodeJS

Вибір зупинився самена цьому стеку оскільки MERN є однією з популярних стеків технологій для створення додатків.

# Запуск проекту

Для запуску проекту треба в терміналі ввести `npm run dev`.
Він запускає серверну частину та клієнтську `npm run server`, `npm run client`.

# База даних

Таблиця User

| **Дані** | **Тип даних**  |
| -------- | -------------- |
| email    | String         |
| password | String         |
| role     | String         |
| links    | Types.ObjectId |

Таблиця Link

| **Дані** | **Тип даних**  |
| -------- | -------------- |
| name     | String         |
| from     | String         |
| to       | String         |
| code     | String         |
| date     | Date           |
| clicks   | Number         |
| owner    | Types.ObjectId |
