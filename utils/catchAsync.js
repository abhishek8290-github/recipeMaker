
  const parseHrtimeToSeconds = (hrtime) => (hrtime[0] + hrtime[1] / 1e9).toFixed(3);
  const logger = require('../middleware/logger');


  const handleAsync = (asyncFn) => async (req, res) => {
    const StartTime = process.hrtime();
    try {
      const result = await asyncFn(req);
      timeTaken =  parseHrtimeToSeconds(process.hrtime(StartTime))
      logger.log(timeTaken, req.url, 'Success', result)
      return resSuccess({
        data: result,res
      });
    } catch (err) {
      timeTaken =  parseHrtimeToSeconds(process.hrtime(StartTime))
      logger.log(timeTaken, req.url, err.stack.split('\n')[1], err.message)
      return resError({err,res,req, stackTrace : err.stack.split('\n')[1],
        timeTaken: parseHrtimeToSeconds(process.hrtime(StartTime)),
        route: req.url,
        statusCode: 200
      });
    }
  };



const resSuccess = async (resSuccessBody) => {
  let { data,res } = resSuccessBody;
  data.success = true;
  return res.json(data);
};


const resError = (resErrorBody) => {
  let { err, stackTrace, req, res, statusCode = 200, timeTaken } = resErrorBody;

  if (err.statusCode) statusCode = err.statusCode % 1000; // 3 digit status Code;

  res.status(statusCode);

  // res.setHeader('Content-Type', 'application/json');

  let message = err && err.message ? err.message : 'Something went wrong';

  if (typeof err == 'string') message = err;
  // restrict stackTrace with IP
  let response = { success: false, error: message, stackTrace: stackTrace };
  // logError(err, req, stackTrace, timeTaken, route,response,errorList[stackTrace]);
  return res.json(response);
};



  
module.exports = handleAsync;