<?php
class TimeSlot
{
    public $timeslotId;
    public $appointmentId;
    public $startTime;
    public $endTime;
    public $username;
    public $commentContent;

    function __construct($timeslotId, $appointmentId, $startTime, $endTime, $username, $commentContent) {
        $this->timeslotId = $timeslotId;
        $this->appointmentId = $appointmentId;
        $this->startTime = $startTime;
        $this->endTime = $endTime;
        $this->username = $username;
        $this->commentContent = $commentContent;
    }
}