FROM node:10

LABEL maintainer="tamer.inawy@gmail.com"

# Create the app directory
WORKDIR /usr/src/app

# # Copy the app source
# COPY . .

# # Install the dependancies
# RUN npm install
# # RUN npm ci --only=production

# Install the document generator
RUN npm i -g apidoc

# # Generate API documentations
# RUN apidoc -o public/docs -i app/modules

ENV NODE_ENV=develop

EXPOSE 3000
# CMD [ "node", "server.js" ]
CMD tail -f /dev/null
