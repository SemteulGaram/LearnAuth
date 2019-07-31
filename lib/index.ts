import express from 'express';
const app = express();

// Import Routes
import routeAuth from './routes/auth';

// Routes Middleware
app.use('/api/user', routeAuth);

app.listen(3000, () => console.log('Server Up and running'));
