<?php
class Appointment
{
    public $id;
    public $name;
    public $notes;
    public $location;

    function __construct($id, $name, $notes, $location)
    {
        $this->id = $id;
        $this->name = $name;
        $this->notes = $notes;
        $this->location = $location;
    }
}
