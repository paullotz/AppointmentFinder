// Loading JQuery
$(document).ready(function () {
    $("#searchResult").hide();
    $("#userTable").hide();

    $("#btn_Search").click(function (e) {
        loaddata($("#seachfield").val());
        $("#tbody").html("");
    });

    console.log("JS has been loaded");
});

function loaddata(searchterm) {
    $.ajax({
        type: "GET",
        url: "../AppointmentFinder/backend/serviceHandler.php",
        cache: false,
        data: {
            method: "queryAppointmentByID",
            param: searchterm,
        },
        dataType: "json",

        success: function (response) {
            console.log("Ajax Loaded");
            $("#noOfentries").val(response.length);
            $("#searchResult").show(1000).delay(1000);
            $("#userTable").show(2000).delay(1000);
            $("#dynamic").load(
                "../AppointmentFinder/backend/clientParts/part.html"
            );

            $(function () {
                $.each(response, function (i, item) {
                    var $tr = $("<tr>")
                        .append(
                            $("<td>").text(item.id),
                            $("<td>").text(item.name),
                            $("<td>").text(item.time),
                            $("<td>").text(item.location)
                        )
                        .appendTo("#tbody");
                });
            });
        },

        error: function (data) {
            alert(data);
            console.log("Ajax not loaded");
        },
    });
}
