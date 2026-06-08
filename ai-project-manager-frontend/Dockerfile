# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve cu Nginx
FROM nginx:alpine
# Copiem configuratia Nginx personalizata (explicata mai jos)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ATENTIE: Daca folosesti Angular 17+ (standalone), output-ul implicit este de obicei "dist/<nume-proiect>/browser".
# Adapteaza calea daca e cazul. Daca ai o versiune mai veche, e doar "dist/<nume-proiect>".
COPY --from=build /app/dist/ai-project-manager-frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
