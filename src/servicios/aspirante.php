<?php

include "library/config.php";

$postjson = json_decode(file_get_contents("php://input"), true);

$strcampos =  "asp_id,asp_cedula,asp_codigo,asp_nombres,asp_apellidop,asp_apellidom," .
	"asp_pais,asp_sexo,asp_edad,asp_correo,asp_ecivil,asp_gpo_sanguineo," .
	"asp_cargo,asp_sueldo,asp_conadis,asp_nro_conadis,asp_discapacidad," .
	"asp_porcentaje,asp_experiencia,asp_nmb_experiencia,asp_ing_entrevista," .
	"asp_fch_ingreso,asp_telefono,asp_direccion,asp_hora_entrevista," .
	"asp_referencia,asp_estado,asp_observaciones,asp_observacion_medico," .
	"asp_observacion_final,asp_academico,asp_fecha_nacimiento,asp_militar," .
	"asp_aprobacion,asp_evaluacion,asp_condicion,asp_lugar_nacimiento," .
	"asp_etnia,asp_religion,asp_banco,asp_nro_cuenta,asp_nombre_familiar," .
	"asp_parentezco_familiar,asp_telefono_familiar,asp_descripcion_vivienda," .
	"asp_referencia_vivienda,asp_cargas,asp_cargas_primaria,asp_cargas_secundaria," .
	"asp_vivienda,asp_construccion,asp_movilizacion,asp_recomendado,est_descripcion," .
	"est_color,atv_aspirante,atv_fingreso,atv_fmodificado,atv_plegales,atv_pfiscalia,atv_ppenales," .
	"atv_plaborales,atv_verificado,atv_observacion";

$strcamposlistar = "asp_codigo,asp_cedula,asp_nombres,asp_apellidop,asp_apellidom," .
	"asp_cargo,asp_fch_ingreso,asp_telefono,asp_estado,asp_recomendado,asp_observaciones," .
	"est_descripcion,est_color";

if ($postjson['task'] == 'nuevo') {

	$strObjeto = "";
	$strObjetoValth = "";

	foreach ($postjson as $key => $value) {
		$col_id = substr($key, 0, 4);
		if ($col_id == "asp_") {
			$strObjeto = $strObjeto . $key . " = '" . (string)$value . "',\n";
		} else if ($col_id == "atv_") {
			$strObjetoValth = $strObjetoValth . $key . " = '" . (string)$value . "',\n";
		}
	}

	$strObjeto = substr($strObjeto, 0, strlen($strObjeto) - 2);
	$strObjetoValth = substr($strObjetoValth, 0, strlen($strObjetoValth) - 2);

	$query = mysqli_query($mysqli, "SELECT asp_cedula, 
									CONCAT(asp_nombres,' ',asp_apellidop,' ',asp_apellidom) AS `asp_nombre`
									FROM aspirante 
									WHERE asp_cedula='$postjson[asp_cedula]'");

	$row = mysqli_fetch_array($query);
	if (count($row) < 1) {
		$query = mysqli_query($mysqli, "INSERT INTO aspirante SET " . $strObjeto);
		$query2 = mysqli_query($mysqli, "INSERT INTO asp_tthh_validar SET " . $strObjetoValth);
		if ($query) {
			$result = json_encode(array('success' => true));
			// $result = json_encode(array('success' => true, 'SQL' => $strObjetoValth, 'SQ2L' => $postjson));
		} else {
			$result = json_encode(array('success' => false, 'sql' => 'Error'));
		}
	} else {
		$result = json_encode(array('success' => false, 'aspirante'=>$row));
	}
	$mysqli->close();


	echo $result;
} elseif ($postjson['task'] == 'obtener') {
	$data = array();
	$query = mysqli_query($mysqli, "SELECT * FROM aspirante " .
		"INNER JOIN asp_tthh_validar 
						ON asp_tthh_validar.atv_aspirante = aspirante.asp_cedula
					INNER JOIN estados 
		                ON estados.est_nombre = aspirante.asp_estado
	                WHERE aspirante.asp_cedula LIKE '$postjson[texto]' 
					ORDER BY asp_fch_ingreso DESC ");

	while ($row = mysqli_fetch_array($query)) {
		$data[] = llenarArray($row, $strcampos);
	}

	$mysqli->close();
	if ($query) $result = json_encode(array('success' => true, 'result' => $data));
	else $result = json_encode(array('success' => false));
	echo $result;
	
} else if ($postjson['task'] == 'actualizar') {

	$strObjeto = "";
	$strObjetoValth = "";

	foreach ($postjson as $key => $value) {

		$col_id = substr($key, 0, 4);

		if ($col_id == "asp_" && trim($key) != "asp_id") {
			$strObjeto = $strObjeto . $key . " = '" . (string)$value . "',\n";
		} else if ($col_id == "atv_") {
			$strObjetoValth = $strObjetoValth . $key . " = '" . (string)$value . "',\n";
		}
	}

	$strObjeto = substr($strObjeto, 0, strlen($strObjeto) - 2);
	$strObjetoValth = substr($strObjetoValth, 0, strlen($strObjetoValth) - 2);

	$query = mysqli_query($mysqli, "UPDATE aspirante SET " . $strObjeto .
		"WHERE asp_cedula LIKE '$postjson[asp_cedula]'");

	$query2 = mysqli_query($mysqli, "UPDATE asp_tthh_validar SET " . $strObjetoValth .
		"WHERE atv_aspirante LIKE '$postjson[asp_cedula]'");

	$mysqli->close();

	if ($query) {
		$result = json_encode(array('success' => true));
	} else {
		$result = json_encode(array('success' => false));
	}
	echo $result;
} else if ($postjson['task'] == 'buscar') {

	$data = array();

	$query = mysqli_query($mysqli, "SELECT " . (string)$strcamposlistar .
		" FROM aspirante 
		INNER JOIN asp_tthh_validar
			ON asp_tthh_validar.atv_aspirante LIKE aspirante.asp_cedula
		INNER JOIN estados
			ON estados.est_nombre LIKE aspirante.asp_estado
		WHERE 
			asp_nombres LIKE '%$postjson[texto]%' OR 
			asp_apellidop LIKE '%$postjson[texto]%' OR 
			asp_apellidom LIKE '%$postjson[texto]%' OR 
			asp_cedula LIKE '%$postjson[texto]%' OR 
			asp_codigo LIKE '%$postjson[texto]%' 
		ORDER BY asp_fch_ingreso DESC");

	while ($row = mysqli_fetch_array($query)) {

		$data[] = llenarArray($row, $strcamposlistar);
	}
	$mysqli->close();

	if ($query)
		$result = json_encode(array('success' => true, 'result' => $data));
	else
		$result = json_encode(array('success' => false));

	echo $result;
} else if ($postjson['task'] == 'listarporestado') {

	$data = array();

	$consulta = (string)"SELECT DISTINCT " . $strcamposlistar . " FROM aspirante 
	                INNER JOIN estados
		                ON estados.est_nombre LIKE aspirante.asp_estado ";

	if ($postjson['id_estado'] == 0) {
		$consulta = $consulta . " WHERE estados.est_id = 1 OR estados.est_id = 4 OR estados.est_id = 8
		ORDER BY estados.est_id DESC";
	} else {
		$consulta = $consulta . " WHERE estados.est_id = $postjson[id_estado]
		ORDER BY estados.est_id DESC";
	}

	$query = mysqli_query($mysqli, $consulta);

	while ($row = mysqli_fetch_array($query)) {

		$data[] = llenarArray($row, $strcamposlistar);
	}
	$mysqli->close();

	if ($query)
		$result = json_encode(array('success' => true, 'result' => $data));
	else
		$result = json_encode(array('success' => false));
	echo $result;
}

function llenarArray(array $aspirante, string $strlista)
{
	$listacampos =  (explode(",", $strlista));

	$strObjeto = "{";

	foreach ($listacampos as $campo) {

		$strObjeto = $strObjeto . '"' . $campo . '"' . ' : "' . trim($aspirante[$campo]) . '",';
	}

	$strObjeto = substr($strObjeto, 0, strlen($strObjeto) - 1);
	$strObjeto = $strObjeto . "}";

	$resJson = json_decode($strObjeto);
	return $resJson;
}
