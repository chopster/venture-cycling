var express = require('express');
var stylus = require('stylus');
var nodemailer = require('nodemailer');
var server = express();

console.log(__dirname);

server.set('port', (process.env.PORT || 8080));
server.set('views', __dirname + '/views')
server.set('view engine', 'jade');

function generate_xml_sitemap() {
    // this is the source of the URLs on your site, in this case we use a simple array, actually it could come from the database
  var urls = ['', 'about', 'about/testimonials', 'services', 'services/learn-to-ride', 
  'services/balanceability','services/bikeability','services/ride-leading','services/dr-bike','services/schools-and-groups','booking/make-a-booking',
  'booking/pricing','contact','calendar','news'];
  // the root of your website - the protocol and the domain name with a trailing slash
  var root_path = 'http://www.venturecycling.co.uk/';
  // XML sitemap generation starts here
  var priority = 0.5;
  var freq = 'monthly';
  var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  for (var i in urls) {
      xml += '<url>';
      xml += '<loc>'+ root_path + urls[i] + '</loc>';
      xml += '<changefreq>'+ freq +'</changefreq>';
      xml += '<priority>'+ priority +'</priority>';
      xml += '</url>';
      i++;
  }
  xml += '</urlset>';
  return xml;
}

server.use(stylus.middleware({
    debug: true,
    src: __dirname + '/views',
    dest: __dirname + '/public'
  }));  
server.use(express.static(__dirname + '/public'));

server.get('/sitemap.xml', function(req, res) {
  var sitemap = generate_xml_sitemap(); // get the dynamically generated XML sitemap
  res.header('Content-Type', 'text/xml');
  res.send(sitemap);     
})

server.get('/', function (req, res) {
  res.render('index', {menu: 'Home'});
});

server.get('/about', function (req, res) {
  res.render('about/about', {menu: 'About'});
});

server.get('/about/testimonials', function (req, res) {
  res.render('about/testimonials', {menu: 'About', submenu: 'testimonials'});
});

server.get('/services', function (req, res) {
  res.render('services/services', {menu: 'Services'});
});

server.get('/services/learn-to-ride', function (req, res) {
  res.render('services/learn-to-ride', {menu: 'Services', submenu: 'learn-to-ride'});
});

server.get('/services/balanceability', function (req, res) {
  res.render('services/balanceability', {menu: 'Services', submenu: 'balanceability'});
});

server.get('/services/bikeability', function (req, res) {
  res.render('services/bikeability', {menu: 'Services', submenu: 'bikeability'});
});

server.get('/services/ride-leading', function (req, res) {
  res.render('services/ride-leading', {menu: 'Services', submenu: 'ride-leading'});
});

server.get('/services/dr-bike', function (req, res) {
  res.render('services/dr-bike', {menu: 'Services', submenu: 'dr-bike'});
});

server.get('/services/schools-and-groups', function (req, res) {
  res.render('services/schools-and-groups', {menu: 'Services', submenu: 'schools-and-groups'});
});

server.get('/news', function (req, res) {
  res.render('news', {menu: 'News', submenu: 'news'});
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

var transport = nodemailer.createTransport("SMTP", {
    service: 'gmail',
    auth: {
      XOAuth2: {
        user: 'venturecycling@gmail.com',
        clientId: '501911394985-mdfhlmue90pjtbhf7v1l5h9cjjns13ge.apps.googleusercontent.com',
        clientSecret: '2tJtyTiM1CwERPDd_bW5Rpkh',
        refreshToken: '1/FNp0XFG8rfjhbUrLIRKlUJubj7IWnnI-Mo6fs5CgGYM'
      }
    }
});


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
