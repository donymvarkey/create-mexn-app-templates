const fs = require('fs');

let healthC = fs.readFileSync('src/controllers/healthController.js', 'utf8');
healthC = healthC.replace('catchAsync(async (req, res, next) => {', 'catchAsync(async (req, res) => {');
fs.writeFileSync('src/controllers/healthController.js', healthC);

let gError = fs.readFileSync('src/middlewares/globalErrorHandler.js', 'utf8');
gError = gError.replace("import errorObject from '../utils/errorObject.js';\n\n", '');
fs.writeFileSync('src/middlewares/globalErrorHandler.js', gError);
