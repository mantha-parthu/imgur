const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const Image = require('./models/image');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('./middleware/async');
const ErrorResponse = require('./utils/errorResponse')


var app = express();
var PORT = 3000;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());  // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.listen(PORT,function(){
    console.log("Server listening to port::"+PORT);
});

const connetionUrl = "mongodb+srv://parthuimgur:siddu@imgurapp.x7agv.mongodb.net/imgur";

// Connecting to DB
mongoose.connect(connetionUrl, {useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
	console.log('connected to db')
}).catch((error) => {
	console.log(error)
})

//helloworld route mapping
app.get("/", function(req,res){
    res.send("Hello World");
})

//API for Images

//getting list of images
app.get('/api/images', function(req, res) {
	Image.find(function(err, images) {
		// if there is an error retrieving, send the error otherwise send data
		if (err)
			res.send(err)
		res.json(images); // return all images in JSON format
	});
});

//Getting Images by Id
app.get('/api/images/:id', (req, res) =>{
    Image.findOne({imageId: req.params.id }, function (err, images) {
        if (err){
            console.log(err)
        }
        else{
            res.json(images);
        }
    });
});



// create image and send back all images after creation
app.post('/api/images', function(req, res) {
	// create mongose method to create a new record into collection
	Image.create({
		imageName : req.body.imageName,
		imageId : req.body.imageId,
		views : req.body.views,
		likes : req.body.likes,
		comments : req.body.comments
	}, function(err, image) {
		if (err)
			res.send(err);
		// get and return all the images after newly created image record
		Image.find(function(err, images) {
			if (err)
				res.send(err)
			res.json(images);
		});
	}); 
});




// update image and send updated image after updation
app.put('/api/images/:id', function(req, res) {
    let image = {};
    if (req.body.imageId) image.imageId = req.body.imageId;
    if (req.body.imageName) image.imageName = req.body.imageName;
	if (req.body.views) image.views = req.body.views;
    if (req.body.likes) image.likes = req.body.likes;
	if (req.body.comments) image.comments = req.body.comments;

    image = { $set: image }

	// update the image
	Image.updateOne({imageId: req.params.id}, image).then(() => {
		res.send(image)
	}).catch((err) => {
		console.log(err)
	})
});

app.delete('/api/images/:id',function(req, res){
    Image.deleteOne({imageId: req.params.id}).then(() => {
		res.send('image deleted')
	}).catch((err) => {
		console.log(error)
	})

})

// APIS for USERS

//Get Users List
app.get('/api/users', function(req, res) {
	User.find(function(err, users) {
		// if there is an error retrieving, send the error otherwise send data
		if (err)
			res.send(err)
		res.json(users); // return all users in JSON format
	});
});

//Getting users by Id
app.get('/api/users/:id', (req, res) =>{
    User.findOne({userId: req.params.id }, function (err, users) {
        if (err){
            console.log(err)
        }
        else{
            res.json(users);
        }
    });
});



// create user and send back all users after creation
app.post('/api/users', function(req, res) {
	// create mongose method to create a new record into collection

	User.create({
		userId : req.body.userId,
		name : req.body.name,
		email : req.body.email,
		role : req.body.role,
		password: req.body.password,
		createdAt: Date.now()
	}, function(err, user) {
		if (err)
			res.send(err);
		// get and return all the users after newly created user record
		User.find(function(err, users) {
			if (err)
				res.send(err)
			res.json(users);
		});
	}); 
});




// update user and send back user after updation
app.put('/api/users/:id', function(req, res) {

    let user = {};

	if (req.body.userId) user.userId = req.body.userId;
    if (req.body.name) user.name = req.body.name;
	if (req.body.email) user.email = req.body.email;
    if (req.body.role) user.role = req.body.role;
	if (req.body.password) user.password = req.body.password;
    if (req.body.createdAt) user.createdAt = req.body.createdAt;

	
    user = { $set: user }

	// update the user
	User.updateOne({userId: req.params.id}, user).then(() => {
		res.send(user)
	}).catch((err) => {
		console.log(err)
	})
});

app.delete('/api/users/:id',function(req, res){
    User.deleteOne({userId: req.params.id}).then(() => {
		res.send('user deleted')
	}).catch((err) => {
		console.log(error)
	})
})


//API for USER Register and Authentication

// user registrtion 
app.post('/api/users/register',asyncHandler(async (req, res, next) => {
	const { userId,name, email, password, role } = req.body;
  
	// Create user
	const user = await User.create({
	  userId,	
	  name,
	  email,
	  password,
	  role
	});
  
	sendTokenResponse(user, 200, res);
  }));


//user login

app.post('/api/users/login',asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
  
	// Validate emil & password
	if (!email || !password) {
	  return next(new ErrorResponse('Please provide an email and password', 400));
	}
  
	// Check for user
	const user = await User.findOne({ email }).select('+password');
  
	if (!user) {
	  return next(new ErrorResponse('Invalid credentials', 401));
	}
  
	// Check if password matches
	const isMatch = await user.matchPassword(password);
  
	if (!isMatch) {
	  return next(new ErrorResponse('Invalid credentials', 401));
	}
  
	sendTokenResponse(user, 200, res);
  }));


const matchPassword = async function(enteredPassword,actualPassword) {
	return await bcrypt.compare(enteredPassword, actualPassword);
  };


  


// Get token from model and send response
const sendTokenResponse = (user, statusCode, res) => {
	// Create token
	const token = user.getSignedJwtToken(user._id);
  
	const options = {
	  expires: new Date(
		Date.now() + 30 * 24 * 60 * 60 * 1000
	  ),
	  httpOnly: true
	};
  
	res
	  .status(statusCode)
	  .json({
		success: true,
		token
	  });
  };


 const getSignedJwtToken = function(_id) {
	return jwt.sign({ id: this._id }, "asgjdhgdsjkskjadiuyamx", {
	  expiresIn: 30
	});
  };