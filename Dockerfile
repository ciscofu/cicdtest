FROM node:10-alpine
EXPOSE 8080
WORKDIR /opt/app
COPY *.js ./
COPY package*.json ./
RUN npm install --no-cache --production
ENTRYPOINT [ "node", "index.js" ]
