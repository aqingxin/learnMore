<?php
	include('./conn.php');
	if (empty($_SESSION['uid'])) {
		header('Location:../login.html');
	} else {
		$id = $_GET['id'];
		$delete = "DELETE FROM `tool` WHERE `id` = '$id'";
		$conn -> exec($delete);
		echo '删除成功';
	}