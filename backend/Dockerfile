FROM node:14-buster AS builder

EXPOSE 3030
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# TODO: Actual two-stage build

FROM builder

ENV NODE_ENV=production
CMD ["node", "./build/server.js"]
