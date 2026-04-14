const userLog = (req, res, next) => {
    console.log(`user log: ${req.method} ${req.url}`);
    next();
}

export default userLog;