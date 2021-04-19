<?php
$dRoot = $_SERVER["DOCUMENT_ROOT"];
include_once($dRoot . "/AppointmentFinder/backend/models/appointment.php");

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
        //$res =  $this->getDemoData();

        $sql = "SELECT * FROM appointments";
        $result = $this->conn->query($sql);
        $appointmentObjects = [];

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
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
          } else {
            echo "0 results";
        }

        return $appointmentObjects;
    }

    public function queryAppointmentByID($id) {
        $result = array();
        foreach ($this->queryAppointments() as $val) {
            if (strcasecmp($val->id, $id) == 0) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    public function queryAppointmentByName($name) {
        $result = array();
        foreach ($this->queryAppointments() as $val) {
            if (strcasecmp($val->lastname, $name) == 0) {
                array_push($result, $val);
            }
        }
        return $result;
    }
/*
    private static function getDemoData() {
        $demodata = [
            new Appointment(1, "Projekt Meeting", "ITP", "Wien"),
            new Appointment(2, "Berufsmeeting", "JavaScript Besprechung", "Wien"),
            new Appointment(3, "Abgabegespräch", "Bis heute Abend fertig machen!", "Wien"),
            new Appointment(4, "Sprint Review #3", "Vorbereiten!", "Wien"),
        ];
        return $demodata;
    }*/
}

$dh = new DataHandler();
$dh->queryAppointments();