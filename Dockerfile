# Stage 1: Используем официальный nginx для статических файлов
FROM nginx:alpine

# Устанавливаем рабочую директорию
WORKDIR /usr/share/nginx/html

# Удаляем стандартный контент Nginx
RUN rm -rf ./*

# Копируем проект в контейнер
COPY . .

# Экспонируем порт
EXPOSE 80

# Запуск nginx в foreground
CMD ["nginx", "-g", "daemon off;"]