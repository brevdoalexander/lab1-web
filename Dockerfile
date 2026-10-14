FROM nginx:stable-alpine
COPY index.html styles.css script.js /usr/share/nginx/html/