
   

    /* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new train - then update the html + update the database
// 3. Create a way to retrieve train from the train database.
// 4. Create a way to calculate the time to the next arrival of the train. Using difference between start and current time.
//    Then use moment.js formatting to set difference in minutes away.
// 5. Calculate Total billed

// 1. Initialize Firebase




// Initialize Firebase
var config = {
    apiKey: "AIzaSyBXMga17Rwwc2cttCZDUl_j7xI5bQ02UK8",
    authDomain: "train-scheduler-94090.firebaseapp.com",
    databaseURL: "https://train-scheduler-94090.firebaseio.com",
    projectId: "train-scheduler-94090",
    storageBucket: "",
    messagingSenderId: "876204281026"
};
firebase.initializeApp(config);



var database = firebase.database();

// 2. Button for adding train

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainFirstTrainTime = moment($("#start-input").val().trim(), "HH:mm").format("X");
    var trainFrequency =$("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrn = {
        name: trainName,
        destination: trainDestination,
        firstTrainTime: trainFirstTrainTime,
        frequency: trainFrequency
    };

    // Uploads train data to the database
    database.ref().push(newTrn);

    // Logs everything to console
    console.log(newTrn.name);
    console.log(newTrn.destination);
    console.log(newTrn.firstTrainTime);
    console.log(newTrn.frequency);

    // Alert
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFirstTrainTime = childSnapshot.val().firstTrainTime;
    var trainFrequency = childSnapshot.val().frequency;

    // Train Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainFirstTrainTime);
    console.log(trainFrequency);

    ///makes first train time neater
        var trainTime = moment.unix(trainFirstTrainTime).format("hh:mm");
        var firstTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
        console.log(firstTimeConverted);
		//calculate difference between times
        var difference =  moment().diff(moment(firstTimeConverted),"minutes");
        console.log("Difference in Time: " + difference);

		//time apart(remainder)
		var tRemainder = difference % trainFrequency;
        console.log(tRemainder);
		//minutes until arrival
        var tMinutesTillTrain = trainFrequency - tRemainder;
        console.log(tMinutesTillTrain);

		//Next Train Arrival Time
        var nextArrival = moment().add(tMinutesTillTrain, "minutes").format('hh:mm');
        console.log("Minutes Till Next Train: " + tMinutesTillTrain);
    // Add each train's data into the table
    
    $("tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextArrival + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});

