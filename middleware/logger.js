const logger = (req, res, next) =>
{
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`.bgWhite.black);
    next();
}

module.exports = logger;