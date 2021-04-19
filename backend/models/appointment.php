<?php
class Appointment
{
    public $appointmentId;
    public $appointmentDate;
    public $appointmentStartTime;
    public $appointmentEndTime;
    public $location;
    public $subject;
    public $username;
    public $votingExpiryDate;
    public $votingExpiryTime;

    function __construct($appointmentId, $appointmentDate, $appointmentStartTime, $appointmentEndTime ,$location, $subject, $username, $votingExpiryDate, $votingExpiryTime)
    {
        $this->appointmentId = $appointmentId;
        $this->appointmentDate = $appointmentDate;
        $this->appointmentStartTime = $appointmentStartTime;
        $this->appointmentEndTime = $appointmentEndTime;
        $this->location = $location;
        $this->subject = $subject;
        $this->username = $username;
        $this->votingExpiryDate = $votingExpiryDate;
        $this->votingExpiryTime = $votingExpiryTime;
    }
}
