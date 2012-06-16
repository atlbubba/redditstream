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

$app->get('/r/:subreddit/comments/:id/', function($subreddit, $id) use ($app) {
	$app->redirect("/comments/$id");
});

$app->get('/r/:subreddit/comments/:id/(:name/)', function($subreddit, $id, $name) use ($app) {
	$app->redirect("/comments/$id");
});

$app->get('/comments/:id/', function($id) use ($app) {

	$fs_root = ($_SERVER['SERVER_NAME'] == 'localhost')? '/redditstream' : '';
	$app->render('thread.twig', array('thread_id' => $id, 'root' => $fs_root));
});

?>
