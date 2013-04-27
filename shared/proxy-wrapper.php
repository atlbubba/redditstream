<?php
// Nathan Reed

define('__ROOT__', dirname(dirname(__FILE__)));
require_once __ROOT__.'/models/db.php';

if(isset($_GET['url'])) {
  $url = $_GET['url'];
  $action = get_action_name($url);
  ESQL::Insert('action_usage', array('action_name' => $action));

  if($action === null) {
    exit(0);
  }
}

include 'ba-simple-proxy.php';

if(isset($status['http_code'])) {
  if($status['http_code'] != 200) {
    ErrorLog::Insert($status['http_code'], $status['http_code']);
  } else if(strpos($status['content_type'], 'application/json') !== null) {
    $json_data = json_decode($contents);

    if(sizeof($json_data->json->errors) > 0) {
      ErrorLog::InsertFromJson($action, $json_data);
    }
  }

}

function get_action_name($url) {
  if(strpos($url, '/api/login') != null) {
    return 'login';
  } else if(strpos($url, '/api/vote') != null) {
    return 'vote';
  } else if(strpos($url, '/api/comment') != null) {
    return 'comment';
  } else {
    return null;
  }
}

?>
