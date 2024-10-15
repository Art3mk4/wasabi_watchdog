FROM node:22.9.0-alpine AS base
ENV PORT=80
ENV HOST=0.0.0.0

ENV NODE_ENV ${NODE_ENV}
ENV APP_KEY ${APP_KEY}
ENV LOG_LEVEL ${LOG_LEVEL}
ENV DB_HOST ${DB_HOST}
ENV DB_PORT ${DB_PORT}
ENV DB_USER ${DB_USER}
ENV DB_DATABASE ${DB_DATABASE}

WORKDIR /app
EXPOSE 80

# All deps stage
FROM base AS deps
ADD package.json package-lock.json ./
RUN npm ci

# Production only deps stage
FROM base AS production-deps
ADD package.json package-lock.json ./
RUN npm ci --omit=dev

# Build stage
FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN node ace build

# Production stage
FROM base
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
CMD ["node", "./bin/server.js"]
