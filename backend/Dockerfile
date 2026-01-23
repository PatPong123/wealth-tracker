# ===== Builder =====
FROM node:20-bullseye AS builder
WORKDIR /app

# Dummy DB just for prisma types
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Generate Prisma Client (types only, no real DB needed)
RUN npx prisma generate

COPY . .
RUN npm run build


# ===== Production =====
FROM node:20-bullseye
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Prisma will regenerate with REAL Supabase URL
CMD ["sh", "-c", "npx prisma generate && node dist/main.js"]
