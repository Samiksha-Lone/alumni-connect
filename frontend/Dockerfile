FROM node:20-alpine

WORKDIR /app

ARG VITE_API_BASE
ARG VITE_API_URL
ENV VITE_API_BASE=${VITE_API_BASE}
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]