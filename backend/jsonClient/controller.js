var serviceHandlerURL = "../backend/serviceHandler.php";

// Loading JQuery
$(document).ready(function () {
    loadAllTasks();

    $("#btnSearchById").click(function () {
        $("#appointmentTbody").html("");
        loadAppointmentById($("#txtSearchField").val());
    });

    $("#btnRefreshTasks").click(function () {
        $("#appointmentTbody").html("");
        loadAllTasks();
    });

    $("#btnSearchByName").click(function () {
        $("#appointmentTbody").html("");
        loadTaskByName($("#txtSearchField").val());
    });

    $("#btnRefresh").click(function () {
        $("#appointmentTbody").html("");
        loadAllTasks();
    });

    $("#btnNewAppointment").click(function () {
        // Add new appointment pack every parameter in an array
        var appointmentDate = $("#txtAppointmentDate").val();
        var startTime = $("#txtStartTime").val();
        var endTime = $("#txtEndTime").val();
        var location = $("#txtLocation").val();
        var subject = $("#txtSubject").val();
        var expiryVotingDate = $("#txtExpiryVotingDate").val();
        var expiryVotingTime = $("#txtExpiryVotingTime").val();
        var username = $("#txtUsername").val();

        addAppointment(
            appointmentDate,
            startTime,
            endTime,
            location,
            subject,
            expiryVotingDate,
            expiryVotingTime,
            username
        );

        //loadAllTasks();
    });
});

// Functions handling button input
function showDetails(entry) {
    // Get appointmentId & show details in a card
    var appointmentId = entry.getAttribute("appointment-id");
    $("#detailsAppointmentCard").show();

    loadDetailsById(appointmentId);
    loadTimeslotsById(appointmentId);
}

function deleteAppointment(entry) {
    // Get appointmentId & delete appointment if username = username of creator
    var appointmentId = entry.getAttribute("appointment-id");
    deleteAppointmentById(appointmentId);
}

function selectTimeslot() {
    var tblDetails = document.getElementById("detailsTable");
    var boxes = tblDetails.getElementsByTagName("INPUT");
    var appointmentId = $("#txtDetailsAppointmentId").val();
    var timeslotId = 0;
    var comment = $("#txtVoteComment").val();
    var username = $("#txtUsername").val();

    if (comment == "") {
        comment = "/";
    }

    for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].checked) {
            timeslotId = boxes[i].getAttribute("timeslot-id");
            updateTimeslotById(timeslotId, username, comment);
        }
    }

    loadTimeslotsById(appointmentId);

    $("#txtVoteComment").val("");
}

// Functions for handling data received by ajax calls
function reloadDetails(response) {
    var item = response[0];

    $("#txtDetailsAppointmentId").val(item.appointmentId);
    $("#txtDetailsAppointmentDate").val(item.appointmentDate);
    $("#txtDetailsStartTime").val(item.appointmentStartTime);
    $("#txtDetailsEndTime").val(item.appointmentEndTime);
    $("#txtDetailsLocation").val(item.location);
    $("#txtDetailsSubject").val(item.subject);
    $("#txtDetailsExpiryDate").val(item.votingExpiryDate);
    $("#txtDetailsExpiryTime").val(item.votingExpiryTime);
}

function reloadTimeslots(response) {
    $("#detailsTbody").empty();

    // Compare dates if voting date is expired lock boxes and display message
    var expiryDate =
        $("#txtDetailsExpiryDate").val() +
        "T" +
        $("#txtDetailsExpiryTime").val();

    var expiryDateCast = new Date(expiryDate);
    var currentDate = new Date();
    var expired = false;

    if (expiryDateCast.getTime() < currentDate.getTime()) {
        expired = true;

        $("#votingArea").hide();
    }

    $.each(response, function (i, item) {
        var checkBoxVote = document.createElement("input");

        checkBoxVote.className = "form-check-input";
        checkBoxVote.type = "checkbox";
        checkBoxVote.id = "checkBoxAppointment";
        checkBoxVote.setAttribute("timeslot-id", item.timeslotId);

        if (item.username != "/" || expired) {
            checkBoxVote.disabled = "disabled";
        }

        // Show basic information about the appointment
        var $tr = $("<tr>")
            .append(
                $("<td>").append(checkBoxVote),
                $("<td>").text(item.startTime),
                $("<td>").text(item.endTime),
                $("<td>").text(item.username),
                $("<td>").text(item.commentContent)
            )
            .appendTo("#detailsTbody");
    });
}

function reloadEntries(response) {
    $("#appointmentTbody").empty();

    $.each(response, function (i, item) {
        var btnDetails = document.createElement("button");
        var btnDelete = document.createElement("button");

        // Creating details & delete buttons for every entry
        btnDetails.innerHTML = "Details";
        btnDetails.className = "btn btn-info";
        btnDetails.setAttribute("appointment-id", item.appointmentId);
        btnDetails.setAttribute("onclick", "showDetails(this)");

        var expiryDate = item.appointmentDate + "T" + "12:00";
        var expiryDateCast = new Date(expiryDate);
        var currentDate = new Date();

        if (expiryDateCast.getTime() < currentDate.getTime()) {
            btnDetails.innerHTML = "Abgelaufen";
        }

        btnDelete.innerHTML = "Delete";
        btnDelete.className = "btn btn-danger";
        btnDelete.setAttribute("appointment-id", item.appointmentId);
        btnDelete.setAttribute("onclick", "deleteAppointment(this)");

        // Show basic information about the appointment
        var $tr = $("<tr>")
            .append(
                $("<td>").text(item.appointmentId),
                $("<td>").text(item.appointmentDate),
                $("<td>").text(item.location),
                $("<td>").text(item.subject),
                $("<td>").text(item.username),
                $("<td>").append(btnDetails),
                $("<td>").append(btnDelete)
            )
            .appendTo("#appointmentTbody");
    });
}

// Add entry to backend
function addAppointment(
    addAppointmentDate,
    addStartTime,
    addEndTime,
    addLocation,
    addSubject,
    addExpiryVotingDate,
    addExpiryVotingTime,
    addUsername
) {
    $.ajax({
        type: "GET",
        url: serviceHandlerURL,
        cache: false,
        data: {
            method: "addAppointment",
            appointmentDate: addAppointmentDate,
            startTime: addStartTime,
            endTime: addEndTime,
            location: addLocation,
            subject: addSubject,
            expiryVotingDate: addExpiryVotingDate,
            expiryVotingTime: addExpiryVotingTime,
            username: addUsername,
        },
        dataType: "json",

        success: function (response) {
            loadAllTasks();
        },

        error: function (data) {
            console.log("Ajax not loaded: addAppointment");
            console.log(data);
        },
    });
}

function updateTimeslotById(upTimeslotId, upUsername, upCommentContent) {
    $.ajax({
        type: "GET",
        url: serviceHandlerURL,
        cache: false,
        data: {
            method: "updateTimeslotById",
            timeslotId: upTimeslotId,
            username: upUsername,
            commentContent: upCommentContent,
        },
        dataType: "json",

        success: function (response) {
            console.log("Ajax loaded: updateTimeslotById");
        },

        error: function (data) {
            console.log("Ajax not loaded: addAppointment");
            console.log(data);
        },
    });
}

// Remove entry from backend
function deleteAppointmentById(id) {
    $.ajax({
        type: "GET",
        url: serviceHandlerURL,
        cache: false,
        data: {
            method: "deleteAppointmentById",
            param: id,
        },
        dataType: "json",

        success: function (response) {
            loadAllTasks();
        },

        error: function (data) {
            console.log(data);
            console.log("Ajax not loaded");
        },
    });
}

// Loading from Backend
function loadDetailsById(id) {
    $.ajax({
        type: "GET",
        url: serviceHandlerURL,
        cache: false,
        data: {
            method: "queryAppointmentByID",
            param: id,
        },
        dataType: "json",

        success: function (response) {
            console.log("Ajax Loaded: loadDetailsById");

            reloadDetails(response);
        },

        error: function (data) {
            console.log(data);
            console.log("Ajax not loaded");
        },
    });
}

// Loading from Backend
function loadTimeslotsById(id) {
    $.ajax({
        type: "GET",
        url: serviceHandlerURL,
        cache: false,
        data: {
            method: "queryTimeslotsById",
            param: id,
        },
        dataType: "json",

        success: function (response) {
            console.log("Ajax Loaded: loadTimeslotsById");

            reloadTimeslots(response);
        },

        error: function (data) {
            console.log(data);
            console.log("Ajax not loaded: loadTimeslotsById");
        },
    });
}

function loadAppointmentById(id) {
    $.ajax({
        type: "GET",
        url: serviceHandlerURL,
        cache: false,
        data: {
            method: "queryAppointmentByID",
            param: id,
        },
        dataType: "json",

        success: function (response) {
            if (response != true) {
                console.log("Ajax Loaded: loadTaskById");
                $("#noOfEntries").text("Open appointments: " + response.length);

                reloadEntries(response);
            } else {
                console.log("Ajax Error: loadTaskById -> response is empty");
                $("#appointmentTbody").empty();
                $("#noOfEntries").text("");
            }
        },

        error: function (data) {
            console.log(data);
            console.log("Ajax not loaded");
        },
    });
}

function loadTaskByName(searchterm) {
    $.ajax({
        type: "GET",
        url: serviceHandlerURL,
        cache: false,
        data: {
            method: "queryAppointmentByName",
            param: searchterm,
        },
        dataType: "json",

        success: function (response) {
            if (response != true) {
                console.log("Ajax Loaded: loadTaskByName");
                $("#noOfEntries").text("Open appointments: " + response.length);

                reloadEntries(response);
            } else {
                console.log(
                    "Ajax Error: loadTaskByName -> Error response is empty"
                );
                $("#appointmentTbody").empty();
                $("#noOfEntries").text("");
            }
        },

        error: function (data) {
            console.log("Ajax not loaded");
        },
    });
}

function loadAllTasks() {
    $.ajax({
        type: "GET",
        url: serviceHandlerURL,
        cache: false,
        data: {
            method: "queryAppointments",
        },
        dataType: "json",

        success: function (response) {
            if (response != true) {
                console.log("Ajax Loaded: loadAllTasks");
                $("#noOfEntries").text("Open appointments: " + response.length);

                reloadEntries(response);
            } else {
                console.log("Ajax Error: loadAllTasks -> response is empty");

                $("#appointmentTbody").empty();
                $("#noOfEntries").text("");
            }
        },

        error: function (data) {
            console.log("Ajax not loaded: loadAllTasks");
            console.log(data);
        },
    });
}
