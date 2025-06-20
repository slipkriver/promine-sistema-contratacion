<?php

include "library/config.php";

//echo $_POST;
//return $_POST;
if ($_POST['task'] == 'subirregistrotthh') {

	$target_path = '../tthh/registros/registro_induccion-' . $_POST['aspirante'] . '.' . $_POST['ext'];

	$result = json_encode(subirarchivo($target_path));

	if ($result['success'] == true) {
		$query = mysqli_query($mysqli, "UPDATE asp_tthh_validar SET 
		atv_urlregistro	= '$target_path'
		WHERE atv_aspirante LIKE '$_POST[aspirante]'");
	}
	echo json_encode($result);
} 
else if ($_POST['task'] == 'subirreglamentotthh') {

	$target_path = '../tthh/reglamentos/reglamento_interno-' . $_POST['aspirante'] . '.' . $_POST['ext'];

	$result = json_encode(subirarchivo($target_path));

	if ($result['success'] == true) {
		$query = mysqli_query($mysqli, "UPDATE asp_tthh_validar SET 
		atv_urlreglamento	= '$target_path'
		WHERE atv_aspirante LIKE '$_POST[aspirante]'");
	}
	echo json_encode($result);

}


else if ($_POST['task'] == 'subirfichapsico') {

	$target_path = '../psicologia/' . 'ficha_psicologica-' . $_POST['aspirante'] . '.' . $_POST['ext'];

	$result = json_encode(subirarchivo($target_path));

	if ($result['success'] == true) {
		$query = mysqli_query($mysqli, "UPDATE asp_psico_validar SET 
		apv_urlficha	= '$target_path'
		WHERE apv_aspirante LIKE '$_POST[aspirante]'");
	}
	echo json_encode($result);
} else if ($_POST['task'] == 'subirtestpsico') {

	$target_path = '../psicologia/' . 'cuestionario_psicosocial-' . $_POST['aspirante'] . '.' . $_POST['ext'];

	$result = json_encode(subirarchivo($target_path));

	if ($result['success'] == true) {
		$query = mysqli_query($mysqli, "UPDATE asp_psico_validar SET 
		apv_urltest	= '$target_path'
		WHERE apv_aspirante LIKE '$_POST[aspirante]'");
	}
	echo json_encode($result);

} 


else if ($_POST['task'] == 'subirfichamedi') {

	$target_path = '../medicina/fichas/ficha_medica-' . $_POST['aspirante'] . '.' . $_POST['ext'];

	$result = json_encode(subirarchivo($target_path));

	if ($result['success'] == true) {
		$query = mysqli_query($mysqli, "UPDATE asp_medi_validar SET 
		amv_urlficha	= '$target_path'
		WHERE amv_aspirante LIKE '$_POST[aspirante]'");
	}
	echo json_encode($result);
} else if ($_POST['task'] == 'subirhistoriamedi') {

	$target_path = '../medicina/historias/historia_clinica-' . $_POST['aspirante'] . '.' . $_POST['ext'];

	$result = json_encode(subirarchivo($target_path));

	if ($result['success'] == true) {
		$query = mysqli_query($mysqli, "UPDATE asp_medi_validar SET 
		amv_urlhistoria	= '$target_path'
		WHERE amv_aspirante LIKE '$_POST[aspirante]'");
	}
	echo json_encode($result);
	
} 


else if ($_POST['task'] == 'subirseguinduccion') {

	$target_path = '../seguridad/induccion/induccion_sst-' . $_POST['aspirante'] . '.' . $_POST['ext'];

	$result = json_encode(subirarchivo($target_path));

	if ($result['success'] == true) {
		$query = mysqli_query($mysqli, "UPDATE asp_segu_validar SET 
		asv_urlinduccionsst	= '$target_path'
		WHERE asv_aspirante LIKE '$_POST[aspirante]'");
	}
	echo json_encode($result);
} else if ($_POST['task'] == 'subirseguprocedimiento') {

	$target_path = '../seguridad/procedimientos/procedimiento_pets-' . $_POST['aspirante'] . '.' . $_POST['ext'];

	$result = json_encode(subirarchivo($target_path));

	if ($result['success'] == true) {
		$query = mysqli_query($mysqli, "UPDATE asp_segu_validar SET 
		asv_urlprocedimiento	= '$target_path'
		WHERE asv_aspirante LIKE '$_POST[aspirante]'");
	}
	echo json_encode($result);
} else if ($_POST['task'] == 'subirsegucertificacion') {

	$target_path = '../seguridad/certificaciones/certificacion_prl-' . $_POST['aspirante'] . '.' . $_POST['ext'];

	$result = json_encode(subirarchivo($target_path));

	if ($result['success'] == true) {
		$query = mysqli_query($mysqli, "UPDATE asp_segu_validar SET 
		asv_urlcertificacion	= '$target_path'
		WHERE asv_aspirante LIKE '$_POST[aspirante]'");
	}
	echo json_encode($result);
} else if ($_POST['task'] == 'subirseguentrenamiento') {

	$target_path = '../seguridad/entrenamiento/entrenamiento-' . $_POST['aspirante'] . '.' . $_POST['ext'];

	$result = json_encode(subirarchivo($target_path));

	if ($result['success'] == true) {
		$query = mysqli_query($mysqli, "UPDATE asp_segu_validar SET 
		asv_urlentrenamiento = '$target_path'
		WHERE asv_aspirante LIKE '$_POST[aspirante]'");
	}
	echo json_encode($result);
} else if ($_POST['task'] == 'subirsegumatrizriesgos') {

	$target_path = '../seguridad/matrizriesgos/matriz_riesgos-' . $_POST['aspirante'] . '.' . $_POST['ext'];

	$result = json_encode(subirarchivo($target_path));

	if ($result['success'] == true) {
		$query = mysqli_query($mysqli, "UPDATE asp_segu_validar SET 
		asv_urlmatrizriesgos	= '$target_path'
		WHERE asv_aspirante LIKE '$_POST[aspirante]'");
	}
	echo json_encode($result);
} else if ($_POST['task'] == 'subirseguevaluacion') {

	$target_path = '../seguridad/evaluaciones/evaluacion_conocimientos-' . $_POST['aspirante'] . '.' . $_POST['ext'];

	$result = json_encode(subirarchivo($target_path));

	if ($result['success'] == true) {
		$query = mysqli_query($mysqli, "UPDATE asp_segu_validar SET 
		asv_urlevaluacion	= '$target_path'
		WHERE asv_aspirante LIKE '$_POST[aspirante]'");
	}
	echo json_encode($result);
	
} else{
	echo $_POST;

}

function subirarchivo($target_path)
{

	if (move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
		header('Content-type: application/json');
		$data = ['success' => true, 'message' => 'Upload and move success'];
	} else {
		header('Content-type: application/json');
		$data = [
			'success' => false, 
			'url' => $target_path,
			'message' => 'There was an error uploading the file, please try again!'
		];
	}

	return $data;
}
