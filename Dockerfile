# Select the base image using the FROM statement, use alpine linux running the latest version of node(lts)
FROM node:lts-alpine
# Make a folder for our application, all subsequent commands will be run here
WORKDIR /app
# Copy our source folder(left dot) into our /app folder(right dot)
COPY . .
# npm installing, only installing the dependencies we need for production
RUN npm install --only=production
# Build our client front end, building the environment for our NASA project step-by-step
RUN npm run build --prefix client
# By default, we will run commands as our main user, so for security and using the least privilege level necessary, change the user when running this container to node, which has less privileges
USER node
# When the container starts up... run npm start; we already built the client, so we only need to run the server
CMD [ "npm", "start", "--prefix", "server" ]
# Choose the port on which our application is running to make available outside of our container
EXPOSE 8000