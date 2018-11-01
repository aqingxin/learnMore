<?php
	include('./conn.php');
	$toolId = $_POST['toolId'];
	$toolName = $_POST['toolName'];
	$toolAddRess = $_POST['toolAddRess'];
	$toolMsg = $_POST['toolMsg'];
	$toolImg = $_POST['toolImg'];

	$sql = "SELECT * FROM `tool` WHERE `id` = '$toolId'";
	$sql_res = $conn -> query($sql) -> fetch();

	if (empty($_SESSION['uid'])) {
		header("Location:../login.html");
	} else if (empty($toolName) || empty($toolAddRess) || empty($toolMsg) || empty($toolImg)) {
		echo '工具名称或工具地址或工具说明或工具图片不能为空';
	} else if ($toolName === $sql_res['toolname'] && $toolAddRess === $sql_res['addres'] && $toolMsg === $sql_res['toolmsg'] && $toolImg === $sql_res['toolimg']) {
		echo '重复提交信息';
	} else {
		$upDate = "UPDATE `tool` SET `toolname` = '$toolName', `addres` = '$toolAddRess', `toolimg` = '$toolImg', `toolmsg` = '$toolMsg' WHERE `id` = '$toolId'";
		$conn -> exec($upDate);
		echo '修改成功';
	}