const app = require('./app');

const { get_mongo_client } = require('./db/conn');
const logger = require('./middleware/logger');

const db = get_mongo_client()

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    logger.log(`Listening to port ${PORT}`);
  });


const exitHandler = () => {
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };
  
const unexpectedErrorHandler = (error) => {
  logger.log(error)
  // exitHandler();
  };
  
  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);
  
  process.on('SIGTERM', () => {
    // logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
  



