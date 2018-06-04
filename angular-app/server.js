// Express
const express = require('express');
const app = express();

// Path
const path = require('path');

const validator = require('validator');

// Static Directory
app.use(express.static(__dirname + '/dist'));

// Body Parser
const parser = require('body-parser');
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
const session = require('express-session');

const sessionConfig = {
  saveUninitialized: true,
  secret: "session-secret",
  resave: false,
  name: 'session',
  rolling: true,
  cookie: {
    secure: false,
    httpOnly: false,
    maxAge: 360000
  }
};

app.use(session(sessionConfig));
app.use(cookieParser('randomness'));


var bcrypt = require('bcrypt-as-promised');

const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/VirtualMarket');
mongoose.connection.on('connected', () => console.log('connected to MongoDB'));
mongoose.Promise = global.Promise;

const { Schema } = mongoose;

const userSchema = new Schema({
    user_id: {
        type: Number,
        required: [true, "must have id assigned"],
    },
    first_name: {
        type: String,
        trim: true,
        required: [true, 'first name is required'],
        minlength: [4, 'first name length must be greater than 4'],
    },
    last_name: {
        type: String,
        trim: true,
        required: [true, 'first name is required'],
        minlength: [4, 'first name length must be greater than 4'],
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'email is required'],
        minlength: [4, 'email length must be greater than 4'],
        unique: true,
        validate: {
          validator(value) {
            return validator.isEmail(value);
          }
        }
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'email is required'],
        minlength: [4, 'email length must be greater than 4'],
    },
}, {
    timestamps: true
});


userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt
    .hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(next);
});

userSchema.statics.validatePassword = function(
  candidatePassword,
  hashedPassword
) {
  console.log("validating password");
  return bcrypt.compare(candidatePassword, hashedPassword);
};

const User = mongoose.model('User', userSchema);

// - - - - = = = = Controller = = = = - - - -
const userController = {
    add_user: (request, response) => {
        bcrypt.hash(request.body.password, 10)
        .then(hashed_password => {
            var new_user = new User({
                user_id: request.body.user_id,
                first_name: request.body.first_name,
                last_name: request.body.last_name,
                email: request.body.email,
                password: hashed_password,
            });
            User.create(new_user)
                .then(user => {
                    console.log(user);
                    response.json(user);
                })
                .catch(error => console.log(error))
        })
    },
    get_user: (request, response) => {

    },
    get_users: (request, response) => {
      User.find({})
      .then(users => response.json(users))
      .catch(console.log);
    },
    login_user: (request, response) => {
        User.findOne({ email: request.body.email }, function (err, user) {
            if (err) {
                response.send('error logging in');
            }
            else {
                if (user != null) {
                    bcrypt.compare(request.body.password, user.password)
                        .then(success => {
                            response.json(user);
                        })
                        .catch(fail => {
                            response.send('error logging in: password');
                        })
                }
                else {
                    response.redirect("/");
                }
            }
        })
    }
}

const authController = {
  login(request, response) {
    console.log('login', request.body);

    User.findOne({ email: request.body.lemail })
    .then(user => {
      if(!user){
        console.log("No user");
        throw Error();
      }

      return User.validatePassword(request.body.lpassword, user.password).then(
        () => {
          // Login
          console.log("about to complete login");
          completeLogin(request, response, user);
        }
      )
    })
    .catch( () => {
      response
      .status(400)
      .json( { message: 'email/password not valid' });
    });
  },
  register(request, response) {
    console.log('reg', request.body);

    User.create(request.body)
      .then(user => {
        // send confirmation email
        // login
        completeLogin(request, response, user);
      })
      .catch(console.log);
  },
  logout(request, response) {
    console.log('logging out');

    request.session.destroy();

    response.clearCookie('userID');
    response.clearCookie('expiration');

    response.json(true);
  }
}

function completeLogin(request, response, user){
  request.session.user = user.toObject();
  delete request.session.user.password;

  response.cookie('userID', user._id.toString());
  response.cookie('expiration', Date.now() + 86400 * 1000);

  response.json(user);
}
// - - - - = = = = Routes = = = = - - - -
app
   .get('/all', userController.get_users)
   .get('/users', userController.get_user)
   .post('/users', userController.add_user)
   .post('/auth/login', authController.login)
   .post('/auth/register', authController.register)
   .delete('/auth/logout', authController.logout)
    .all("*", (req, res, next) => {
        res.sendFile(path.resolve("./dist/index.html"))
    });

// - - - - = = = = Server Listener = = = = - - - -
const port = 9200;
app.listen(port, () => console.log(`Express server listening on port ${port}`));
