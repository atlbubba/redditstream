<?php

require_once 'shared/esql.inc.php';

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