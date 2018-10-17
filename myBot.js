const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
//const apiaiApp = require('apiai')("e4704a971f974666a5ca73df96390b94");

const PORT=process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/",(req,res)=>{
    res.status(200).send("Hello Brother. Donald Trump Speaking. How Can You Serve Me?")
});

app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'donald_trump') {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.status(403).end();
    }
});


app.post('/webhook', (req, res) => {
    console.log(req.body);
    if (req.body.object === 'page') {
        req.body.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                if (event.message && event.message.text) {
                    sendMessage(event);
                }
            });
        });
        res.status(200).end();
    }
});

function sendMessage(event) {
    let sender = event.sender.id;
    let text = event.message.text;

    request({
        url: 'https://graph.facebook.com/v3.0/me/messages',
        qs: {access_token: "EAADIGmJjLX4BAGOoaLLrZBWIa1uEAqS15IKDQbfslIpiyFZAlllDZBdLlmnfqR0CeYmaIfZAzObKXnbONL2bdZCFZBCvJv4NpuWiZCrASqv5eV3UupMCiw9iF4yvrChr5ftEFUsjZAPZBcdTJgDN5L1POlE0mARX1tSkRJ3EVMvdn0qaUvZAYj9HKh"},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: {text: text}
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}


/*

function sendMessage(event) {
    let sender = event.sender.id;
    let text = event.message.text;

    let apiai = apiaiApp.textRequest(text, {
        sessionId: 'donald_trump' // use any arbitrary id
    });

    apiai.on('response', (response) => {
        let aiText = response.result.fulfillment.speech;

        request({
            url: 'https://graph.facebook.com/v3.0/me/messages',
            qs: {access_token: "EAADIGmJjLX4BAGOoaLLrZBWIa1uEAqS15IKDQbfslIpiyFZAlllDZBdLlmnfqR0CeYmaIfZAzObKXnbONL2bdZCFZBCvJv4NpuWiZCrASqv5eV3UupMCiw9iF4yvrChr5ftEFUsjZAPZBcdTJgDN5L1POlE0mARX1tSkRJ3EVMvdn0qaUvZAYj9HKh"},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: {text: aiText}
            }
        }, (error, response) => {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    });

    apiai.on('error', (error) => {
        console.log(error);
    });

    apiai.end();
}

*/


app.listen(PORT, () => {
    console.log('Our BotApp is running on port %d in %s mode', "127.0.0.1:5000", app.settings.env);
});