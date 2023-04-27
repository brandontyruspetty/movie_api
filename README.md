## MyNoirMovies movie_api
 This is the RESTful API that handles HTTP requests and communicates with a MongoDB database of movie     and user data. 
 
 ## Key Features
 + JWT Authentication, password hashing, and secure user logins
 + Ability to view information about specific movies, genres and directors
 + Ability to create a user account with a username and password
 + Can view info about a user with proper credentials
 
 ## Tech Stack
 * HTML, CSS, JavaScript
 * MongoDB
 * Express
 * Node.js
 ## Deployments
This RESTful API is the communication layer for two frontend applications, one developed with React and one with Angular.

 + [myNoirMovies React Frontend](https://mynoirmovies.netlify.app)
 + [myNoirMovies Angular Frontend](https://brandontyruspetty.github.io/myNoirMovies-Angular-client/)

## Getting Started
### Prerequisites
1. Git installed globally
   - To install Git for MacOS run the following in the terminal:
   `$ git --version`
 2. Node Version Manager and Node.js installed globally
  - To download both Node.js and NPM it is advised to first download NVM
  - To download the latest version of NVM for Windows, click here:[https://github.com/coreybutler/nvm-windows/releases/lastest]
  - Then, in the repository, download and run the `nvm-setup.exe` file
  - To download the latest version of NVM for macOS, first install Homebrew by running the following in      the Terminal: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`
  - Then with Homebrew, run the following: 
  `brew install nvm`
  -With NVM installed, run the following `nvm install node`
  3. Express installed globally
      - Install by running `npm install express -g`
 ### Installation
 1. Clone the repo
  `git clone https://github.com/brandontyruspetty/movie_api.git
 ### Quick Start
 After installation..
 1. Start the Node server locally by running the following: `node run start`
 2. Now with [Postman](https://www.postman.com/downloads/) or similat API you can test the API endpoints found in the documentation
