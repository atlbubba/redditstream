<?php

require_once __ROOT__.'/shared/esql.inc.php';

class ErrorLog {
	static function Insert($action_name, $error_code, $error_message) {
		return ESQL::Insert('error_log', array(
			'action_name' => $action_name,
			'error_code' => $error_code,
			'error_message'=>$error_message
		));
	}

	static function InsertFromJson($action_name, $json_data) {
	    if(sizeof($json_data->json->errors) > 0) {
	      $error_code = $json_data->json->errors[0][0];
	      $error_message = $json_data->json->errors[0][1];
	      ErrorLog::Insert($action_name, $error_code, $error_message);
	    }
	}
}

class PageInfo {
	static function Insert($thread_id, $title) {
		return ESQL::Insert('page_info', array(
			'thread_id' => $thread_id,
			'title'=>$title
		));
	}

	// do we already have the title stored for that id? If so there
	// is no reason for the client to send it to the server
	static function HasTitle($thread_id) {
		$result = ESQL::SelectFirstField('page_info', array(
			'column_list'=>array('thread_id'),
			'where'=>array('thread_id'=>$thread_id)
		));

		return $result != null;
	}
}

class UsageCount {
	static function Insert($thread_id, $period_id) {
		ESQL::Insert('page_usage', array(
			'thread_id' => $thread_id,
			'period_id'=>$period_id
		));
	}

	static function Increment($thread_id, $period_id=null) {
		$thread_id = ESQL::Escape($thread_id);
		$period_id = ESQL::Escape($period_id);

		$count_id = self::GetCurrentId($thread_id, $period_id);

		if($count_id == null) {
			if($period_id == null) {
				$period_id = CountPeriod::GetCurrentId();
			}

			self::Insert($thread_id, $period_id);
		} else {
			ESQL::Query("update page_usage set view_count = view_count + 1 where count_id = '$count_id'");
		}
	}

	static function GetCurrentId($thread_id, $period_id=null) {
		$thread_id = ESQL::Escape($thread_id);
		$period_id = ESQL::Escape($period_id);

		if($period_id == null) {
			return ESQL::QueryFirstField("
			select
				u.count_id
			from page_usage u
				inner join usage_period up on up.period_id = u.period_id
			where
				up.end_date is null and
				u.thread_id = '$thread_id'");
		} else {
			return ESQL::QueryFirstField("select count_id from page_usage where period_id = '$period_id' and thread_id = '$thread_id'");
		}
	}

	static function GetCountAge() {
		$start_date = ESQL::QueryFirstField("select start_date from usage where end_date is null limit 1");
		return time() - strtotime($start_date);
	}

	static function GetCurrentTop($count=5) {
		return ESQL::Query("select
				u.thread_id,
				pf.title,
				sum(view_count) as views
			from page_usage u
				inner join page_info pf on pf.thread_id = u.thread_id
			where period_id > (select max(period_id) from usage_period) - 3
			group by thread_id
			order by views desc
			limit $count");
	}
}

class CountPeriod {
	static function OpenNew() {
		ESQL::Query('update usage_period set end_date = NOW() where end_date is null');
		return ESQL::Query('insert into usage_period(start_date) values(NOW())');
	}

	static function GetCurrentId() {
		return ESQL::QueryFirstField('select period_id from usage_period where end_date is null');
	}

	static function GetCurrent() {
		return ESQL::QueryFirstRow('select * from usage_period where end_date is null');
	}

	static function GetAge($current_period) {
		return time() - strtotime($current_period['start_date']);
	}
}

?>