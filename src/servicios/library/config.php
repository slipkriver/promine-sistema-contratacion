<?php

define("DB_NAME", "getssoma_promine");
define("DB_USER", "getssoma_nantu");
define("DB_PASSWORD", ",zfcb}*Ac-#A");
define("DB_HOST", "localhost");

$mysqli = new mysqli(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME);
$mysqli->set_charset("utf8");
if (!$mysqli ){
    echo "Error: No se pudo conectar a MySQL." . PHP_EOL;
    echo "errno de depuracion: " . mysqli_connect_errno() . PHP_EOL;
    echo "error de depuracion: " . mysqli_connect_error() . PHP_EOL;
    exit;
}


?>


