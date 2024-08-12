
FROM node:22.6.0-alpine3.20

RUN addgroup app && adduser -S -G app app

USER app

WORKDIR /app

RUN mkdir data

COPY --chown=app:node package*.json ./

RUN npm install

COPY --chown=app:node . .

ENV Owner="Farshid Ahmadi"

EXPOSE 5075

CMD [ "npm" , "run" , "dev" ]