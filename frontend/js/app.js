var boolNewCard = false;
var boolSearchCard = false;

$(document).ready(function () {
    // Dynamic Loading of content
    $("#searchAppointmentsCard").load(
        "../frontend/parts/searchAppointment.html"
    );
    $("#basicFeaturesCard").load(
        "../frontend/parts/basicFeatures.html"
    );
    $("#allAppointmentsCard").load(
        "../frontend/parts/allAppointments.html"
    );
    $("#newAppointmentsCard").load("../frontend/parts/newAppointment.html");
    $("#detailsAppointmentCard").load(
        "../frontend/parts/detailsAppointment.html"
    );

    $.getScript("../backend/jsonClient/controller.js");

    $("#searchAppointmentsCard").hide();
    $("#newAppointmentsCard").hide();
    $("#detailsAppointmentCard").hide();
});

function showSearchCard() {
    const username = document.getElementById("txtUsername").value.length;
    
    if (username == 0) {
        Swal.fire({
            icon: "error",
            title: "Oje...",
            text: "Bitte Username eingeben!",
        });
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
        Swal.fire({
            icon: "error",
            title: "Oje...",
            text: "Bitte Username eingeben!",
        });
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
