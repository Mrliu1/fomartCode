FROM nginx:1.11.8
COPY dist/ /usr/share/nginx/html/lims
COPY nginx.conf /etc/nginx/conf.d/default.conf
