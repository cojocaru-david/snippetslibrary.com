FROM oven/bun:latest AS builder
WORKDIR /usr/local/app
COPY . /usr/local/app/

RUN bun install
RUN bun run build

FROM oven/bun:latest AS app_runner
WORKDIR /usr/local/app

COPY --from=builder /usr/local/app/server/dist ./server/dist
COPY --from=builder /usr/local/app/server/drizzle ./server/drizzle
COPY --from=builder /usr/local/app/server/src ./server/src
COPY --from=builder /usr/local/app/server/package.json ./server/package.json
COPY --from=builder /usr/local/app/shared ./shared
COPY --from=builder /usr/local/app/package.json ./package.json
COPY server/.env ./server/.env
COPY docker/bun/start.sh ./start.sh

RUN chmod +x ./start.sh
EXPOSE 3001

CMD ["/usr/local/app/start.sh"]

FROM oven/bun:latest AS frontend_copier
WORKDIR /usr/local/app

COPY --from=builder /usr/local/app/client/dist ./client/dist

CMD ["/bin/true"]
