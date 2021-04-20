<?php
include_once("{$_SERVER['DOCUMENT_ROOT']}/AppointmentFinder/backend/businessLogic/simpleLogic.php");

// Var for loading tables
$param = "";

// Vars for adding a new appointment
$appointmentDate = "";
$startTime = "";
$endTime = "";
$location = "";
$subject = "";
$expiryVotingDate = "";
$expiryVotingTime = "";
$username = "";

// Var for saving the method that will be used used for both types of requests
$method = "";

isset($_GET["method"]) ? $method = $_GET["method"] : false;

// Loading only
isset($_GET["param"]) ? $param = $_GET["param"] : false;

// Used for adding only
isset($_GET["appointmentDate"]) ? $appointmentDate = $_GET["appointmentDate"] : false;
isset($_GET["startTime"]) ? $startTime = $_GET["startTime"] : false;
isset($_GET["endTime"]) ? $endTime = $_GET["endTime"] : false;
isset($_GET["location"]) ? $location = $_GET["location"] : false;
isset($_GET["subject"]) ? $subject = $_GET["subject"] : false;
isset($_GET["expiryVotingDate"]) ? $expiryVotingDate = $_GET["expiryVotingDate"] : false;
isset($_GET["expiryVotingTime"]) ? $expiryVotingTime = $_GET["expiryVotingTime"] : false;
isset($_GET["username"]) ? $username = $_GET["username"] : false;

$logic = new SimpleLogic();

if ($appointmentDate != false) {
    // Adding
    $result = $logic->addAppointment($appointmentDate, $startTime, $endTime, $location, $subject, $expiryVotingDate, $expiryVotingTime, $username);
} else {
    // Loading
    $result = $logic->handleRequest($method, $param);
}

if ($result == null) {
    response("GET", 400, null);
} else {
    response("GET", 200, $result);
}

function response($method, $httpStatus, $data) {
    header('Content-Type: application/json');
    switch ($method) {
        case "GET":
            http_response_code($httpStatus);
            echo (json_encode($data));
            break;

        default:
            http_response_code(405);
            echo ("Method not supported yet!");
    }
}
