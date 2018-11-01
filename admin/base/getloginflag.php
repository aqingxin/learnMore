<?php
	include('./conn.php');
	if (empty($_SESSION['uid'])) {
		echo '未登录';
	} else {
		$uid = $_SESSION['uid'];
		$sql = "SELECT * FROM `user` WHERE `id` = '$uid'";
		$result = $conn -> query($sql) -> fetch();
		echo json_encode($result);
	}
