FROM nginx:1-alpine

# The path inside the container _must not_ be changed because we
# overwrite the default config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
