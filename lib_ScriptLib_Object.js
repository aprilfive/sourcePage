function Obj_Clock()
{
	var		date_str;
	var		hh, mi, ss, pm;
	
	date_str = GetDate();
	hh = substr(date_str,8,2);
	mi = substr(date_str,10,2);
	ss = substr(date_str,12,2);
	if( ToInteger(hh) >= 0 && ToInteger(hh) < 12 )
	{
		pm = "AM";
	}
	else
	{
		pm = "PM";	
		if( ToInteger(hh) > 12 )
			hh = ToInteger(hh)-12;
	}
	return " " + pm + "  " + hh + " : " + mi + " : " + ss;
}

// ProgressBar 처리
// 2004.07.14일 이후 Version부터 가능
function Obj_ProgressBar(obj, obj_max_width, tot_size, cur_size, refresh_flag)
{
	var		rate;
	
	if( obj == null )
		return;
	rate = round(100*(cur_size/100)/(tot_size/100));
	
	if( refresh_flag == false )
		return rate;

	obj.width = rate*obj_max_width/100;
	Idle();	
		
	return rate;
}
