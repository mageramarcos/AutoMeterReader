FROM node:20-bullseye-slim

# Set the working directory
WORKDIR /api

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN rm -rf node_modules
RUN npm i

# Command to run the application
CMD ["yarn", "start"]

# Expose the application port
EXPOSE 80