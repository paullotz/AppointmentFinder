<?php
include_once("{$_SERVER['DOCUMENT_ROOT']}/AppointmentFinder/backend/db/dataHandler.php");

class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method, $param)
    {
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
            default:
                $res = null;
                break;
        }
        return $res;
    }
}
