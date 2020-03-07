FROM node:10

LABEL maintainer="tamer.inawy@gmail.com"

# Create the app directory
WORKDIR /usr/src/app

# Copy the app source
COPY . .

# RUN npm ci --only=production
# Install the dependancies
# Install the document generator
# Generate API documentations
RUN npm install \
  && npm i -g apidoc \
  && apidoc -o public/docs -i app/modules

ENV NODE_ENV=develop

EXPOSE 3000
CMD [ "node", "server.js" ]
