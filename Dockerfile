# Stage 1: Build the React Application
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Vite bakes these in at build time. Default to same-origin ('') so the
# browser calls the nginx-proxied /api/... path instead of a cross-origin
# gateway URL, and to disabling the mock-data fallback for real demos.
ARG VITE_API_BASE_URL=""
ARG VITE_USE_MOCK_FALLBACK=false
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_USE_MOCK_FALLBACK=$VITE_USE_MOCK_FALLBACK

# Build the application for production
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to handle client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]
