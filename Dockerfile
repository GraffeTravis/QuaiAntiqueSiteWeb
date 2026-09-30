FROM node:22-alpine AS frontend-assets

WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM nginx:1.30.5-alpine3.24-slim

RUN apk add --no-cache gettext

COPY index.html docker-config.js /usr/share/nginx/html/
COPY Router/ /usr/share/nginx/html/Router/
COPY js/ /usr/share/nginx/html/js/
COPY pages/ /usr/share/nginx/html/pages/
COPY images/ /usr/share/nginx/html/images/
COPY scss/main.css /usr/share/nginx/html/scss/main.css
COPY --from=frontend-assets /build/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js /usr/share/nginx/html/vendor/bootstrap.bundle.min.js
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/docker-config.js.template /usr/share/nginx/html/docker-config.js.template
COPY docker/40-runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
RUN chmod 755 /docker-entrypoint.d/40-runtime-config.sh
RUN sed -i 's#https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js#/vendor/bootstrap.bundle.min.js#' /usr/share/nginx/html/index.html

EXPOSE 8080
