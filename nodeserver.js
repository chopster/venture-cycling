var express = require('express');
var stylus = require('stylus');
var nodemailer = require('nodemailer');
var moment = require('moment');
var google = require('googleapis');
var smtpTransport = require('nodemailer-smtp-transport');
var adminuser = "admin";
var adminpass = "admin";
var tests = "localhost";
// var port   = 27017; 
// var dbName = "mydatabase";
// var mongodb          = require('mongodb');
// var mongoClient = mongodb.MongoClient;

// var connString = "mongodb://"+adminuser+":"+adminpass+"@"+tests+":"+port+"/"+dbName;
//     mongoClient.connect(connString, function(err, db) {
//     	console.log(err);
//         if(!err) {
//             console.log("\nMongo DB connected\n");                
//         }
//         else{
//             console.log("Mongo DB could not be connected");
//             process.exit(0);
//         }
//     });
 
var server = express();
console.log(__dirname);

server.set('port', (process.env.PORT || 8080));


server.set('views', __dirname + '/views')
server.set('view engine', 'jade');

server.use(stylus.middleware({
    debug: true,
    src: __dirname + '/views',
    dest: __dirname + '/public'
  }));  
  server.use(express.static(__dirname + '/public'));

server.get('/', function (req, res) {
  res.render('index', {menu: 'Home'});
});

server.get('/about', function (req, res) {
  res.render('about', {menu: 'About'});
});

server.get('/services', function (req, res) {
  res.render('services/services', {menu: 'Services'});
});

server.get('/services/adult-lessons', function (req, res) {
  res.render('services/adult-lessons', {menu: 'Services', submenu: 'adult-lessons'});
});

server.get('/services/childrens-lessons', function (req, res) {
  res.render('services/childrens-lessons', {menu: 'Services', submenu: 'childrens-lessons'});
});

server.get('/services/group-lessons', function (req, res) {
  res.render('services/group-lessons', {menu: 'Services', submenu: 'group-lessons'});
});

server.get('/services/ride-leading', function (req, res) {
  res.render('services/ride-leading', {menu: 'Services', submenu: 'ride-leading'});
});

server.get('/services/dr-bike', function (req, res) {
  res.render('services/dr-bike', {menu: 'Services', submenu: 'dr-bike'});
});

server.get('/booking/pricing', function (req, res) {
  res.render('booking/pricing', {menu: 'Booking', submenu: 'pricing'});
});

server.get('/booking/make-a-booking', function (req, res) {
  res.render('booking/make-a-booking', {menu: 'Booking', submenu: 'make-a-booking'});
});

server.get('/calendar', function (req, res) {
  res.render('calendar');
});

server.get('/contact', function (req, res) {
  res.render('contact', {menu: 'Contact'});
});


var transport = nodemailer.createTransport(smtpTransport({
	service: "gmail",
	auth: {
		user: "venturecycling@gmail.com",
		pass: "rheannon3"
	}
}));

 // XOAuth2: {
 //        user: "kelly.koya@gmail.com",
 //        pass: "rheannon3",
 //        clientId: '501911394985-etgq1sbcco7j30cdf0b91844mqdk36ts.apps.googleusercontent.com',
 //        clientSecret: 'fzlAn7nPv3c6SKPwYS9dLj73'
 //      }



server.get('/booking-email', function (req, res) {
  var mailOpts = {
    to: 'kelly@venturecycling.co.uk', // list of receivers. This is whoever you want to get the email when someone hits submit
    subject: 'Venture Cycling - booking', // Subject line
    html: '<p>Email: ' + '<a href="mailto:' + req.query.from + '?Subject=Venture Cycling - Booking&body=Hi ' + req.query.name + ',' + '%0D%0A%0D%0AThank you for your booking enquiry,"' +'>' + req.query.from + '</a></p>' +
    			'<p>Name: ' + req.query.name + '</p>' + 
    			'<p>Number: ' + req.query.number + '</p>' + 
    			'<p>Location: ' + req.query.location + '</p>' +
    			'<p>DOB: ' + req.query.dob + '</p>' +
    			'<p>Message: ' + req.query.message + '</p>' 

  };

  transport.sendMail(mailOpts, function(error, response){
		if(error){
			console.log(error);
			res.end("error");
		}
		else{
			console.log("Message sent: " + response.message);
			res.end("sent");
		}
	});
});

server.get('/contact-email', function (req, res) {
  var mailOpts = {
    to: 'kelly@venturecycling.co.uk', // list of receivers. This is whoever you want to get the email when someone hits submit
    subject: 'Venture Cycling - contact', // Subject line
    html: '<p>Email: ' + '<a href="mailto:' + req.query.from + '?Subject=Venture Cycling - contact&body=Hi ' + req.query.name + ',' + '%0D%0A%0D%0AThank you for your enquiry,"' +'>' + req.query.from + '</a></p>' +
          '<p>Name: ' + req.query.name + '</p>' + 
          '<p>Number: ' + req.query.number + '</p>' + 
          '<p>Message: ' + req.query.message + '</p>' 

  };

  transport.sendMail(mailOpts, function(error, response){
    if(error){
      console.log(error);
      res.end("error");
    }
    else{
      console.log("Message sent: " + response.message);
      res.end("sent");
    }
  });
});




server.listen(server.get('port'), function() {
  console.log('Node app is running on port', server.get('port'));
});
