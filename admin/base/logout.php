<?php
	include('./conn.php');
	if (empty($_SESSION['uid'])) {
		header("Location:../login.html");
	} else {
		unset($_SESSION['uid']);
		echo "注销成功";
	}