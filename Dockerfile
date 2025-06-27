# Multi-stage build for the complete application
FROM node:18-alpine as frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Rust WASM builder stage
FROM rust:1.70-alpine as wasm-builder

# Install required tools
RUN apk add --no-cache curl
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

WORKDIR /app/rust-wasm

# Copy Rust source
COPY rust-wasm/ .

# Build WASM module
RUN wasm-pack build --target web --out-dir ../src/wasm/pkg

# Final stage - Nginx to serve the application
FROM nginx:alpine

# Copy built frontend
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy WASM files
COPY --from=wasm-builder /app/src/wasm/pkg /usr/share/nginx/html/wasm

# Copy Python files
COPY public/python /usr/share/nginx/html/python

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]