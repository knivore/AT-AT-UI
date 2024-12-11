# Use official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Next.js app code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port the Next.js app runs on
EXPOSE 3000

# Command to start the app on 0.0.0.0
CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0"]
#CMD ["npm", "run", "start"]
