<?php

include "library/config.php";


if ($_POST['task'] == 'subirfichapsico') {
	
	$target_path = '../psicologia/'. $_POST['aspirante'] . '.' . $_POST['ext'];

	$result = json_encode(subirarchivo($target_path));

	if($result['success']==true){
		$query = mysqli_query($mysqli, "UPDATE asp_psico_validar SET 
		apv_urlficha	= '$target_path'
		WHERE apv_aspirante LIKE '$_POST[aspirante]'");
	}
	
	echo json_encode($result);
}else if ($_POST['task'] == 'subirfichamedi') {
	
	$target_path = '../medicina/'. $_POST['aspirante'] . '.' . $_POST['ext'];

	$result = json_encode(subirarchivo($target_path));

	if($result['success']==true){
		$query = mysqli_query($mysqli, "UPDATE asp_medi_validar SET 
		amv_urlficha	= '$target_path'
		WHERE amv_aspirante LIKE '$_POST[aspirante]'");
	}
	
	echo json_encode($result);
}

function subirarchivo($target_path)
{

    if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
        header('Content-type: application/json');
        $data = ['success' => true, 'message' => 'Upload and move success'];
    } else{
        header('Content-type: application/json');
        $data = ['success' => false, 'url' => $target_path, 
            'message' => 'There was an error uploading the file, please try again!'];
    }

	return $data;

}

