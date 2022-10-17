<?php

include "library/config.php";

$postjson = json_decode(file_get_contents("php://input"), true);


if ($postjson['task'] == 'listarresponsables') {

	$data = array();

		$query = mysqli_query($mysqli, "SELECT * FROM responsables ");

	while ($row = mysqli_fetch_array($query)) {

		$keys = array_filter(array_keys($row), "is_numeric");
		$out = array_diff_key($row, array_flip($keys));

		$data[] = $out;
	}

	$mysqli->close();

	if ($query) {
		$result = json_encode(array('success' => true, 'responsables' => $data));
	} else {
		$result = json_encode(array('success' => false));
	}
	echo

	$result;
}

