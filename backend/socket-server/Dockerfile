FROM node:20-alpine

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4040

CMD ["node", "main.js"]