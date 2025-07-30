FROM nginx:latest
WORKDIR /etc/nginx/ 
COPY ./docker/nginx/nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
