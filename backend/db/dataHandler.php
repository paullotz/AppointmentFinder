<?php

// Enablel PHP Debugging options
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Getting full path of files
$dRoot = $_SERVER["DOCUMENT_ROOT"];
include_once($dRoot . "/AppointmentFinder/backend/models/appointment.php");
include_once($dRoot . "/AppointmentFinder/backend/models/timeslot.php");

class DataHandler {
    public $conn;

    public function __construct() {
        $dRoot = $_SERVER["DOCUMENT_ROOT"];

        // Get credentials from json config
        $strConfigContent = file_get_contents($dRoot . "/AppointmentFinder/backend/config/config.json");
        $jsonArray = json_decode($strConfigContent, true);

        $servername = $jsonArray["database"]["host"];
        $username = $jsonArray["database"]["user"];
        $password = $jsonArray["database"]["password"];
        $table = $jsonArray["database"]["table"];

        // Create connection
        $this->conn = new mysqli($servername, $username, $password, $table);

        // Check connection
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function queryAppointments() {
        $sql = "SELECT * FROM appointments";
        $result = $this->conn->query($sql);
        $appointmentObjects = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $appointment = new Appointment(
                    $row["appointmentId"],
                    $row["appointmentDate"],
                    $row["appointmentStartTime"],
                    $row["appointmentEndTime"],
                    $row["location"],
                    $row["subject"],
                    $row["username"],
                    $row["votingExpiryDate"],
                    $row["votingExpiryTime"],
                );

                array_push($appointmentObjects, $appointment);
            }
        }

        if ($appointmentObjects == null) {
            return true;
        } else {
            return $appointmentObjects;
        }
    }

    public function queryAppointmentByID($id) {
        $sql = "SELECT * FROM appointments WHERE appointmentId = {$id}";
        $result = $this->conn->query($sql);
        $appointmentObjects = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $appointment = new Appointment(
                    $row["appointmentId"],
                    $row["appointmentDate"],
                    $row["appointmentStartTime"],
                    $row["appointmentEndTime"],
                    $row["location"],
                    $row["subject"],
                    $row["username"],
                    $row["votingExpiryDate"],
                    $row["votingExpiryTime"],
                );

                array_push($appointmentObjects, $appointment);
            }
        }

        if ($appointmentObjects == null) {
            return true;
        } else {
            return $appointmentObjects;
        }
    }

    public function queryAppointmentByName($name) {
        $sql = "SELECT * FROM appointments WHERE subject = '{$name}'";
        $result = $this->conn->query($sql);
        $appointmentObjects = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $appointment = new Appointment(
                    $row["appointmentId"],
                    $row["appointmentDate"],
                    $row["appointmentStartTime"],
                    $row["appointmentEndTime"],
                    $row["location"],
                    $row["subject"],
                    $row["username"],
                    $row["votingExpiryDate"],
                    $row["votingExpiryTime"],
                );

                array_push($appointmentObjects, $appointment);
            }
        }

        if ($appointmentObjects == null) {
            return true;
        } else {
            return $appointmentObjects;
        }
    }

    public function queryTimeslotsById($id) {
        $sql = "SELECT * FROM timeslots WHERE appointmentId = {$id}";
        $result = $this->conn->query($sql);
        $timeslotObjects = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $timeslot = new TimeSlot(
                    $row["timeslotId"],
                    $row["appointmentId"],
                    $row["startTime"],
                    $row["endTime"],
                    $row["username"],
                    $row["commentContent"],
                );

                array_push($timeslotObjects, $timeslot);
            }
        }

        return $timeslotObjects;
    }

    public function deleteAppointmentById($id) {
        $sql = "DELETE FROM appointments WHERE appointmentId={$id}";
        $this->conn->query($sql);

        $sql = "DELETE FROM timeslots WHERE appointmentId={$id}";
        $this->conn->query($sql);

        return true;
    }
    
    public function updateTimeslotById($timeslotId, $username, $commentContent) {
        $appointmentStmt = $this->conn->prepare("UPDATE timeslots SET username=?, commentContent=? WHERE timeslotId=?");
        $appointmentStmt->bind_param("ssi", $username, $commentContent, $timeslotId);

        $appointmentStmt->execute();

        return true;
    }

    public function addAppointment($appointmentDate, $startTime, $endTime, $location, $subject, $expiryVotingDate, $expiryVotingTime, $username) {
        $appointmentStmt = $this->conn->prepare("INSERT INTO appointments (appointmentDate, location, subject, votingExpiryDate, appointmentStartTime, appointmentEndTime, votingExpiryTime, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $appointmentStmt->bind_param("ssssssss", $appointmentDate, $location, $subject, $expiryVotingDate, $startTime, $endTime, $expiryVotingTime, $username);

        $appointmentStmt->execute();

        // Get the latest inserted id
        $appointmentId = $this->conn->insert_id;

        $startTime = explode(":", $startTime);
        $hourStartTime = $startTime[0];
        $minuteStartTime = $startTime[1];

        $endTime = explode(":", $endTime);
        $hourEndTime = $endTime[0];
        $minuteEndTime = $endTime[1];

        $totalTimeSlots = ($hourEndTime - $hourStartTime) * 4;
        $timeSlotStartTime = "";
        $timeSlotEndTime = "";
        $ctr = 0;

        for ($i = 0; $i <= $totalTimeSlots ; $i++) {
            if ($minuteStartTime >= 60) {
                $hourStartTime++;
                $minuteStartTime -= 60;
            }

            if ($ctr == 0) {
                if ($minuteStartTime == 0) {
                    $timeSlotStartTime = $hourStartTime . " : 00";
                } else {
                    $timeSlotStartTime = $hourStartTime . " : " . $minuteStartTime;
                }
                
                $ctr++;
                $minuteStartTime += 30;
            } else if ($ctr == 1) {
                if ($minuteStartTime == 0) {
                    $timeSlotEndTime = $hourStartTime . " : 00";
                } else {
                    $timeSlotEndTime = $hourStartTime . " : " . $minuteStartTime;
                }

                /* DEBUG 
                echo "Start time " . $timeSlotStartTime . "\n";
                echo "End time " . $timeSlotEndTime. "\n";
                */
                $slash = "/";
                
                // Insert timeslot into db
                $timeslotStmt = $this->conn->prepare("INSERT INTO timeslots (appointmentId, startTime, endTime, username, commentContent) VALUES (?, ?, ?, ?, ?)");
                $timeslotStmt->bind_param("issss", $appointmentId, $timeSlotStartTime, $timeSlotEndTime, $slash, $slash);
        
                $timeslotStmt->execute();

                $ctr = 0;
            } 

        }

        return true;
    }

    public function __destruct() {
        $this->conn->close();
    }
}