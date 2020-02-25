FROM node:10

LABEL maintainer="tamer.inawy@gmail.com"

# Create the app directory
WORKDIR /usr/src/app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install the dependancies
# RUN npm install
# # RUN npm ci --only=production
RUN npm i -g apidoc

# # Copy the app source
# COPY . .

ENV NODE_ENV=develop

EXPOSE 3000
# CMD [ "node", "server.js" ]
CMD tail -f /dev/null
