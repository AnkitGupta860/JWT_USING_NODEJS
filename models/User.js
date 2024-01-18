const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail , 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter an password'],
        minlength: [6, 'Length should be greater than 6'],
    }
})

// fire a function after doc saved to db
// userSchema.post('save', function(doc, next){
//     console.log('new user was created & saved', doc);
//     next();
// })


//fire a function before doc saved to db
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})


userSchema.statics.login = async function(email, password){
    // console.log("user",email,password);
    const user = await this.findOne({ email});
    // console.log("user",user);
    if(user) {
        const auth = await bcrypt.compare(password,user.password);
        // console.log("auth",auth);
        if(auth){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}



const User = mongoose.model('user',userSchema);

module.exports = User;