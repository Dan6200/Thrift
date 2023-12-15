FROM node:18.15

# Create app dir
WORKDIR /usr/src/app

COPY package.* ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 1024
CMD [ "pnpm", "start" ]
