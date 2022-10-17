<?php

include "library/config.php";

$postjson = json_decode(file_get_contents("php://input"), true);


if ($postjson['task'] == 'getaspiranterol') {

	$data = array();

	if ($postjson['role'] == 'tthh') {
		$query = mysqli_query($mysqli, "SELECT DISTINCT * FROM vista_asp_tthh 
						WHERE asp_cedula LIKE '$postjson[cedula]'");
	}

	if ($postjson['role'] == 'psico') {
		$query = mysqli_query($mysqli, "SELECT DISTINCT * FROM vista_asp_psico 
						WHERE asp_cedula LIKE '$postjson[cedula]'");
	}


	if ($postjson['role'] == 'medi') {
		$query = mysqli_query($mysqli, "SELECT DISTINCT * FROM vista_asp_medi  
						WHERE asp_cedula LIKE '$postjson[cedula]'");
	}


	if ($postjson['role'] == 'segu') {
		$query = mysqli_query($mysqli, "SELECT DISTINCT * FROM vista_asp_segu  
						WHERE asp_cedula LIKE '$postjson[cedula]'");
	}

	if ($postjson['role'] == 'pdfficha') {

		$query = mysqli_query($mysqli, "SELECT DISTINCT * FROM vista_asp_ingreso 
			WHERE asp_cedula = '$postjson[cedula]'");
	}

	while ($row = mysqli_fetch_array($query)) {

		$keys = array_filter(array_keys($row), "is_numeric");
		$out = array_diff_key($row, array_flip($keys));

		$data[] = $out;
	}

	$mysqli->close();

	if ($query) {
		$result = json_encode(array('success' => true, 'aspirante' => $data[0]));
	} else {
		$result = json_encode(array('success' => false));
	}
	echo

	$result;
}

if ($postjson['task'] == 'aspiranterol') {

	$data = array();

	if ($postjson['asp_estado'] == 'tthh') {

		if ($postjson['estado'] == 0) {
			$query = mysqli_query($mysqli, "SELECT * FROM vista_asp_tthh 
			WHERE asp_estado='INGRESADO' OR asp_estado='PSICOSOMETRIA' OR asp_estado='APROBADO' 
				OR (asp_estado='REVISION' AND asp_aprobacion='false' ); ");
		} else {
			$query = mysqli_query($mysqli, "SELECT * FROM vista_asp_tthh 
			WHERE est_id = '$postjson[estado]'");
		}
	}

	if ($postjson['asp_estado'] == 'psico') {

		if ($postjson['estado'] == 0) {
			$query = mysqli_query($mysqli, "SELECT * FROM vista_asp_psico 
			WHERE asp_estado = 'VERIFICADO' OR asp_estado = 'PSICOLOGIA'");
		} else if ($postjson['estado'] == 1) {
			$query = mysqli_query($mysqli, "SELECT * FROM vista_asp_psico 
			WHERE apv_verificado = 'true' AND asp_estado<>'NO APTO' ");
		} else if ($postjson['estado'] == 2) {
			$query = mysqli_query($mysqli, "SELECT * FROM vista_asp_psico 
			WHERE asp_estado = 'NO APTO'");
		}
	}
	if ($postjson['asp_estado'] == 'medi') {

		if ($postjson['estado'] == 0) {
			$query = mysqli_query($mysqli, "SELECT * FROM vista_asp_medi 
			WHERE asp_estado = 'EXAMENES' OR asp_estado = 'MEDICINA'");
		} else if ($postjson['estado'] == 1) {
			$query = mysqli_query($mysqli, "SELECT * FROM vista_asp_medi 
			WHERE asp_estado = 'APROBADO' OR asp_estado = 'REVISION'");
		} else if ($postjson['estado'] == 2) {
			$query = mysqli_query($mysqli, "SELECT * FROM vista_asp_medi 
			WHERE asp_estado = 'NO ADMITIDO'");
		}
	}
	if ($postjson['asp_estado'] == 'segu') {

		if ($postjson['estado'] == 0) {
			$query = mysqli_query($mysqli, "SELECT * FROM vista_asp_segu 
			WHERE asp_estado = 'REVISION' ");
		} else if ($postjson['estado'] == 1) {
			$query = mysqli_query($mysqli, "SELECT * FROM vista_asp_segu 
			WHERE asp_estado = 'APROBADO' ");
		}
	}
	if ($postjson['asp_estado'] == 'soci') {

		if ($postjson['estado'] == 0) {
			$query = mysqli_query($mysqli, "SELECT * FROM vista_asp_soci 
			WHERE asp_estado = 'CONTRATADO' ");
		} else if ($postjson['estado'] == 1) {
			$query = mysqli_query($mysqli, "SELECT * FROM vista_asp_soci  
			WHERE asp_estado = 'CONTRATADO' ");
		}
	}

	while ($row = mysqli_fetch_array($query)) {

		$keys = array_filter(array_keys($row), "is_numeric");
		$out = array_diff_key($row, array_flip($keys));

		$data[] = $out;
	}

	$mysqli->close();

	if ($query) {
		$result = json_encode(array('success' => true, 'aspirantes' => $data));
	} else {
		$result = json_encode(array('success' => false));
	}
	echo

	$result;
}
if ($postjson['task'] == 'talentoh1') {

	$strObjeto = "";

	foreach ($postjson as $key => $value) {

		$col_id = substr($key, 0, 4);

		if ($col_id == "atv_") {
			$strObjeto = $strObjeto . $key . " = '" . (string)$value . "',\n";
		}
	}

	$strObjeto = substr($strObjeto, 0, strlen($strObjeto) - 2);

	$query = mysqli_query($mysqli, "UPDATE asp_tthh_validar SET " . $strObjeto .
		" WHERE atv_aspirante LIKE '$postjson[atv_aspirante]'");

	$query2 = mysqli_query($mysqli, "UPDATE aspirante SET 
			asp_estado	= '$postjson[asp_estado]'
		WHERE asp_cedula LIKE '$postjson[atv_aspirante]'");

	if ($postjson['atv_aprobado'] == 'SI') {
		$strObjetoValth = 	"apv_aspirante = '$postjson[atv_aspirante]', 
							 apv_fverificado = '$postjson[atv_fverificado]' ";
		$query3 = mysqli_query($mysqli, "INSERT INTO asp_psico_validar SET " . $strObjetoValth);
	}


	$mysqli->close();

	if ($query && $query2) {
		$result = json_encode(array('success' => true));
	} else {
		$result = json_encode(array('success' => false));
	}
	echo $result;
}

if ($postjson['task'] == 'psicologia1') {

	$strObjeto = "";

	foreach ($postjson as $key => $value) {

		$col_id = substr($key, 0, 4);

		if ($col_id == "apv_") {
			$strObjeto = $strObjeto . $key . " = '" . (string)$value . "',\n";
		}
	}

	$strObjeto = substr($strObjeto, 0, strlen($strObjeto) - 2);

	$query = mysqli_query($mysqli, "UPDATE asp_psico_validar SET " . $strObjeto .
		" WHERE apv_aspirante LIKE '$postjson[apv_aspirante]'");

	$query2 = mysqli_query($mysqli, "UPDATE aspirante SET 
			asp_estado	= '$postjson[asp_estado]'
		WHERE asp_cedula LIKE '$postjson[apv_aspirante]'");


	$mysqli->close();

	if ($query && $query2) {
		$result = json_encode(array('success' => true));
	} else {
		$result = json_encode(array('success' => false));
	}
	echo $result;
}


if ($postjson['task'] == 'psicologia2') {

	$strObjeto = "";

	$query = mysqli_query($mysqli, "UPDATE aspirante SET 
			asp_estado	= '$postjson[asp_estado]'
		WHERE asp_cedula LIKE '$postjson[amv_aspirante]'");

	/*if ($postjson['atv_aprobado'] == 'SI') {
		$strObjetoValth = 	"apv_aspirante = '$postjson[atv_aspirante]', 
							 apv_fverificado = '$postjson[atv_fverificado]' ";
		$query3 = mysqli_query($mysqli, "INSERT INTO asp_psico_validar SET " . $strObjetoValth);
	}*/


	$mysqli->close();

	if ($query) {
		$result = json_encode(array('success' => true));
	} else {
		$result = json_encode(array('success' => false));
	}
	echo $result;
}

if ($postjson['task'] == 'autorizarex') {

	$query = mysqli_query($mysqli, "UPDATE aspirante SET 
			asp_estado	= '$postjson[asp_estado]'
		WHERE asp_cedula LIKE '$postjson[amv_aspirante]'");

	$strObjetoValth = 	"amv_aspirante = '$postjson[amv_aspirante]', 
						 amv_fexamenes = '$postjson[amv_fexamenes]' ";
	$query2 = mysqli_query($mysqli, "INSERT INTO asp_medi_validar SET " . $strObjetoValth);


	$mysqli->close();

	if ($query && $query2) {
		$result = json_encode(array('success' => true));
	} else {
		$result = json_encode(array('success' => false));
	}
	echo $result;
}


if ($postjson['task'] == 'medicina1') {

	$strObjeto = "";

	foreach ($postjson as $key => $value) {

		$col_id = substr($key, 0, 4);

		if ($col_id == "amv_") {
			$strObjeto = $strObjeto . $key . " = '" . (string)$value . "',\n";
		}
	}

	$strObjeto = substr($strObjeto, 0, strlen($strObjeto) - 2);

	$query = mysqli_query($mysqli, "UPDATE asp_medi_validar SET " . $strObjeto .
		" WHERE amv_aspirante LIKE '$postjson[amv_aspirante]'");

	$query2 = mysqli_query($mysqli, "UPDATE aspirante SET 
			asp_estado	= '$postjson[asp_estado]'
		WHERE asp_cedula LIKE '$postjson[amv_aspirante]'");


	if ($postjson['asp_estado'] == "REVISION") {
		$queryAdd = mysqli_query($mysqli, "INSERT into asp_segu_validar SET 
			asv_aspirante	= '$postjson[amv_aspirante]',
			asv_fingresado	= '$postjson[amv_fexamenes]' ");
	}


	$mysqli->close();

	if ($query && $query2) {
		$result = json_encode(array('success' => true));
	} else {
		$result = json_encode(array('success' => false));
	}
	echo $result;
}

if ($postjson['task'] == 'seguridad1') {

	$strObjeto = "";

	foreach ($postjson as $key => $value) {

		$col_id = substr($key, 0, 4);

		if ($col_id == "asv_") {
			$strObjeto = $strObjeto . $key . " = '" . (string)$value . "',\n";
		}
	}

	$strObjeto = substr($strObjeto, 0, strlen($strObjeto) - 2);

	$query = mysqli_query($mysqli, "UPDATE asp_segu_validar SET " . $strObjeto .
		" WHERE asv_aspirante LIKE '$postjson[asv_aspirante]'");

	$query2 = mysqli_query($mysqli, "UPDATE aspirante SET 
			asp_estado	= 'APROBADO'
			WHERE asp_cedula LIKE '$postjson[asv_aspirante]'");

	$mysqli->close();

	if ($query) {
		$result = json_encode(array('success' => true));
	} else {
		$result = json_encode(array('success' => false));
	}
	echo $result;
}

if ($postjson['task'] == 'talentoh2') {

	$query = mysqli_query($mysqli, "UPDATE aspirante SET 
		  asp_aprobacion = 'true' " . " WHERE asp_cedula LIKE '$postjson[asp_cedula]'");

	$mysqli->close();

	if ($query) {
		$result = json_encode(array('success' => true));
	} else {
		$result = json_encode(array('success' => false));
	}
	echo $result;
}

if ($postjson['task'] == 'talentoh3') {

	$query = mysqli_query($mysqli, "UPDATE aspirante SET 
		  asp_estado = 'CONTRATADO' " . " WHERE asp_cedula LIKE '$postjson[asp_cedula]'");

	$mysqli->close();

	if ($query) {
		$result = json_encode(array('success' => true));
	} else {
		$result = json_encode(array('success' => false));
	}
	echo $result;
}


if ($postjson['task'] == 'social1') {

	$strObjeto = "";

	foreach ($postjson as $key => $value) {

		$col_id = substr($key, 0, 4);

		if ($col_id == "asp_" && $key != "asp_cedula") {
			$strObjeto = $strObjeto . $key . " = '" . (string)$value . "',\n";
		}
	}

	$strObjeto = substr($strObjeto, 0, strlen($strObjeto) - 2);

	$query = mysqli_query($mysqli, "UPDATE aspirante SET " . $strObjeto .
		" WHERE asp_cedula LIKE '$postjson[asp_cedula]'");

	$mysqli->close();

	if ($query) {
		$result = json_encode(array('success' => true));
	} else {
		$result = json_encode(array('success' => false));
	}
	echo $result;
}