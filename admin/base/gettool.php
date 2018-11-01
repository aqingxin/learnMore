<?php
	include('./conn.php');
	if (empty($_SESSION['uid'])) {
		echo '非法操作, 未登录';
	} else {
		$uid = $_SESSION['uid'];
		$select = "SELECT * FROM `user` WHERE `id` = '$uid'";
		$select_result = $conn -> query($select) -> fetch();
		
		if ($select_result['level'] === '1') {
			$sql = "SELECT * FROM `tool`";
		} else {
			$sql = "SELECT * FROM `tool` WHERE `uid` = '$uid'";
		}
		$sql_result = $conn -> query($sql) -> fetchAll();
		echo json_encode($sql_result);
	}