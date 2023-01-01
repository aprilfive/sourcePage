#include "Lib::lib_String.js"
/*****************************************************************************
* 1. �� �� �� : IsSaupno( saupno )
* 2. �Ķ���� : saupno : ����� ��Ϲ�ȣ('-'�� ����)
* 3. �� �� �� : ���� : true 
				���� : false
* 4. ��    �� : saupno�� �ش��ϴ� ����ڵ�Ϲ�ȣ�� validation�Ѵ�.
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
* 1. �� �� �� : IsJuminno( jumin_no )
* 2. �Ķ���� : jumin_no : �ֹε�Ϲ�ȣ('-'�� ����)
* 3. �� �� �� : ���� : true
				���� : false
* 4. ��    �� : jumin_no�� �ش��ϴ� �ֹε�Ϲ�ȣ�� validation�Ѵ�.
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

