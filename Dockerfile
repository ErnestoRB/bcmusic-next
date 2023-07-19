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
ARG NEXT_PUBLIC_RECAPTCHA_CLIENT
ENV NEXT_PUBLIC_RECAPTCHA_CLIENT=${NEXT_PUBLIC_RECAPTCHA_CLIENT}
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
ENV PORT=80
CMD npm start
