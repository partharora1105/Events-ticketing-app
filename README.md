<h1>Events Ticketing App</h1>
This events ticketing app allows users to easily discover and attend events in their area, as well as host and manage their own events. It features a comprehensive list of events, a map view, and the ability to manage RSVPs and guest lists.
<h2>Setup</h2>
<ul>
	<li>Make sure to have the latest version of Node.js installed.</li>
	<li>If you don't have Node.Js ,<a href="https://nodejs.org/en/download/"> install Node.js </a> to ensure targets and npm commands work./li>
</ul>
<h2>Running</h2>

If you are a Mac/Linux user, you can run the setup make target through the below command:
```
make setup
```
If you are a Windows user, you need to run the two following commands in order:
```
cd client; npm install
cd server; npm install
```
### Running the Backend (Do this before running the React frontend!)
If you are a Mac/Linux user, you can run the backend with the below command:
```
make run-backend
```

If you are a Windows user, execute the following command:
```
cd server; DANGEROUSLY_DISABLE_HOST_CHECK=true npm run dev
```


### Running the Frontend
If you are a Mac/Linux user, you can run the frontend with the below command:
```
make run-frontend
```

If you are a Windows user, execute the following command:
```
cd client; DANGEROUSLY_DISABLE_HOST_CHECK=true npm start
```
<h2>Media</h2>
<p align="center">
  <img src="/github_images/img1.png">
  <br>Login Page
</p>
<p align="center">
  <img width='30%' src="/github_images/img2.png">
  <br>Student Dashboard
</p>
<p align="center">
  <img src="/github_images/img3.png">
  <br>Map View
</p>
