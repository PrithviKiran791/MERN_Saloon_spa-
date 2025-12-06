const jwt = require('jsonwebtoken');

const middleware = (req,res,next)=>{
    try {
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
        
    }
}

module.export = middleware;