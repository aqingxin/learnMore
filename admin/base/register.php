<?php
	$username = $_POST['uesrname'];
	$password = $_POST['password'];
	$repeat = $_POST['repeat_password'];
	$regtime = date("Y-m-d H:i:s");
	$username_len = mb_strlen($username);

	if (empty($username) || empty($password) || empty($repeat)) {
		echo  "用户名和密码和确认密码不能为空";
	} else if ($username_len > 6) {
		echo '用户名不能超过6位字符';
	} else if ($password !== $repeat) {
		echo '密码和确认密码不一致';
	} else {
		include('./conn.php');
		$sql = "SELECT * FROM `user` WHERE `username` = '$username'";
		$result = $conn -> query($sql) -> fetch();
		$md5_password = md5($password);
		if ($result) {
			echo ' 用户名已存在';
		} else {
			$insert = "INSERT INTO `user` (`id`, `username`, `password`, `level`, `regtime`) VALUES (null, '$username', '$md5_password', '0', '$regtime')";
			$result_insert = $conn -> exec($insert);
			if ($result_insert) echo '注册成功'; 
		}
	}
	