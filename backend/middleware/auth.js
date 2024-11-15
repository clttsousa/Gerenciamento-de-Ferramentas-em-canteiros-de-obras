const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; 

    if (!token) {
        return res.sendStatus(403); 
    }

    jwt.verify(token, '102030', (err, user) => { 
        if (err) {
            return res.sendStatus(403); 
        }

        req.userId = user.userId; 
        console.log("User ID:", req.userId);
        next(); 
    });
};

module.exports = { authenticateJWT }; 