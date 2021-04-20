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

function reloadDetails(response) {
    var item = response[0];

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

    $.each(response, function (i, item) {
        var checkBoxVote = document.createElement("input");

        checkBoxVote.className = "form-check-input";
        checkBoxVote.type = "checkbox";
        checkBoxVote.id = "checkBoxAppointment";

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
            alert("Appointment has been added!");
            loadAllTasks();
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
            alert("Appointment has been deleted!");

            loadAllTasks();
        },

        error: function (data) {
            alert(data);
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
            alert(data);
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
            console.log("Ajax Loaded: loadTaskById");
            $("#noOfEntries").text("Open appointments: " + response.length);
            $("#searchResult").show(1000).delay(1000);
            $("#appointmentTable").show(2000).delay(1000);

            reloadEntries(response);
        },

        error: function (data) {
            alert(data);
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
            console.log("Ajax Loaded: loadTaskByName");
            $("#noOfEntries").text("Open appointments: " + response.length);
            $("#searchResult").show(1000).delay(1000);
            $("#appointmentTable").show(2000).delay(1000);

            reloadEntries(response);
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
            console.log("Ajax Loaded: loadAllTasks");

            $("#noOfEntries").text("Open appointments: " + response.length);
            $("#searchResult").show(1000).delay(1000);
            $("#appointmentTable").show(2000).delay(1000);

            reloadEntries(response);
        },

        error: function (data) {
            console.log("Ajax not loaded");
            console.log(data);
        },
    });
}
