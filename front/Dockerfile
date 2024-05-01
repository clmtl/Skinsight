#FROM node as development
#
#WORKDIR /usr/src/app
#
#COPY package*.json ./
#
#RUN npm install -g pnpm@8.11.0
#
#RUN pnpm install
#
#COPY . .
#
#EXPOSE 5173
#
#CMD [ "pnpm", "run", "dev" ]

FROM node:18-alpine

#WORKDIR /app
#
#COPY package.json .
#
#RUN npm install
#
#COPY . .
#
#EXPOSE 8080
#
#CMD [ "npm", "run", "dev" ]

WORKDIR /src

ADD package.json /src

RUN npm i --silent

ADD . /src

RUN npm run build

CMD npm start