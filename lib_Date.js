#include "Lib::lib_String.js"

/***************************************************************
 * 설명 : 윤년인지 Check하는 함수
 * arg :
			str_yyyy : 년도
 * return : 
			true = 윤년, false = 윤년아님
****************************************************************/
function IsLeapYear(str_yyyy)
{
	var		i;
	var		int_year;

	int_year = ToInteger(substr(str_yyyy, 0, 4));
	if( int_year%4 == 0 )
	{
		if( int_year%100 == 0 )
		{
			if( int_year%400 == 0 )
			{
				return true; 
			}
			return false;
		}
		return true;        
	}
	return false;
}

/***************************************************************
 * 설명 : 해당월의 맨마지막 날짜를 찾는 함수
 * arg :
			str_yyyymm
 * return : 
			성공 = 맨 마지막 날짜
			실패 = -1
****************************************************************/
function GetLastDay(str_yyyymm)
{
	var   int_year, int_month;
	var		len;
	var		yy, mm, last_day, dd;
	var		c;

	int_year = ToInteger(substr(str_yyyymm, 0, 4));
	int_month = ToInteger(substr(str_yyyymm, 4, 2));
	if( int_month < 1 || int_month > 12 )
	{
		return -1;
	}
	if ( int_month == 2 )
	{
		if ( (int_year%4) == 0 && (int_year%100) != 0 || (int_year%400) == 0 )
		{
			last_day = 29;
		}
		else
		{
			last_day = 28;
		}
	}
	else if ( int_month == 4 || int_month == 6 || int_month == 9 || int_month == 11 )
	{
		last_day = 30;
	}
	else
	{
		last_day = 31;
	}

	return last_day;
}

/***************************************************************
 * 설명 : 주어진 날짜가 존재하는 날짜인지 체크하는 함수
 * arg :
			str_date : yyyymmdd
 * return : 
			true = 존재하는 날짜, false = 존재하지 않는 날짜
****************************************************************/
function IsDate(str_date)
{
	var		i;
	var		len;
	var		yy, mm, last_day, dd;
	var		c;

	len = Length(str_date);
	if( len <= 0 || len > 8 )
	{
		return false;
	}

	if( IsNumber(str_date) == false )
	{
		return false;
	}
	
	dd = ToInteger(substr(str_date, 6, 2 ));
	
	last_day = GetLastDay(str_date);
	if( last_day < 0 )
	{
		return false;
	}
	if( dd < 1 || dd > last_day )
	{
		return false;
	}
	return true;	
}

////// Return
//  - 휴일 : 휴일 글자
//  - 비휴일 : ""
function IsHoliday(yyyymmdd)
{
  var mmdd;
  var lunar;

  ////// 양력 체크
  mmdd = substr(yyyymmdd, 4, 4);
  // 신정 Check
  if( mmdd == "0101" )
		return "the New Year";
/*
	// 삼일절
	if( mmdd == "0301" )
		return "삼일절";
	// 식목일
	if( mmdd == "0405" )
		return "식목일";

	// 어린이날
	if( mmdd == "0505" )
		return "어린이날";
	// 현충일
	if( mmdd == "0606" )
		return "현충일";
	// 제헌절
	if( mmdd == "0717" )
		return "제헌절";
	// 광복절
	if( mmdd == "0815" )
		return "광복절";
	// 개천절
	if( mmdd == "1003" )
		return "개천절";
*/	// 성탄절
	if( mmdd == "1225" )
		return "Christmas ";
		
	/////// 음력 체크
  lunar = Solar2Lunar( yyyymmdd );
	mmdd = substr(lunar, 4, 4);
/*	
	// 구정	
	if( mmdd == "1230" || mmdd == "0101" || mmdd == "0102" )
		return "설날";
	// 초파일
	if( mmdd == "0408" )
		return "석가탄신일";
	// 추석
	if( mmdd == "0814" || mmdd == "0815" || mmdd == "0816" )
		return "추석";
 */ 
  // 일요일 Check
	if( GetDay(yyyymmdd) == 0 )
		return "Sun";
		  
  return "";
}
