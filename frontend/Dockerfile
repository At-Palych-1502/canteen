FROM node:current-alpine3.23

WORKDIR /app

COPY package*.json .
RUN npm i

COPY . .
COPY .env.local .env
RUN rm .env.prod .env.local
RUN npm run build

CMD ["npm", "run", "start"]