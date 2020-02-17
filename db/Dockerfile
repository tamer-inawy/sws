FROM bitnami/mariadb:latest

LABEL maintainer="tamer.inawy@gmail.com"

# RUN deluser mysql \
#     && useradd mysql \
#     && mkdir -p /Users/me/docker/mysql/data \
#     && chmod -R 777 /Users/me/docker/mysql/data

# # Add the database dump
ADD sws.sql /docker-entrypoint-initdb.d/

# EXPOSE 3306

CMD ["mysqld", "--default-authentication-plugin=mysql_native_password"]
