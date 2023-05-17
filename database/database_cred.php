<?php
    //include "../wp-config.php"; // indien toegang naar WordPress database nodig is

    define('DB_NAME', "");
    define('DB_USER', "");
    define('DB_PASSWORD', "");
    define('DB_HOST', 'localhost');

    // instellingen staan OOK in /crud/index.php onderaan de file
    $rtdb = new mysqli(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME);
    $rtdb->set_charset("utf8mb4");
    if ($rtdb -> connect_errno) {
        echo json_encode("Failed to connect to MySQL: " . $rtdb -> connect_error);
        exit();
    }

?>