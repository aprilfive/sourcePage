#include "Lib::lib_String.js"
/*****************************************************************************
* 1. 함 수 명 : IsSaupno( saupno )
* 2. 파라미터 : saupno : 사업자 등록번호('-'는 뺄것)
* 3. 리 턴 값 : 성공 : true 
				실패 : false
* 4. 설    명 : saupno에 해당하는 사업자등록번호를 validation한다.
*****************************************************************************/
function IsSaupno( saupno )
{
	var				temp;

	if( Length(saupno) != 10 )
	{
		return false;
	}
	if( IsNumber( saupno ) == false )
	{
		return false;
	}
	temp = ToInteger(ToInteger(saupno[8])*5/10);
	if( ToInteger(saupno[9]) !=
		(( 10 - (((ToInteger(saupno[0])*1)%10 ) +
				((ToInteger(saupno[1])*3)%10 ) +
				((ToInteger(saupno[2])*7)%10 ) +
				((ToInteger(saupno[3])*1)%10 ) +
				((ToInteger(saupno[4])*3)%10 ) +
				((ToInteger(saupno[5])*7)%10 ) +
				((ToInteger(saupno[6])*1)%10 ) +
				((ToInteger(saupno[7])*3)%10 ) +
				temp +
				((ToInteger(saupno[8])*5)%10 ))%10)%10) )
	{
		return false;
	}

	return true;
}

/*****************************************************************************
* 1. 함 수 명 : IsJuminno( jumin_no )
* 2. 파라미터 : jumin_no : 주민등록번호('-'는 뺄것)
* 3. 리 턴 값 : 성공 : true
				실패 : false
* 4. 설    명 : jumin_no에 해당하는 주민등록번호를 validation한다.
*****************************************************************************/
function IsJuminno( jumin_no )
{
	var				i, len, sum, ret = 0, na;
	var				cksum = "234567892345";

    len = Length( jumin_no );
    if( len != 13 )
    {
        return false;
    }
	if( IsNumber( jumin_no ) == false )
	{
		return false;
	}

    for( i = 0, sum = 0 ; i < 12 ; i++ )
    {
        sum += ToInteger(jumin_no[i]) * ToInteger(cksum[i]);
    }
    na = sum%11;
    if( ( 11 - na ) != ToInteger(jumin_no[12]) )
    {
        return false;
    }
    if( na == 1 )
    {
        if( ToInteger(jumin_no[12]) == 0 )
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else if( na == 0 )
    {
        if( ToInteger(jumin_no[12]) == 1 )
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return true;
    }
}

