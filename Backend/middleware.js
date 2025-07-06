const logger = (req, res, next) => {
    console.log(req.method, req.path, req.query, req.body);
    next();
}

module.exports = {logger};