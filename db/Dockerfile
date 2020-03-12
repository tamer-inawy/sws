FROM bitnami/mariadb:10.3.22-debian-10-r38

LABEL maintainer="tamer.inawy@gmail.com"

# Add the database dump
ADD sws.sql /docker-entrypoint-initdb.d/

EXPOSE 3306

ENTRYPOINT [ "/entrypoint.sh" ]

CMD [ "/run.sh" ]
