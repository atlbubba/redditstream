<?php

if(isset($argv)) {
	chdir('../../');
	define(__ROOT__, '/home/reednj/reddit-stream.com');
	require_once 'models/db.php';
	$result = CountPeriod::OpenNew();

	if($result != false) {
		print "New count period started\n";
	} else{
		print mysql_error();
	}
} else {
	print "Command line only script\n";
}

?>
