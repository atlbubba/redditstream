<?php
/*
 * All posts controller.
 *
 * Gets all the comment and post data and sends it to the view to be rendered
 * into a newfeed type display.
 *
 * Nathan Reed, 2011-03-22
 */


$app->get('/', function() use ($app) {
	$app->render('home.twig');
});

$app->get('/comments/:id', function($id) use ($app) {
	$app->render('thread.twig', array('thread_id' => $id, 'root'=>'/redditstream'));
});

?>
