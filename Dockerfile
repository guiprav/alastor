FROM node:8

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

EXPOSE 80
CMD npm start
