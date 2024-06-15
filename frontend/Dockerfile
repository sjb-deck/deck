# frontend/Dockerfile

# Development stage
FROM node:22 as development

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

CMD ["npm", "run", "dev"]

# Build stage
FROM node:22 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine as production

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
