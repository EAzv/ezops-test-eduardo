FROM node:latest

RUN mkdir -p /usr/src/app
COPY . /usr/src/app/
WORKDIR /usr/src/app/

RUN npm install
EXPOSE 3000

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && npm start