FROM node:18
WORKDIR /app
COPY package*.json ./Dependencies
RUN npm install
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]