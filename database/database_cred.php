<?php

    //include "../wp-config.php"; // indien toegang naar WordPress database nodig is

    define('SCHAAKZET_DB_NAME', "");
    define('SCHAAKZET_DB_USER', "");
    define('SCHAAKZET_DB_PASSWORD', "");
    define('SCHAAKZET_DB_HOST', 'localhost');

    // instellingen staan OOK in /crud/index.php onderaan de file
    $rtdb = new mysqli(SCHAAKZET_DB_HOST,SCHAAKZET_DB_USER,SCHAAKZET_DB_PASSWORD,SCHAAKZET_DB_NAME);
    $rtdb->set_charset("utf8mb4");
    if ($rtdb -> connect_errno) {
        echo json_encode("Failed to connect to MySQL: " . $rtdb -> connect_error);
        exit();
    }

?>