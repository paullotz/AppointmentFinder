//Starting point for JQuery init
$(document).ready(function () {
    $("#searchResult").hide();
    $("#userTable").hide();
    
    $("#btn_Search").click(function (e) {
       loaddata($("#seachfield").val());
       $("#tbody").html("");
    });
});

function loaddata(searchterm) {
    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
        cache: false,
        data: {method: "queryPersonByName", param: searchterm},
        dataType: "json",

        success: function (response) {
            $("#noOfentries").val(response.length);
            $("#searchResult").show(1000).delay(1000);
            $("#userTable").show(2000).delay(1000);
            $("#dynamic").load("../clientParts/part.html");
            
            $(function() {
                $.each(response, function(i, item) {
                    var $tr = $("<tr>").append(
                        $("<td>").text(item.id),
                        $("<td>").text(item.firstname),
                        $("<td>").text(item.lastname),
                        $("<td>").text(item.email),
                        $("<td>").text(item.phone),
                        $("<td>").text(item.department),
                    ).appendTo("#tbody");
                });
            });
        }
    });
}
