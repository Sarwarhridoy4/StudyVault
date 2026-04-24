import env from './config/env';
import connectDB from './config/db';
import app from './app';

const PORT: number = Number(env.PORT) || 5000;
let server: ReturnType<typeof app.listen>;

// Graceful shutdown handler
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  try {
    if (server) {
      server.close(() => {
        console.log('HTTP server closed.');
      });
    }
    
    const mongoose = await import('mongoose');
    if (mongoose.default.connection.readyState === 1) {
      await mongoose.default.connection.close();
      console.log('MongoDB connection closed.');
    }
    
    console.log('Graceful shutdown completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Signal handlers for graceful shutdown
process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => void gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error | any) => {
  console.error('UNHANDLED REJECTION! 💥');
  console.error('Reason:', reason);
  
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥');
  console.error(err.name, err.message);
  process.exit(1);
});

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    
    server = app.listen(PORT, () => {
      console.log(`✅ Server running in ${env.NODE_ENV} mode on port ${PORT}`);
      console.log(`🚀 API: http://localhost:${PORT}/api/v1`);
      console.log(`📊 Health: http://localhost:${PORT}/health`);
    });
    
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
      } else {
        console.error('❌ Server error:', error.message);
      }
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
