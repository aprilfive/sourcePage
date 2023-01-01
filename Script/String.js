﻿/***************************************************************
 * 설명 : String 비교함수
 * arg :
			str : 비교 String
			str1 : 비교 String
 * return : 
			같으면 true, 다르면 false
****************************************************************/
function Str_cmp( str, str1 )
{
	if( "x"+str == "x"+str1 )
		return 0;
	return -1;
}

/***************************************************************
 * 설명 : size만큼 String 을 비교하는 함수
 * arg :
			str : 비교 String
			str1 : 비교 String
			n : size
			start_pos : 비교를 시작할 위치
 * return : 
			같으면 true, 다르면 false
****************************************************************/
function Str_ncmp( str, str1, n, start_pos )
{
	var	str_tmp, str_tmp1;
	
	if( "x"+start_pos != "x" )
	{
		str_tmp = Substr( str, start_pos, n );
		str_tmp1 = Substr( str1, start_pos, n );
	}
	else
	{
		str_tmp = Substr( str, 0, n );
		str_tmp1 = Substr( str1, 0, n );
	}
	return Str_cmp( str_tmp, str_tmp1 );
}

/***************************************************************
 * 설명 : 대소문자 구별안하는 String 비교함수
 * arg :
			str : 비교 String
			str1 : 비교 String
 * return : 
			같으면 true, 다르면 false
****************************************************************/
function Str_casecmp( str, str1 )
{
	return Str_cmp(ToUpper(str), ToUpper(str1));
}

/***************************************************************
 * 설명 : 대소문자 구별안하면서 size만큼 String 을 비교하는 함수
 * arg :
			str : 비교 String
			str1 : 비교 String
			n : size
			start_pos : 비교를 시작할 위치
 * return : 
			같으면 true, 다르면 false
****************************************************************/
function Str_ncasecmp( str, str1, n, start_pos )
{
	var	str_tmp, str_tmp1;

	if( "x"+start_pos != "x" )
	{
		str_tmp = Substr( str, start_pos, n );
		str_tmp1 = Substr( str1, start_pos, n );
	}
	else
	{
		str_tmp = Substr( str, 0, n );
		str_tmp1 = Substr( str1, 0, n );
	}

	return Str_casecmp( str_tmp, str_tmp1 );
}

/***************************************************************
 * 설명 : 문자열내에 포함된 문자열의 갯수 구하는 함수
 * arg :
			str : 전체 문자열
			count_str : 찾고자 하는 문자열
 * return : 
			찾은 문자열 갯수
****************************************************************/
function Str_Count(str, count_str)
{
	var		i;
	var		count = 0;
	var		len;

	len = str.Length();
	for( i = 0 ; i < len ; )
	{
		if( Substr(str,i,count_str.Length()) == count_str )
		{
			count++;
			i += count_str.Length();
		}
		else
			i++;
	}
	return count;
}

/***************************************************************
 * 설명 : 문자열을 왼쪽부터 잘라내는 함수
 * arg :
			str : 원본 String
			trim_str : 잘라내고자 하는 문자열
 * return : 
			잘라낸 문자열
****************************************************************/
function Str_Ltrim(str, trim_str)
{
	var		i;
	var		len;

	len = str.Length();
	for( i = 0 ; i < len ; )
	{
		if( Substr(str,i,trim_str.Length()) == trim_str )
		{
			i += trim_str.Length();			
		}
		else
			break;
	}
	return Substr(str, i, len - i);
}

/***************************************************************
 * 설명 : 문자열을 오른쪽부터 잘라내는 함수
 * arg :
			str : 원본 String
			trim_str : 잘라내고자 하는 문자열
 * return : 
			잘라낸 문자열
****************************************************************/
function Str_Rtrim(str, trim_str)
{
	var		i;

	for( i = str.Length()-trim_str.Length() ; i >= 0 ;  )
	{
		if( Substr(str, i, trim_str.Length()) == trim_str )
		{
			i -= trim_str.Length();
		}
		else
			break;
	}
	return Substr(str, 0, i+trim_str.Length());
}

/***************************************************************
 * 설명 : 문자열을 왼쪽, 오른쪽 모두부터 잘라내는 함수
 * arg :
			str : 원본 String
			trim_str : 잘라내고자 하는 문자열
 * return : 
			잘라낸 문자열
****************************************************************/
function Str_Trim(str, trim_str)
{
	var		buff;
	buff = Str_Rtrim(str, trim_str);
	return Str_Ltrim(buff, trim_str);
}

/***************************************************************
 * 설명 : 문자열내에서 문자열의 위치를 찾는 함수
 * arg :
			str : 원본 String
			find_str : 찾고자 하는 문자열
			start_pos : 찾기 시작할 위치
 * return : 
			찾은 위치
****************************************************************/
function Str_Find(str, find_str, start_pos)
{
	var		len;

	len = str.Length();
	for( i = start_pos ; i < len ; )
	{
		if( Substr(str,i,find_str.Length()) == find_str )
			break;
		else
			i++;
	}
	return i;
}

/***************************************************************
 * 설명 : 문자열내에서 대소문자 구분없이 문자열의 위치를 찾는 함수
 * arg :
			str : 원본 String
			find_str : 찾고자 하는 문자열
			start_pos : 찾기 시작할 위치
 * return : 
			찾은 위치
****************************************************************/
function Str_FindCase(str, find_str, start_pos)
{
	var		len;
	var		sub_str;

	len = str.Length();
	for( i = start_pos ; i < len ; )
	{
		sub_str = Substr(str,i,find_str.Length());
		if(ToUpper(sub_str) == ToUpper(find_str) )
			break;
		else
			i++;
	}
	return i;
}

/***************************************************************
 * 설명 : 문자열내에서 문자열의 위치를 끝에서 부터찾는 함수
 * arg :
			str : 원본 String
			find_str : 찾고자 하는 문자열
			start_pos : 찾기 시작할 위치
 * return : 
			찾은 위치
****************************************************************/
function Str_ReverseFind(str, find_str, start_pos)
{
	if( "x"+start_pos == "x" )
		start_pos = str.Length();
		
	for( i = start_pos ; i >= 0 ; )
	{
		if( Substr(str,i,find_str.Length()) == find_str )
			break;
		else
			i--;
	}
	return i;
}

/***************************************************************
 * 설명 : 문자열내에서 문자열의 위치를 대소문자 구분없이 끝에서 부터찾는 함수
 * arg :
			str : 원본 String
			find_str : 찾고자 하는 문자열
			start_pos : 찾기 시작할 위치
 * return : 
			찾은 위치
****************************************************************/
function Str_ReverseFindCase(str, find_str, start_pos)
{
	var		sub_str;

	if( "x"+start_pos == "x" )
		start_pos = str.Length();

	for( i = start_pos ; i >= 0 ; )
	{
		sub_str = Substr(str,i,find_str.Length());
		if(ToUpper(sub_str) == ToUpper(find_str) )
			break;
		else
			i--;
	}
	return i;
}

/***************************************************************
 * 설명 : 문자열을 Tokening하는 함수
 * arg :
			buff : Tokening할 문자열
			token_str : Tokening하고자 하는 문자열
			n: 찾기 시작할 위치
			esc_ch : escape character
 * return : 
			arr[0] : Tokening된 문자열
			arr[1] : Tokening이 끝난 위치
****************************************************************/
function Str_Token( buff, token_str, n, esc_ch )
{
	var		str_tmp="", str="";
	var		flag=0, chg_flag=0;
	var		count;
	var		pos, old_pos;
	var		token_str_len;
	var		pos;
	var		arr=array(2);	
	
	pos = n;
	while(1)
	{	
		chg_flag = 0;
		old_pos = pos;
		pos = Str_Find(buff, token_str, pos);
		str_tmp = Substr(buff, old_pos, pos - old_pos);
		pos += token_str.Length();		
		count = Str_count(str_tmp, esc_ch);
		if( count%2 == 0 )
		{
			if( flag == 0 )
				flag = 0;
			else
			{
				flag = 1;
				chg_flag = 1;
			}					
		}
		else
		{
			if( str_tmp[0] == esc_ch )
			{
				if( flag == 0 )
					flag = 1;
				else
				{	
					chg_flag = 1;
					flag = 0;
				}
			}
			else
			{
				if( flag == 0 )
					flag = 2;
				else
				{
					chg_flag = 1;
					flag = 0;
				}
			}
		}
		if( chg_flag == 1 )
			str_tmp = token_str + str_tmp;
		str += str_tmp;
		if( flag == 0 )
			break;	
		;
	}
	arr[0] = str;	// string
	arr[1] = pos;	// token number
	return arr;
}

/***************************************************************
 * 설명 : 문자열이 숫자로만 되어있는지 판단하는 함수
 * arg :
			str : 원본 String
 * return : 
			true = 숫자로만 되어있음, false = 숫자이외의 것도 있음
****************************************************************/
function IsNumber(str)
{
	var		i;
	var		len;
	var		c;
	
	len = Length(str);
	for( i = 0 ; i < len ; i++ )
	{
		c = str[i];
		if( ( i == 0 && c == '-' ) ||
			( c >= '0' && c <= '9' ) );
		else
			return false;
	}
	return true;
}

/***************************************************************
 * 설명 : 문자열이 Alphabet로만 되어있는지 판단하는 함수
 * arg :
			str : 원본 String
 * return : 
			true = Alphabet로만 되어있음, false = Alphabet이외의 것도 있음
****************************************************************/
function IsAlpha(str)
{
	var		i;
	var		len;
	var		c;
	
	len = Length(str);
	for( i = 0 ; i < len ; i++ )
	{
		c = str[i];
		if( ( c >= 'a' && c <= 'z' ) ||
			( c >= 'A' && c <= 'Z' ) );
		else
			return false;
	}
	return true;
}

/***************************************************************
 * 설명 : 문자열이 숫자+Alphabet로만 되어있는지 판단하는 함수
 * arg :
			str : 원본 String
 * return : 
			true = 숫자+Alphabet로만 되어있음, false = 이외의 것도 있음
****************************************************************/
function IsAlnum(str)
{
	var		i;
	var		len;
	var		c;
	
	len = Length(str);
	for( i = 0 ; i < len ; i++ )
	{
		c = str[i];
		if( ( c >= '0' && c <= '9' ) ||
			( c >= 'a' && c <= 'z' ) ||
			( c >= 'A' && c <= 'Z' ) );
		else
			return false;
	}
	return true;
}

/***************************************************************
 * 설명 : 문자열이 대문자로만 되어있는지 판단하는 함수
 * arg :
			str : 원본 String
 * return : 
			true = 대문자로만 되어있음, false = 이외의 것도 있음
****************************************************************/
function IsUpper(str)
{
	var		i;
	var		len;
	var		c;
	
	len = Length(str);
	for( i = 0 ; i < len ; i++ )
	{
		c = str[i];
		if( ( c >= 'A' && c <= 'Z' ) );
		else
			return false;
	}
	return true;
}

/***************************************************************
 * 설명 : 문자열이 소문자로만 되어있는지 판단하는 함수
 * arg :
			str : 원본 String
 * return : 
			true = 소문자로만 되어있음, false = 이외의 것도 있음
****************************************************************/
function IsLower(str)
{
	var		i;
	var		len;
	var		c;
	
	len = Length(str);
	for( i = 0 ; i < len ; i++ )
	{
		c = str[i];
		if( ( c >= 'a' && c <= 'z' ) );
		else
			return false;
	}
	return true;
}

/***************************************************************
 * 설명 : 문자열을 Tokening하는 함수
 * arg :
			str : 원본 String
			token : Token String
			pos : 시작 위치
 * return : 
			arr[32] : Tokening된 문자열 = array
****************************************************************/
function Str_Split( str, token, pos )
{
	var		arr=array(32);
	var		cnt=0;
	var		pos1;
	
	while(1)
	{
		pos1 = Str_Find(str, token, pos);
		arr[cnt] = Substr(str, pos, pos1-pos);
		cnt++;
		pos = pos1 + token.Length();
		if( pos >= str.Length() )
			break;
	}
	return arr;
}

/***************************************************************
 * 설명 : 숫자로된 문자열에 ","를 붙이는 함수
 * arg :
			str : ","가 안붙은 String
 * return : 
			","가 붙은 String
****************************************************************/
function Put_comma(str)
{
	var i, len, ret_str, c_pos;
	if( str == null || str == "" )
		return "";
	len = Length(str);
	ret_str = "";
	c_pos = ((len%3)+2)%3;
	for( i = 0 ; i < len ; i++ )
	{
		ret_str += CharAt(str, i);
		if( i%3 == c_pos )
		{
			if( i != (len-1) )
				ret_str += ",";
		}
	}
	return ret_str;
}

/***************************************************************
 * 설명 : 10진수를 Hexa값으로 변경
 * arg :
			str : 변경하고자 하는 10진수
 * return : 
			Hexa String
****************************************************************/
function Str2hex( str )
{
	var		hex;
	if( str == "10" )	hex = "A";	
	else if( str == "11" )	hex = "B";
	else if( str == "12" )	hex = "C";
	else if( str == "13" )	hex = "D";
	else if( str == "14" )	hex = "E";
	else if( str == "15" )	hex = "F";
	else if( ToInteger(str) < 0 )	hex = "0";
	else if( ToInteger(str) >= 0 && ToInteger(str) <= 9) hex = str;
	else if( ToInteger(str) >= 16 )	hex = "F";
	else	hex = "F";

	return(hex);
}

/***************************************************************
 * 설명 : Hexa값을 10진수로 변경
 * arg :
			hex : Hexa String
 * return : 
			10진수 String
****************************************************************/
function Hex2str( hex )
{
	var		str;
	if( hex == "A" || hex == "a" ) str = "10";
	else if( hex == "B" || hex == "b" )	str = "11";
	else if( hex == "C" || hex == "c" )	str = "12";
	else if( hex == "D" || hex == "d" )	str = "13";
	else if( hex == "E" || hex == "e" )	str = "14";
	else if( hex == "F" || hex == "f" )	str = "15";
	else if( ToInteger(hex) < 0 )	str = "0";
	else if( ToInteger(hex) >= 0 && ToInteger(hex) <= 9 ) str = hex;
	else str = "F";

	return(str);
}

/***************************************************************
 * 설명 : Hexa로 된 Rgb값을 Integer로 변경
 * arg :
			hex_str : Hexa로 된 String
 * return : 
			Integer로 변경된 Rgb값(arr[0] = r, arr[1] = g, arr[2] = b)
****************************************************************/
function Rgb2Int(hex_str)
{
	var arr_hex=array(6);
	var arr_int=array(3);
	var i;
	// #rgb ==> arr_int
	for(i = 0 ; i < 6 ; i++ )
		arr_hex[i] = Substr(hex_str, i+1, 1);
	for(i = 0 ; i < 3 ; i++ )
		arr_int[i] = ToInteger(Hex2Str(arr_hex[i*2]))*16 + ToInteger(Hex2Str(arr_hex[i*2+1]));
	return arr_int;
}

/***************************************************************
 * 설명 : Integer Rgb값을 Hexa String으로 변경
 * arg :
			int_arr : Rgb Integer값(int_arr[0] = r, int_arr[1] = g, int_arr[2] = b
 * return : 
			Hexa로 변경된 Rgb값(#rrggbb)
****************************************************************/
function Int2Rgb(int_arr)
{
	var hex="#";
	for( i = 0 ; i < 3 ; i++ )
	{
		hex += Str2Hex(Truncate(int_arr[i]/16));
		hex += Str2Hex(int_arr[i]%16);
	}
	return hex;
}

/***************************************************************
 * 설명 : 두 수중 큰 수 찾기
 * arg :
			a : 비교 숫자
			b : 비교 숫자
 * return : 
			큰 값
****************************************************************/
function Max( a, b )
{
	if( a > b )
		return a;
	else
		return b;
}

/***************************************************************
 * 설명 : 두 수중 작은 수 찾기
 * arg :
			a : 비교 숫자
			b : 비교 숫자
 * return : 
			작은 값
****************************************************************/
function Min( a, b )
{
	if( a < b )
		return a;
	else
		return b;
}