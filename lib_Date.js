#include "Lib::lib_String.js"

/***************************************************************
 * ���� : �������� Check�ϴ� �Լ�
 * arg :
			str_yyyy : �⵵
 * return : 
			true = ����, false = ����ƴ�
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
 * ���� : �ش���� �Ǹ����� ��¥�� ã�� �Լ�
 * arg :
			str_yyyymm
 * return : 
			���� = �� ������ ��¥
			���� = -1
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
 * ���� : �־��� ��¥�� �����ϴ� ��¥���� üũ�ϴ� �Լ�
 * arg :
			str_date : yyyymmdd
 * return : 
			true = �����ϴ� ��¥, false = �������� �ʴ� ��¥
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
//  - ���� : ���� ����
//  - ������ : ""
function IsHoliday(yyyymmdd)
{
  var mmdd;
  var lunar;

  ////// ��� üũ
  mmdd = substr(yyyymmdd, 4, 4);
  // ���� Check
  if( mmdd == "0101" )
		return "the New Year";
/*
	// ������
	if( mmdd == "0301" )
		return "������";
	// �ĸ���
	if( mmdd == "0405" )
		return "�ĸ���";

	// ��̳�
	if( mmdd == "0505" )
		return "��̳�";
	// ������
	if( mmdd == "0606" )
		return "������";
	// ������
	if( mmdd == "0717" )
		return "������";
	// ������
	if( mmdd == "0815" )
		return "������";
	// ��õ��
	if( mmdd == "1003" )
		return "��õ��";
*/	// ��ź��
	if( mmdd == "1225" )
		return "Christmas ";
		
	/////// ���� üũ
  lunar = Solar2Lunar( yyyymmdd );
	mmdd = substr(lunar, 4, 4);
/*	
	// ����	
	if( mmdd == "1230" || mmdd == "0101" || mmdd == "0102" )
		return "����";
	// ������
	if( mmdd == "0408" )
		return "����ź����";
	// �߼�
	if( mmdd == "0814" || mmdd == "0815" || mmdd == "0816" )
		return "�߼�";
 */ 
  // �Ͽ��� Check
	if( GetDay(yyyymmdd) == 0 )
		return "Sun";
		  
  return "";
}
