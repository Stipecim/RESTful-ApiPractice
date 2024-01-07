const http = require('http');
const app = require('./app');

const port = process.env.port || 3000;

const server = http.createServer(app);


server.listen(port, (err)=> {
    console.log(`Server is running on port ${port}`);
});
