# Dockerfile for FindItUnal Frontend (Vite + React)
# Use official Node.js image for build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install dependencies (prefer pnpm/yarn if lockfile exists)
RUN if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm install; fi

COPY . .

# Build-time args (pass these with --build-arg so Vite can embed them)
ARG VITE_API_URL
ARG VITE_GOOGLE_AUTH_URL
ARG VITE_PUERTO
ARG VITE_FRONTEND_URL

# Export as env so the build step sees them
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_GOOGLE_AUTH_URL=${VITE_GOOGLE_AUTH_URL}
ENV VITE_PUERTO=${VITE_PUERTO}
ENV VITE_FRONTEND_URL=${VITE_FRONTEND_URL}

# Build the app
RUN npm run build

# --- Production stage: serve with nginx ---
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
