var express = require('express');
const faker = require('faker');

var app = express();
var port = 7000;
//var server=http.createServer(app);
//io=require('socket.io')(server);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/population', {useMongoClient: true});

var datetime = require('node-datetime');
var dt = datetime.create();

var nameSchema = new mongoose.Schema({
time :String,
gender :String,
firstName :String,
lastName :String,
age:Number,
status_of_person: String
}, {collection: 'live-data'});
var User = mongoose.model('users', nameSchema);

app.get('/',(req,res) => {
	res.sendFile(__dirname + "/Front_End.html");
});

app.get('/generate', (req, res) => {
   // setInterval(function insert(){

        var d = new Date();
		var n = d.toLocaleTimeString();

        let status = ['alive','deceased'];
		let genders= ['female','male'];
		let gender=faker.random.arrayElement(genders);
        let firstName = faker.name.firstName(),
        lastName = faker.name.lastName(),
        randomAge = Math.round(Math.random() * (90 - 1) + 1),
		status_of_person = faker.random.arrayElement(status)



var myData = new User({

time:n,
gender: gender,
firstName: firstName,
lastName:lastName,
age:randomAge,
status_of_person:status_of_person
});
    myData.save()
        .then(item => {
            //res.send("Saved to database");
			res.redirect('/update')
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        })

//},1000);
});

app.get('/update',(req,res)=>{
	console.log("Update");
  app.set('views',__dirname+'/views');
 app.set('view engine','ejs');  
 
 let child_male,child_female,teen_male,teen_female,child_female_deceased;
    
 
   User.find({})
   .then(users => {
	   
	   child_male_alive = users.filter(user => user.age < 13 && user.gender=='male' && user.status_of_person=='alive');
	   	   child_male_deceased = users.filter(user => user.age < 13 && user.gender=='male' && user.status_of_person=='deceased');
       
	   
       child_female_alive = users.filter(user => user.age <  13 && user.gender=='female' && user.status_of_person=='alive');
	          child_female_deceased = users.filter(user => user.age <  13 && user.gender=='female' && user.status_of_person=='deceased');

	   teen_male_alive=users.filter(user => user.age >= 13 && user.age<= 18 && user.gender=='male'&& user.status_of_person=='alive');
	   	   teen_male_deceased=users.filter(user => user.age >= 13 && user.age<= 18 && user.gender=='male'&& user.status_of_person=='deceased');

	   teen_female_alive=users.filter(user => user.age >= 13  &&user.age<= 18&& user.gender=='female'&& user.status_of_person=='alive');
	   	   teen_female_deceased=users.filter(user => user.age >= 13  &&user.age<= 18&& user.gender=='female'&& user.status_of_person=='deceased');

	   men_alive=users.filter(user => user.age > 18  &&user.age<= 60&& user.gender=='male'&& user.status_of_person=='alive');
	   	   men_deceased=users.filter(user => user.age > 18  &&user.age<= 60&& user.gender=='male'&& user.status_of_person=='deceased');

       women_alive=users.filter(user => user.age > 18  &&user.age<= 60&& user.gender=='female'&& user.status_of_person=='alive');
	          women_deceased=users.filter(user => user.age > 18  &&user.age<= 60&& user.gender=='female'&& user.status_of_person=='deceased');

	   adult_male_alive = users.filter(user => user.age > 60 && user.gender=='male' );
	   	   adult_male_deceased = users.filter(user => user.age > 60 && user.gender=='male' );

	   adult_female_alive = users.filter(user => user.age > 60 && user.gender=='female' );
	   	   adult_female_deceased = users.filter(user => user.age > 60 && user.gender=='female' );

	   
       total_population_alive= child_male_alive.length + child_female_alive.length + teen_male_alive.length + teen_female_alive.length + men_alive.length + women_alive.length + adult_male_alive.length + adult_female_alive.length;
              total_population_deceased= child_male_deceased.length + child_female_deceased.length + teen_male_deceased.length + teen_female_deceased.length + men_deceased.length + women_deceased.length + adult_male_deceased.length + adult_female_deceased.length;


   
      res.render('population_chart', {send_child_male_alive: child_male_alive.length, 
	  send_child_female_alive: child_female_alive.length, 
	  send_teen_male_alive: teen_male_alive.length,
	  send_teen_female_alive: teen_female_alive.length, 
	  send_men_alive:men_alive.length,
	  send_women_alive:women_alive.length,
	  send_adult_male_alive:adult_male_alive.length,
	  send_adult_female_alive:adult_female_alive.length,
	  send_total_population_alive:total_population_alive,
	  
	  send_child_male_deceased: child_male_deceased.length, 
	  send_child_female_deceased: child_female_deceased.length, 
	  send_teen_male_deceased: teen_male_deceased.length,
	  send_teen_female_deceased: teen_female_deceased.length, 
	  send_men_deceased:men_deceased.length,
	  send_women_deceased:women_deceased.length,
	  send_adult_male_deceased:adult_male_deceased.length,
	  send_adult_female_deceased:adult_female_deceased.length,
	  send_total_population_deceased:total_population_deceased
	  });

   })
   
    .catch(err => console.error(err));
		  //console.log(child_female_deceased);

});

app.post('/live',(req,res) => {
	console.log('live');
	res.redirect('/generate')
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});