<?php
class Appointment {
    public $id;
    public $name;
    public $time;
    public $location;

    function __construct($id, $name, $time, $location) {
        $this->id = $id;
        $this->name = $name;
        $this->time = $time;
        $this->location = $location;
      }
  }
