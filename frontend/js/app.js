var boolNewCard = false;
var boolSearchCard = false;

$(document).ready(function () {
    $("#detailsAppointmentCard").hide();
    $("#searchAppointmentsCard").hide();
    $("#newAppointmentsCard").hide();
});

function showSearchCard() {
    const username = document.getElementById("txtUsername").value.length;

    if (username == 0) {
        alert("Please enter a username !");
    } else {
        if (boolSearchCard) {
            $("#searchAppointmentsCard").hide();
            boolSearchCard = false;
        } else {
            $("#searchAppointmentsCard").show();
            boolSearchCard = true;
        }
    }
}

function showNewCard() {
    const username = document.getElementById("txtUsername").value.length;

    if (username == 0) {
        alert("Please enter a username !");
    } else {
        if (boolNewCard) {
            $("#newAppointmentsCard").hide();
            boolNewCard = false;
        } else {
            $("#newAppointmentsCard").show();
            boolNewCard = true;
        }
    }
}
