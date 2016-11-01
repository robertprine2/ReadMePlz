// requires express and body-parser
var express = require('express');
var bodyParser = require('body-parser');
var Slack = require('slack-node');

webhookUri = "https://hooks.slack.com/services/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";
 
slack = new Slack();
slack.setWebhook(webhookUri);
 


//requiring and setting up mongo database/collections
var mongojs = require('mongojs');
var databaseUrl = "ReadMePlz";
var collections = ["slackChannels"];

// creates a databse in mongo called scrape with two collections: articles and comments
var db = mongojs(databaseUrl, collections);

// lets us know if there is an error with the database if it doesn't turn on
db.on('error', function(err) {
	console.log('Database Error: ', err);
});

// creating an instance of express
var app = express();

// assigning the port or using the PORT environment variable
var PORT = process.env.PORT || 3000; 

// makes static content in assets accessible
app.use(express.static(__dirname + '/public'));	

//**** NOT SURE IF I NEED THESE WITH THE ONES BELOW
// // BodyParser interprets data sent to the server
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(require('body-parser').urlencoded({ extended: true }));

// Define routes.
app.get('/',  function(req, res) {
  
    res.sendFile(__dirname + '/public/views/index.html');

});

app.post('/survey', function(req, res) {
    var userName = req.body.user_name;
    var wutUSay = req.body.text;
    console.log("this is the req" + req);
    console.log("this is the res" + res);
    var payload={"text": "This is a line of text in a channel.\nAnd this is what you said: " + wutUSay}

    if (userName !== 'slackbot') {
        return res.status(200).json(payload);
    }
    else {
        return res.status(200).end();
    }
    // slack.webhook({
    //     channel: "#general",
    //     username: "webhookbot",
    //     text: "This is posted to #general and comes from a bot named webhookbot."
    // }, function(err, response) {
    //     console.log(response);
    // });

    // res.send({
    //     "text": "nameOfSurvey",
    //     "title_link": "linkToGraph",
    //     // might have to be just one line of text
    //     // "text": "Read and confirmed: name1, name2\nNotread or confirmed: name1, name2"
    //     "text": {
    //         "Read and confirmed": ["name1", "name2"],
    //         "Not read or confirmed": ["name1", "name2"]   
    //     },
    //     "attachments": [
    //     {
    //         "text": "Read and confirmed: name1, name2\nNotread or confirmed: name1, name2" 
    //     }]
    // });

});

//starts the server letting user know the PORT
app.listen(PORT, function(){

	console.log("listening on port %d", PORT);

}); // end of app.listen