# frontend/Dockerfile

# Development stage
FROM node:22 as development

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i

COPY . .

CMD ["npm", "run", "dev"]

# Production stage
FROM nginx:alpine as production

COPY dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
