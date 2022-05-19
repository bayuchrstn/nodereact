const jwt =require("jsonwebtoken");

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    if(authHeader){
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.SECRET_KEY, (err, user) =>{
        if(err) {
            return res.sendStatus(403);
        }
        
        req.email = user.email;
        next();
    })
    } else {
        res.sendStatus(401);
    }
    
    
}

module.exports = {
  verifyToken
};