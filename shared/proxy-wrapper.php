<?php
// Nathan Reed

define('__ROOT__', dirname(dirname(__FILE__)));
require_once __ROOT__.'/models/db.php';

if(isset($_GET['url'])) {
  $url = $_GET['url'];
  $action = get_action_name($url);
  ESQL::Insert('action_usage', array('action_name' => $action));

}

include 'ba-simple-proxy.php';

function get_action_name($url) {
  if(strpos($url, '/api/login') != null) {
    return 'login';
  } else if(strpos($url, '/api/vote') != null) {
    return 'vote';
  } else if(strpos($url, '/api/comment') != null) {
    return 'comment';
  }
}

?>
