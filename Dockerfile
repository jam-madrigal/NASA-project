# Select the base image using the FROM statement, use alpine linux running the latest version of node(lts)
FROM node:lts-alpine
# Make a folder for our application, all subsequent commands will be run here
WORKDIR /app
# Copy our source folder(left dot) into our /app folder(right dot) -- updated to copy the package.json file into the root directory of /app, if you don't include ./ and use just ., it will think /app is actually just the package.json file and not the root directory. Include the * after package to wildcard what comes after "package" in the filename, so that package-lock is also included, as a best practice. However, sometimes different versions of operating systems or node can cause issues with this. If there are errors, try removing the *
COPY package*.json ./
# Copying the client side package.json, and because of our layer, the install-client command will only be ran if either of these package.json files change
# npm installing for the client, only installing the dependencies we need for production, normally it would install the server first, then the client, but we can break it apart using docker layers so that it only npm installs on the client side before building the client, then runs npm install on the server
COPY client/package*.json client/
RUN npm run install-client --only=production
# npm installing for the server, only installing the dependencies we need for production, only if the package.json changes
COPY server/package*.json server/
RUN npm run install-server --only=production
# Build our client front end, building the environment for our NASA project step-by-step, only if the source code for our client side changes
COPY client/ client/
RUN npm run build --prefix client
# By default, we will run commands as our main user, so for security and using the least privilege level necessary, change the user when running this container to node, which has less privileges, and only start our server if the server directory changes (copy)
COPY server/ server/
USER node
# When the container starts up... run npm start; we already built the client, so we only need to run the server
CMD [ "npm", "start", "--prefix", "server" ]
# Choose the port on which our application is running to make available outside of our container
EXPOSE 8000