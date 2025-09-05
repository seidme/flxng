
# STAGE 1: Build the Angular application
# Use Node 12 for compatibility with your Angular 9 app
FROM node:12-alpine as build-stage

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's build cache.
# npm install step will only be re-run if these files change.
# TODO: Comment out COPY and npm install commands for now completely....? (cn;t cuz it;s needed for the build?)
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code into the image's working directory.
# This ensures the build environment has all the necessary files.
COPY . .

# Build the Angular application for production
RUN npm run build-prod-limit-ram

# List the contents of the /app directory to verify the build output
# RUN ls -la /app

# STAGE 2: Serve the application with Nginx
FROM nginx:1.25.3-alpine as production-stage

# Copy the built application files from the previous stage to the Nginx serving directory
COPY --from=build-stage /app/dist/flxng /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# The default Nginx command is sufficient to start the web server
CMD ["nginx", "-g", "daemon off;"]