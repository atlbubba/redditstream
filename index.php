<?php

require_once 'models/db.php';
require_once 'shared/Slim/Slim.php';
require_once 'shared/Slim/Views/TwigView.php';

TwigView::$twigDirectory = __DIR__ . '/shared/Slim/Views/Twig';

$app = new Slim(array(
	'view' => new TwigView()
));

$app->config(array(
    'debug' => true,
    'templates.path' => 'views'
));

require_once 'controllers/home.php';

$app->run();

?>
