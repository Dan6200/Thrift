FROM node:18

# Create app dir
WORKDIR /usr/src/app

# Install Certbot
RUN apt-get update && \
    apt-get install -y certbot

COPY package.* ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
EXPOSE 1024
CMD [ "pnpm", "start" ]
