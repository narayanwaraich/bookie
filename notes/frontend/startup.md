# Login without password
    curl -X POST -H "Content-Type: application/json" -d '{"email":"YOUR_TEST_USER_EMAIL" "password":"password123"}' http://localhost:3000/api/trpc/auth.login

    localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjlkNzQ3OTFiLTQ2MzAtNDMzYy1iYmIwLTY5MmU0ZGM0ZWRmNCIsImVtYWlsIjoiRGV3YXluZV9Sb29iQGhvdG1haWwuY29tIiwidXNlcm5hbWUiOiJkZXdheW5lX3Jvb2IiLCJpYXQiOjE3NDY1NTk5NTMsImV4cCI6MTc0NjU2MzU1M30.aNt4C97lk8RouBkvrUZXfn1Z7NjWWJq05SEw89S3INI');

    disable isAuthenticated check in _authenticated route

# Start Redis server in Ubuntu
    sudo service redis-server start

# Login to psql CLI
    psql postgresql://postgres:Vancouver2023!@localhost:5432/bookie