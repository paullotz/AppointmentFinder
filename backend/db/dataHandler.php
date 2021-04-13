<?php
$dRoot = $_SERVER["DOCUMENT_ROOT"];
include_once($dRoot . "/AppointmentFinder/backend/models/appointment.php");

class DataHandler
{
    public function queryAppointments()
    {
        $res =  $this->getDemoData();
        return $res;
    }

    public function queryAppointmentByID($id)
    {
        $result = array();
        foreach ($this->queryAppointments() as $val) {
            if (strcasecmp($val->id, $id) == 0) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    public function queryAppointmentByName($name)
    {
        $result = array();
        foreach ($this->queryAppointments() as $val) {
            if (strcasecmp($val->lastname, $name) == 0) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    private static function getDemoData() {
        $demodata = [
            new Appointment(1, "Projekt Meeting", "16:30, 20.01.2021", "Wien"),
            new Appointment(2, "Berufsmeeting", "6:30, 23.05.2021", "Wien"),
            new Appointment(3, "Abgabegespräch", "9:00, 11.01.2021", "Wien"),
            new Appointment(4, "Sprint Review #3", "17:00, 20.01.2021", "Wien"),
        ];
        return $demodata;
    }
}
