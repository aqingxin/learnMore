<?php
	try{
		$conn = new PDO('mysql:host=localhost; dbname=myuser', 'root', '', array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
		session_start();
		date_default_timezone_set('PRC');
	} catch (PDOException $e) {
		echo $e -> getmessage();
	}

