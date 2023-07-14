FROM node:18-alpine
# Install canvas dependencies
RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    pango-dev \
    libtool \
    autoconf \
    automake
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

ENV PORT=80
CMD npm start
