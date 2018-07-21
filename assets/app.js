// Global Variables
var trainName = ["Hudson Line", "Harlem Line", "New Haven Line", "Port Jervis", "Pascack Valley",""];
var trainDestination = ["Poughkeepsie", "White Plains", "Stamford", "Middletown", "Spring Valley", ""];
var trainTime = ["5:00", "5:30", "5:00", "5:00", "5:00", "" ];
var trainFrequency = ["30", "15", "15", "30", "30", ""];
var nextArrival = "";
var minutesAway = "";

// jQuery global variables
var elTrain = $("#train-name");
var elTrainDestination = $("#train-destination");
// form validation for Time using jQuery Mask plugin
var elTrainTime = $("#train-time").mask("00:00");
var elTimeFreq = $("#time-freq").mask("00");


var config = {
    apiKey: "AIzaSyDLzQ0vNacHdtppBph5WIW5GM6TFvbod9o",
    authDomain: "fir-project-46c3b.firebaseapp.com",
    databaseURL: "https://fir-project-46c3b.firebaseio.com",
    projectId: "fir-project-46c3b",
    storageBucket: "fir-project-46c3b.appspot.com",
    messagingSenderId: "272401155532"
  };
  firebase.initializeApp(config);

var database = firebase.database();

database.ref("/trains").on("child_added", function(snapshot) {

   
    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

    
    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    
    trainRemainder = trainDiff % frequency;

    
    minutesTillArrival = frequency - trainRemainder;

    
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    
    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();

    
    $("tr").hover(
        function() {
            $(this).find("span").show();
        },
        function() {
            $(this).find("span").hide();
        });

    
    $("#table-data").on("click", "tr span", function() {
        console.log(this);
        var trainRef = database.ref("/trains/");
        console.log(trainRef);
    });
});


var storeInputs = function(event) {
   
    event.preventDefault();

    // get & store input values
    trainName = elTrain.val().trim();
    trainDestination = elTrainDestination.val().trim();
    trainTime = moment(elTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = elTimeFreq.val().trim();

    // add to firebase databse
    database.ref("/trains").push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    
    alert("Train successuflly added!");

    
    elTrain.val("");
    elTrainDestination.val("");
    elTrainTime.val("");
    elTimeFreq.val("");
};

// Calls storeInputs function if submit button clicked
$("#btn-add").on("click", function(event) {
    // form validation - if empty - alert
    if (elTrain.val().length === 0 || elTrainDestination.val().length === 0 || elTrainTime.val().length === 0 || elTimeFreq === 0) {
        alert("Please complete all required fields");
    } else {
        // if form is filled out, run function
        storeInputs(event);
    }
});

// Calls storeInputs function if enter key is clicked
$('form').on("keypress", function(event) {
    if (event.which === 13) {
        // form validation - if empty - alert
        if (elTrain.val().length === 0 || elTrainDestination.val().length === 0 || elTrainTime.val().length === 0 || elTimeFreq === 0) {
            alert("Please complete all required fields");
        } else {
            // if form is filled out, run function
            storeInputs(event);
        }
    }
});