setup:
	cd client; npm install
	cd server; npm install

run-backend:
	cd server; npm run dev

run-frontend:
	cd client; DANGEROUSLY_DISABLE_HOST_CHECK=true npm start