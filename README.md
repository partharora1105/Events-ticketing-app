# Events Ticketing App
This is the remote repository of Team React's campus discovery project for 2340. Below are instructions on how to setup and run the project

## Project setup (Installation of node modules and dependencies)
**Note: Make sure you are in the campus-discovery-project root directory before you execute any of the following commands**


Before setting up, make sure to have the latest version of Node.js installed. Without Node.js, the make targets and npm commands will not work.

If you are a Mac/Linux user, you can run the setup make target through the below command:
```
make setup
```

If you are a Windows user, you need to run the two following commands in order:
```
cd client; npm install
cd server; npm install
```

## Running the Backend (Do this before running the React frontend!)
If you are a Mac/Linux user, you can run the backend with the below command:
```
make run-backend
```

If you are a Windows user, execute the following command:
```
cd server; DANGEROUSLY_DISABLE_HOST_CHECK=true npm run dev
```


## Running the Frontend
If you are a Mac/Linux user, you can run the frontend with the below command:
```
make run-frontend
```

If you are a Windows user, execute the following command:
```
cd client; DANGEROUSLY_DISABLE_HOST_CHECK=true npm start
```
