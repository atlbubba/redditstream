<?php

if(isset($argv)) {
	chdir('../../');
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
