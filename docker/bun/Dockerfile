FROM oven/bun:latest AS builder

WORKDIR /usr/local/app
COPY ./ /usr/local/app/

RUN bun install
RUN bun run build
FROM oven/bun:latest AS app_runner
WORKDIR /usr/local/app

COPY --from=builder /usr/local/app/server/dist /usr/local/app/server/dist
COPY --from=builder /usr/local/app/package.json /usr/local/app/package.json
COPY ./server/.env /usr/local/app/server/.env
COPY ./docker/bun/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 3001

CMD ["/start.sh"]

FROM oven/bun:latest AS frontend_copier
WORKDIR /usr/local/app
COPY --from=builder /usr/local/app/client/dist /usr/local/app/client/dist

CMD ["/bin/true"]
