FROM node:13.12.0-alpine

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]