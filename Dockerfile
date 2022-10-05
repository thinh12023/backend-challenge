FROM node:14-alpine
# set working directory
WORKDIR /app

# Fix for heap limit allocation issue
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package*.json ./

RUN npm install

COPY . /app

CMD ["npm", "run", "start"]
