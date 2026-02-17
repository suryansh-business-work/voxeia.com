import app from './app';
import { envConfig } from './config';

const start = () => {
  try {
    app.listen(envConfig.PORT, () => {
      console.log(`Server running on http://localhost:${envConfig.PORT}`);
      console.log(`Environment: ${envConfig.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
