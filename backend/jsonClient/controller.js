var serviceHandlerURL = "../backend/serviceHandler.php";

// Loading JQuery
$(document).ready(function () {
	loadAllTasks();

	$("#btnSearchById").click(function () {
		$("#tbody").html("");
		loadTaskById($("#txtSearchField").val());
	});

	$("#btnRefreshTasks").click(function () {
		$("#tbody").html("");
		loadAllTasks();
	});

	$("#btnSearchByName").click(function () {
		$("#tbody").html("");
		loadTaskByName($("#txtSearchField").val());
	});

	console.log("JS has been loaded");
});

function reloadEntries(response) {
	$.each(response, function (i, item) {
		var $tr = $("<tr>")
			.append(
				$("<td>").text(item.id),
				$("<td>").text(item.name),
				$("<td>").text(item.notes),
				$("<td>").text(item.location)
			)
			.appendTo("#tbody");
	});
}

function loadTaskById(searchterm) {
	$.ajax({
		type: "GET",
		url: serviceHandlerURL,
		cache: false,
		data: {
			method: "queryAppointmentByID",
			param: searchterm,
		},
		dataType: "json",

		success: function (response) {
			console.log("Ajax Loaded: loadTaskById");
			$("#noOfEntries").text("Open appointments: " + response.length);
			$("#searchResult").show(1000).delay(1000);
			$("#userTable").show(2000).delay(1000);

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
			$("#userTable").show(2000).delay(1000);

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
		async: false,
		data: {
			method: "queryAppointments",
		},
		dataType: "json",

		success: function (response) {
			console.log(response);
			console.log("Ajax Loaded: loadAllTasks");

			$("#noOfEntries").text("Open appointments: " + response.length);
			$("#searchResult").show(1000).delay(1000);
			$("#userTable").show(2000).delay(1000);

			reloadEntries(response);
		},

		error: function (data) {
			console.log("Ajax not loaded");
		},
	});
}
