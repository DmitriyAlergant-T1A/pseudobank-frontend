# Stage 1: Build the React app
FROM node:21-alpine as builder

# Set the working directory
WORKDIR /app

ARG REACT_APP_OPENAI_ENDPOINT_SUFFIX
ENV REACT_APP_OPENAI_ENDPOINT_SUFFIX=$REACT_APP_OPENAI_ENDPOINT_SUFFIX

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Setup the production environment
FROM node:21-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production --legacy-peer-deps

# Copy the build directory from the builder stage
COPY --from=builder /app/build ./build

# Copy backend files
COPY server.js ./
COPY backend ./backend

# Expose the port on which the app will run
EXPOSE 5500

# Start the server
CMD ["npm", "start"]
