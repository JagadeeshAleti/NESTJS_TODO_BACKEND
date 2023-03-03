FROM node:16

# # Create app directory
WORKDIR /app

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# # Install app dependencies
RUN npm install

# # Bundle app source
COPY . .

# # Creates a "dist" folder with the production build
RUN npm run build

# # Start the server using the production build
CMD [ "node", "dist/main.js" ]

#Build Image -> docker build . -t <image_name?
#Run Image -> docker run -it <image_name> -p <localport>:<application port in docker>
#Exec image -> docker exec -it <image_name> /bin/sh