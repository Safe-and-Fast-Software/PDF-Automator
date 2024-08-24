FROM node:21
WORKDIR /app

# Install dependencies before copying the rest of the application code.
COPY ../package.json ./
COPY ../package-lock.json ./
RUN npm install

# Copy the rest of the application code.
COPY . .

# opening the port
EXPOSE 80

# # installing some tools for debugging
RUN apt-get update && apt-get install -y tree fzf net-tools lsof

# starting the app
CMD ["npm", "start"] 