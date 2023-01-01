#include "Lib::lib_String.js"
/***************************************************************
 * ���� : File���� ���پ� �д� �Լ�
 * arg :
			File_obj : File Object
 * return : 
			���� ���� String
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
 * ���� : ini file���� �� �������� �Լ�
 * arg :
			buff : File���� ����
			section : [section]���·� �� String
			key : key=key_str ���·� �� key�� �ش��ϴ� String
			default_value : section, key�� ������ Return�� Default��
 * return : 
			���� : section, key�� �ش��ϴ� String
			���� : default value
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
 * ���� : File�� Size�� �˾Ƴ��� �Լ�
 * arg :
			FileDialog_obj : FileDialog Object
			dataset_obj : File List�� ���� Dataset Object
 * return : 
			���� = File Size
			���� = -1
 * ���ǻ��� 
			FileDialog_obj���� FilePath, FileName�� �̸� �־�� �Ѵ�.
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