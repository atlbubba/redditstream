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
	$top_links = UsageCount::GetCurrentTop();
	$url_root = ($_SERVER['SERVER_NAME'] == 'localhost')? 'localhost/redditstream' : 'reddit-stream.com';

	$app->render('home.twig', array(
		'url_root'=> $url_root,
		'top_links'=> $top_links
	));
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

$app->get('/stats/increment/:id/', function($id) use ($app) {

	// update the count for this thread
	if(!isset($_GET['title'])) {
		print json_encode(array('error'=>'Invalid Arguments'));
		return;
	}

	PageInfo::Insert($id, $_GET['title']);
	UsageCount::Increment($id);

	print '{}';
});

?>
