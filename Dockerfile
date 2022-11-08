FROM 172.34.120.87:9443/library/nginx:1.15.0
COPY ./dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf
ADD nginx.conf /etc/nginx/
