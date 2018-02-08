var express = require("express"),
  app = express();

var port = process.env.PORT || 8080;


var prompt = require('prompt-sync')();
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var nodemailer = require('nodemailer');

const workspace_id_const_symptom = 'fc75b3ce-0dbf-4a59-858d-6e6808a6066c';

const workspace_id_const_lab = '2cdd9a48-7fd9-4426-8dd0-b6386873bd98';

var recipient = 'gargshubham49@gmail.com';

const doctorData = {
  "fever": {
    "gurgaon": [
      {
        "name": "Dr. Sehgal",
        "location": "371, Jwala Mill Rd, Electronic City, Udyog Vihar Phase IV, Sector 18, Gurugram, Haryana 122022"
      },
      {
        "name": "Dr. X",
        "location": "Plot No: 22A&B, Oswal buildings, Udyog Vihar, Sector 18, Sector 18, Gurugram, Haryana 122015"
      },
      {
        "name": "Dr. Pal",
        "location": "Maruti Udyog, Sector 18, Gurugram, Haryana 122022"
      }
    ],
    "udyog vihar": [
      {
        "name": "Dr. Sehgal",
        "location": "Sector 18, Sarhol, Haryana 122022"
      },
      {
        "name": "Dr. X",
        "location": "Maruti Udyog, Sector 18, Gurugram, Haryana 122022"
      },
      {
        "name": "Dr. Pal",
        "location": "371, Jwala Mill Rd, Electronic City, Udyog Vihar Phase IV, Sector 18, Gurugram, Haryana 122022"
      }
    ],
    "sector 21 gurgaon": [
      {
        "name": "Dr. Sehgal",
        "location": "371, Jwala Mill Rd, Electronic City, Udyog Vihar Phase IV, Sector 18, Gurugram, Haryana 122022"
      },
      {
        "name": "Dr. X",
        "location": "Maruti Udyog, Sector 18, Gurugram, Haryana 122022"
      },
      {
        "name": "Dr. Pal",
        "location": "Sector 18, Sarhol, Haryana 122022"
      }
    ]
  },
  "cold": {
    "gurgaon": [
      {
        "name": "Dr. Sham",
        "location": "371, Jwala Mill Rd, Electronic City, Udyog Vihar Phase IV, Sector 18, Gurugram, Haryana 122022"
      },
      {
        "name": "Dr. Neha",
        "location": "Maruti Udyog, Sector 18, Gurugram, Haryana 122022"
      }
    ],
    "udyog vihar": [
      {
        "name": "Dr. Sham",
        "location": "371, Jwala Mill Rd, Electronic City, Udyog Vihar Phase IV, Sector 18, Gurugram, Haryana 122022"
      },
      {
        "name": "Dr. Neha",
        "location": "Maruti Udyog, Sector 18, Gurugram, Haryana 122022"
      }
    ],
    "sector 21 gurgaon": [
      {
        "name": "Dr. Sham",
        "location": "371, Jwala Mill Rd, Electronic City, Udyog Vihar Phase IV, Sector 18, Gurugram, Haryana 122022"
      },
      {
        "name": "Dr. Neha",
        "location": "Maruti Udyog, Sector 18, Gurugram, Haryana 122022"
      }
    ]
  },
  "cough": {
    "gurgaon": [
      {
        "name": "Dr. Sham",
        "location": "371, Jwala Mill Rd, Electronic City, Udyog Vihar Phase IV, Sector 18, Gurugram, Haryana 122022"
      },
      {
        "name": "Dr. Neha",
        "location": "Maruti Udyog, Sector 18, Gurugram, Haryana 122022"
      }
    ],
    "udyog vihar": [
      {
        "name": "Dr. Sham",
        "location": "371, Jwala Mill Rd, Electronic City, Udyog Vihar Phase IV, Sector 18, Gurugram, Haryana 122022"
      },
      {
        "name": "Dr. Neha",
        "location": "Maruti Udyog, Sector 18, Gurugram, Haryana 122022"
      }
    ],
    "sector 21 gurgaon": [
      {
        "name": "Dr. Sham",
        "location": "371, Jwala Mill Rd, Electronic City, Udyog Vihar Phase IV, Sector 18, Gurugram, Haryana 122022"
      },
      {
        "name": "Dr. Neha",
        "location": "Maruti Udyog, Sector 18, Gurugram, Haryana 122022"
      }
    ]
  },
  "headache": {
    "gurgaon": [
      {
        "name": "Dr. Sham",
        "location": "371, Jwala Mill Rd, Electronic City, Udyog Vihar Phase IV, Sector 18, Gurugram, Haryana 122022"
      },
      {
        "name": "Dr. Neha",
        "location": "Maruti Udyog, Sector 18, Gurugram, Haryana 122022"
      }
    ],
    "udyog vihar": [
      {
        "name": "Dr. Sham",
        "location": "371, Jwala Mill Rd, Electronic City, Udyog Vihar Phase IV, Sector 18, Gurugram, Haryana 122022"
      },
      {
        "name": "Dr. Neha",
        "location": "Maruti Udyog, Sector 18, Gurugram, Haryana 122022"
      }
    ],
    "sector 21 gurgaon": [
      {
        "name": "Dr. Sham",
        "location": "371, Jwala Mill Rd, Electronic City, Udyog Vihar Phase IV, Sector 18, Gurugram, Haryana 122022"
      },
      {
        "name": "Dr. Neha",
        "location": "Maruti Udyog, Sector 18, Gurugram, Haryana 122022"
      }
    ]
  }
};

// Set up Conversation service wrapper.
var conversation = new ConversationV1({
  username: '46418516-4d68-4d0f-8334-e0ee0e97ffea', // replace with username from service key
  password: 'XmqcFN6DYWYC', // replace with password from service key
  version_date: '2016-07-11'
});

app.use(express.static(__dirname + '/public'));

var context;

app.get("/getResponse", function (request, response) {
  var bot = request.query.bot;
  var workspace_id_const = '';
  if (bot === 'lab') {
    workspace_id_const = workspace_id_const_lab;
  } else {
    workspace_id_const = workspace_id_const_symptom;
  }
  var input = request.query.input;
  console.log('user input.....' + input);
  if (input === '') {
    console.log('first input');
    conversation.message({ workspace_id: workspace_id_const }, function (err, data) {
      if (err) {
        console.error(err); // something went wrong
        return;
      }
      if (data.intents.length > 0) {
        console.log('Detected intent: #' + data.intents[0].intent);
      }
      if (data.output.text.length != 0) {
        context = data.context;
        console.log('response from bot...' + data.output.text[0]);
        var responseJson = { "response": data.output.text[0] };
        return response.send(responseJson);
      }

    });
  } else {

    conversation.message({
      workspace_id: workspace_id_const,
      input: { text: input },
      context: context,
    }, function (err, data) {
      if (err) {
        console.error(err); // something went wrong
        return;
      }
      if (data.intents.length > 0) {
        console.log('Detected intent: #' + data.intents[0].intent);
      }
      if (data.output.text.length != 0) {
        context = data.context;
        console.log('response from bot...' + data.output.text[0]);
        var responseJson = { "response": data.output.text[0] };
        if (data.output.action === 'showDoctors') {
          responseJson.doctors = doctorData[data.context.symptom][data.context.location];
          context.doctorsCount = responseJson.doctors.length;
        } else if (data.output.action === 'sendMailLab') {
          sendMail('Lab Test Appointment', 'Appointment for the lab test is booked. Please be on time.');
        } else if (data.output.action === 'sendMailSymptom') {
          sendMail('Symptom Driven Doctor Appointment', 'Appointment for the symptom diagnosis is booked. PLease be on time.');
        } else if (data.context.selectedDoctor) {
          context.doctor = doctorData[data.context.symptom][data.context.location][data.context.selectedDoctor - 1].name;
        }
        return response.send(responseJson);
      }

    });
  }

});

app.listen(port);
console.log("Listening on port ", port);

require("cf-deployment-tracker-client").track();

function sendMail(subject, body) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nagarro.jpr@gmail.com',
      pass: 'Mayank@#99'
    }
  });

  var mailOptions = {
    from: 'shubham.garg01@nagarro.com',
    //to: 'amit.saini@nagarro.com',
    to: recipient,
    subject: subject,
    text: body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// This is for getting and setting email address
app.get("/updateEmail", function (request, response) {
  const email = request.query.email;
  if (email) {
    recipient = email;
    response.send('');
  } else {
    response.send(recipient);
  }
});