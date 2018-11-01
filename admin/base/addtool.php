<?php
	include('./conn.php');
	$toolName = $_POST['tool-name'];
	$toolAddress = $_POST['tool-address'];
	$toolMsg = $_POST['tool-msg'];
	$time = time();
	$date = date('Y-m-d H:i:s');
	if (empty($_SESSION['uid'])) {
		echo '非法操作';
	} else if (empty($toolName) || empty($toolAddress) || empty($toolMsg) || empty($_FILES['file']['name'])) {
		echo '工具名称或工具地址或工具说明或图片不能为空';
	} else {
		$uid = $_SESSION['uid'];
		$imgurl = "./toolimg/$time.jpg";
		$filename = $_FILES['file']['name'];

		$sql = "SELECT * FROM `user` WHERE `id` = '$uid'";
		$result = $conn -> query($sql) -> fetch();
		$u_name = $result['username'];

		move_uploaded_file($_FILES['file']['tmp_name'], "../toolimg/$time.jpg");
		$insert = "INSERT INTO `tool`(`id`, `uid`, `u_name`, `toolname`, `addres`, `toolimg`, `toolmsg`, `addTime`) VALUES (null, '$uid', '$u_name', '$toolName', '$toolAddress', '$imgurl', '$toolMsg', '$date')";
		$conn -> exec($insert);
		echo '添加成功';
	}