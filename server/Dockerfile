FROM node:latest

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

# Wait for db
# Run migration

CMD ["npm", "run", "start:dev"]
