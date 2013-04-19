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

	if(PageInfo::HasTitle($id)) {
		$send_title = false;
		//UsageCount::Increment($id);
	} else {
		$send_title = true;
	}

	$app->render('thread.twig', array('thread_id' => $id, 'root' => $fs_root, 'send_title' => $send_title));
});

$app->get('/pageusage/increment/:id', function($id) use ($app) {
	$title = $app->request()->get('title');

	if($title != null) {
		PageInfo::Insert($id, $title);
	}

	UsageCount::Increment($id);

	print '{}';
});

?>
