FROM node:16.15.1-alpine

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY . .

RUN npm ci

RUN npm run build


CMD [ "npm", "start" ]
