<?php
	$username = $_POST['username'];
	$password = md5($_POST['password']);

	if (empty($username) || empty($password)) {
		echo '用户名密码不能为空';
	} else if (mb_strlen($username) > 6) {
		echo '用户名不能超过6个字符';
	} else {
		include('./conn.php');
		$select = "SELECT * FROM `user` WHERE `username` = '$username'";
		$result = $conn -> query($select) -> fetch();
		if (!$result) {
			echo '用户名不存在, 请注册!';
		} else if ($password !== $result['password']) {
			echo '密码错误';
		} else if (isset($_SESSION['uid']) && $_SESSION['uid'] === $result['id']) {
			echo '请勿重复登陆';
		} else {
			$_SESSION['uid'] = $result['id'];
			echo '登陆成功';
		}
	}