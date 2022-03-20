# NASA-SpaceX Mission Control
---

# Table of contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Tests](#tests)
- [Contributing](#Contributing)
- [Questions](#questions)


# Description
Built using node, express, mongodb/mongoose, docker, AWS, react, axios, dotenv, and diagrammed using lucidchart. Tests written using jest. Frontend provided with the help of [arwes](https://github.com/arwes/arwes) and ZTM. 

https://user-images.githubusercontent.com/65047802/156988568-0e9a6379-aef7-4cd0-b977-050b130a1860.mp4

![Screenshot-of-application-diagram](https://user-images.githubusercontent.com/65047802/156988573-3441d483-72d4-4b9d-95d6-31794a17d8f8.png)

# Usage
An application to simulate scheudling space launch missions to potentially habitable planets, based on Kepler space telescope data and using SpaceX's publc launch data to populate example flights. Built to practice enterprise-level node application devleopment and REST API development.

# Installation
Clone this repository, open git bash or terminal in the directory and run npm install. Subsequent npm installs must be run in the /server and /client directories. The application can then be started by running "npm run deploy" to freshly build the react app and ensure cooperation between the front and backend. Unless changes are made to the front end in /client, the application can subsequently be ran by running npm run server while in the root directory. By default the application will be served on **localhost:8000** and can be accessed by typing this address into the web browser.

- Users cloning this repository will need to connect to their own mongo database for this application by supplying a mongodb URL in /server/src/services/mongo.js for the application to run correctly.

# License
This application is not licensed.

# Tests
- Jest tests can be ran from the root directory and running npm run test and are located in /server/src/launches/launches.test.js

# Contributing
Feel free to fork the repository and edit it as you wish for your own fun. This project was only made for personal practice.

# Questions
Any and all inquiry can be done through github.

## Creator information
---
Github profile: https://github.com/jam-madrigal 

Contact email: alex@amagicaldev.com








