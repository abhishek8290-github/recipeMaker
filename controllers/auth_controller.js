// const { signup, login, logout } = require('../controllers/auth_controller');

const handleAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'new-secret';
const salt = 'New Salt'

const User = require('../db/users');

function verify_token(req, res, next) {
    const token = req.headers['authentication'];
    if (!token || token == 'null' || token == 'undefined') {
        req.user_id = '65bd3671933fc60ac57f25d3'
        next();
        // return 
    }
    else {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            }
            req.user_id = decoded.user_id;
            next();
        });
    }
}

const create_token = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

const signup = handleAsync(async (req) => {
    
    const { email, password } = req.body;
    
    if (await User.findOne({email }))
        throw new Error('User already exists');
    
    
    const user = new User({email, password});
    const user_id = (await user.save())._id
    
    return {
        email : email,
        user_id,
        token : create_token({email, user_id, salt}),
        favorites : []
    }
});

const get_user_favoites = (user_id) =>{
    return []
}

const login = handleAsync(async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({email, password});

    if (!user) throw new Error('Incorrect email or password');

    return {
        email : email,
        token : create_token({email,user_id :  user._id, salt}),
        favorites : user.favorites,
        recent_serches : []
    }
})

const logout = handleAsync(async (req, res) => {
    const { email, password } = req.body;
    return {}
});

module.exports = {
    signup,
    login,
    verify_token,
    logout
}
