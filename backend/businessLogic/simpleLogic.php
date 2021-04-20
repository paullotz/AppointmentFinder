<?php
include_once("{$_SERVER['DOCUMENT_ROOT']}/AppointmentFinder/backend/db/dataHandler.php");

class SimpleLogic {
    private $dh;
    function __construct() {
        $this->dh = new DataHandler();
    }

    function handleRequest($method, $param) {
        switch ($method) {
            case "queryAppointments":
                $res = $this->dh->queryAppointments();
                break;

            case "queryAppointmentByID":
                $res = $this->dh->queryAppointmentByID($param);
                break;

            case "queryAppointmentByName":
                $res = $this->dh->queryAppointmentByName($param);
                break;

            case "deleteAppointmentById":
                    $res = $this->dh->deleteAppointmentById($param);
                    break;
                
            case "queryTimeslotsById":
                $res = $this->dh->queryTimeslotsById($param);
                break;
                
            default:
                $res = null;
                break;
        }
        return $res;
    }

    function addAppointment($appointmentDate, $startTime, $endTime, $location, $subject, $expiryVotingDate, $expiryVotingTime, $username) {
        // call function addAppointment from DH
        $res = $this->dh->addAppointment($appointmentDate, $startTime, $endTime, $location, $subject, $expiryVotingDate, $expiryVotingTime, $username);
        return $res;
    }

    function updateTimeslotById($timeslotId, $username, $commentContent) {
        // call function addAppointment from DH
        $res = $this->dh->updateTimeslotById($timeslotId, $username, $commentContent);
        return $res;
    }
}
    