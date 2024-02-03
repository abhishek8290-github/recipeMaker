const fs = require('fs');
const path = require('path');


const getLogDirectory = () => {
    const logsDirectory = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDirectory)) fs.mkdirSync(logsDirectory);
    return logsDirectory;
};
  
function log(logMessage, level = 'info') {
  
    const logFilePath = path.join(getLogDirectory(), 'app.log');
    const formattedLog = `[${level}]-[${new Date().toISOString()}] ${logMessage}\n`;

    console.log(formattedLog)
  
    fs.appendFile(logFilePath, formattedLog, (err) => {
      if (err) {
        console.error(`Error writing to log file: ${err}`);
      }
    });
  }


  module.exports = {
    log
  }