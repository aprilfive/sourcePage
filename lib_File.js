#include "Lib::lib_String.js"
/***************************************************************
 * 설명 : File에서 한줄씩 읽는 함수
 * arg :
			File_obj : File Object
 * return : 
			한줄 읽은 String
****************************************************************/
function File_Fgets(File_obj)
{
	var	str = null;
	var	ch;
	while(1)
	{
		ch = File_obj.Read(1);
		if( ch == null )
		{
			break;
		}
		if( ch == "\r" || ch == "\n" )
		{
			break;
		}	
		else
		{
			str += ch;
		}
	}

	return str;
}

/***************************************************************
 * 설명 : ini file에서 값 가져오는 함수
 * arg :
			buff : File안의 내용
			section : [section]형태로 된 String
			key : key=key_str 형태로 된 key에 해당하는 String
			default_value : section, key가 없을때 Return할 Default값
 * return : 
			성공 : section, key에 해당하는 String
			실패 : default value
****************************************************************/
function File_GetProfileStr(buff, section, key, default_value)
{
	var		arr, arr_key, line_str;
	var		flag;
	var		i;
	
	arr = split(buff, Chr(10));
	flag = 0;
	for( i = 0 ; i < arr.Length() ; i++ )
	{
		line_str = Str_Rtrim(arr[i], Chr(13));
		if(line_str[0] == '#' )
			continue;
		if( line_str == "[" + section + "]" )
		{
			flag = 1;									
		}
		else if( flag == 1 )
		{
			arr_key = split(line_str, "=");
			if( arr_key[0] == key )
			{
				return arr_key[1];
			}	
		}
	}	
	return default_value;
}

/***************************************************************
 * 설명 : File의 Size를 알아내는 함수
 * arg :
			FileDialog_obj : FileDialog Object
			dataset_obj : File List를 담을 Dataset Object
 * return : 
			성공 = File Size
			실패 = -1
 * 주의사항 
			FileDialog_obj에는 FilePath, FileName은 미리 있어야 한다.
****************************************************************/
function File_GetFileSize(FileDialog_obj, dataset_obj)
{
	var row;
	
	FileDialog_obj.GetFileList(dataset_obj);
	row = dataset_obj.FindRow("FILE_NAME", FileDialog_obj.FileName);
	if( row >= 0 )
		return dataset_obj.GetColumn(row, "FILE_SIZE");
	else
		return -1;

}