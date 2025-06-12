import app from './app.js';
import { PORT } from './config.js';
import { connectDB } from './lib/db.js';

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});