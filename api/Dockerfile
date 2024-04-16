FROM node:14.19.3

LABEL version="1.0.0"

LABEL description="API RESTful - Teste Desenvolvedor Backend na PXGXX.AI"

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait

# Copy API
#RUN mkdir -p /home/node/pxgxx/api
COPY --chown=node:node . /home/node/pxgxx/api
WORKDIR /home/node/pxgxx/api

RUN npm install pm2 -g \
  && npm install -d

EXPOSE 3000

#CMD ["sh", "-c", "npm start"]
CMD ["sh", "-c", "/wait && npm run dev"]
