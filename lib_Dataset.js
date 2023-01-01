#include "Lib::lib_String.js"

/***************************************************************
 * ���� : dataset�� Delimeter�� ����Ͽ� String���� ����� �Լ�
 * arg :
			dataset_obj : Dataset Object
			header  : true = header�� ���Խ�ų ���, 
			          false = header�� ���Խ�Ű�� ����
			col_del : Column Delimeter
			rec_del : Record Delimeter
 * return : 
			������� String
****************************************************************/
function Dataset_SaveWithDelimeter( Dataset_obj, header, col_del, rec_del )
{
	var	i, j;
	var buff = "";
	var	tmp;

	// column�� ���� record�� setting�� ���
	if( header == true )		
	{
		for( i = 0 ; i < Dataset_obj.ColCount() ; i++ )
		{
			if( i == 0 )
				buff = buff + '"' + Dataset_obj.GetColId(i) + '"';
			else
				buff = buff + col_del + '"' + Dataset_obj.GetColId(i) + '"';
		}				
		buff = buff  + rec_del;		
	}
	for (i = 0; i < Dataset_obj.RowCount(); i++)
	{
		for (j = 0; j < Dataset_obj.ColCount(); j++)
		{
			tmp = Dataset_obj.GetColumn(i,Dataset_obj.GetColId(j));
			if ( j == 0 )
			{
				tmp = tmp.Replace("\"", "\"\"");
				buff =  buff + '"' + tmp + '"';
			}
			else
			{
				tmp = tmp.Replace("\"", "\"\"");
				buff =  buff + col_del + '"' + tmp + '"';
			}
		}
		buff = buff  + rec_del;
	}	
	return buff;	
}

/***************************************************************
 * ���� : Delimeter�� ����Ͽ� ������� String�� Dataset���� Loading�ϴ� �Լ�
 * arg :
			dataset_obj : Dataset Object
			buff : Loading�� String
			header  : true = ���� Dataset�� Column������ buff�������� ��ü, 
			          false = ���� Dataset�� Column������ �������
			col_del : Column Delimeter
			rec_del : Record Delimeter
 * return : 
			����
****************************************************************/
function Dataset_LoadWithDelimeter( Dataset_obj, buff, header, col_del, rec_del )
{
	var		rec_str, col_str;
	var		i, j, row_no, col_no;
	var		row;
	var		len;
	var		count;
	var		arr_rec=array(2);
	var		arr_col=array(2);

	if( header == true )
		Dataset_obj.Clear();
	i = 0;
	row_no = 0;
	while(1)
	{
		arr_rec = Str_Token(buff, rec_del, i, '"');
		rec_str = arr_rec[0];
		if( "x"+rec_str == "x" )
			break;
		i = arr_rec[1];
		j = 0;
		col_no = 0;
		while(1)
		{
			arr_col = Str_Token(rec_str, col_del, j, '"');
			col_str = arr_col[0];
			if( j >= rec_str.Length() )
				break;
			j = arr_col[1];	
			if( col_str[0] == '"' )
			{
				col_str = Substr(col_str, 1, col_str.Length() - 2 );
				col_str = Replace(col_str, "\"\"", "\"");
			}

			if( header == true && row_no == 0 )
			{
				Dataset_obj.AddColumn(col_str, "STRING", 255);
			}
			else
			{
				if( col_no == 0 )
					row = Dataset_obj.AddRow();
				Dataset_obj.SetColumn(row, Dataset_obj.GetColId(col_no), col_str); 
			}
			col_no++;
		}
		row_no++;
	}
	Dataset_obj.Row = 0;
	return 0;
}

/***************************************************************
 * ���� : Dataset�� ?.xls string���� ����� �Լ�
 * arg :
			dataset_obj : Dataset Object
			header  : true = header�� ���Խ�ų ���, 
			          false = header�� ���Խ�Ű�� ����
 * return : 
			������� String
****************************************************************/
function Dataset_SaveXls( Dataset_obj, header )
{
	var		col_del = chr(9);
	var		rec_del = chr(13) + chr(10);
	return Dataset_SaveWithDelimeter( Dataset_obj, header, col_del, rec_del );
}

/***************************************************************
 * ���� : ?.xls ������ string�� Dataset���� Loading�ϴ� �Լ�
 * arg :
			dataset_obj : Dataset Object
			buff : ?.xls������ string
			header  : true = ���� Dataset�� Column������ buff�������� ��ü, 
			          false = ���� Dataset�� Column������ �������
 * return : 
			����
****************************************************************/
function Dataset_LoadXls( Dataset_obj, buff, header )
{
	var		col_del = chr(9);
	var		rec_del = chr(13) + chr(10);

	return Dataset_LoadWithDelimeter( Dataset_obj, buff, header, col_del, rec_del );
}

/***************************************************************
 * ���� : Dataset�� ?.csv string���� ����� �Լ�
 * arg :
			dataset_obj : Dataset Object
			header  : true = header�� ���Խ�ų ���, 
			          false = header�� ���Խ�Ű�� ����
 * return : 
			������� String
****************************************************************/
function Dataset_SaveCsv( Dataset_obj, header )
{
	var		col_del = ",";
	var		rec_del = chr(13) + chr(10);
	
	return Dataset_SaveWithDelimeter( Dataset_obj, header, col_del, rec_del );
}

/***************************************************************
 * ���� : ?.csv ������ string�� Dataset���� Loading�ϴ� �Լ�
 * arg :
			dataset_obj : Dataset Object
			buff : ?.xls������ string
			header  : true = ���� Dataset�� Column������ buff�������� ��ü, 
			          false = ���� Dataset�� Column������ �������
 * return : 
			����
****************************************************************/
function Dataset_LoadCsv( Dataset_obj, buff, header )
{
	var		col_del = ",";
	var		rec_del = chr(13) + chr(10);

	return Dataset_LoadWithDelimeter( Dataset_obj, buff, header, col_del, rec_del );
}

/***************************************************************
 * ���� : dataset���� data�� �Է�,����,���� �ߴ��� ���� üũ
 * arg :
			dataset_obj : Dataset Object
 * return : 
			���� = -1
			���� = ���Ѱ��� ������ true, ������ false
****************************************************************/
function Dataset_IsChanged(dataset_obj)
{
	var		i;

	// insert, update case
	for( i = 0 ; i < dataset_obj.RowCount() ; i++ )
	{
		if( dataset_obj.GetRowType(i) != "normal" )
		{
			return true;
		}
	}

	// delete case	
	for( i = 0 ; i < dataset_obj.GetOrgBuffCount() ; i++ )
	{
		if( dataset_obj.GetOrgBuffType(i) != "normal" )
		{
			return true;
		}
	}	
	return false;
}

/***************************************************************
 * ���� : dataset���� data�� �Է�,����,����,normal case���� row count�� ����
 * arg :
			dataset_obj : Dataset Object
			str_row_type : "insert" or "update" or "delete" or "normal"
 * return : 
			���� = -1
			���� = �ش� Case�� row count
****************************************************************/
function Dataset_GetRowTypeCount(dataset_obj, str_row_type)
{
	var		i;
	var		count;

	if( str_row_type != "normal" &&
		str_row_type != "update" &&
		str_row_type != "delete" &&
		str_row_type != "insert" )
		return -1;

	count = 0;		
	for( i = 0 ; i < dataset_obj.RowCount() ; i++ )
	{
		if( dataset_obj.GetRowType(i) == str_row_type )
		{
			count++;
		}
	}

	if( str_row_type == "delete" )
	{
		for( i = 0 ; i < dataset_obj.GetOrgBuffCount() ; i++ )
		{
			if( dataset_obj.GetOrgBuffType(i) == str_row_type )
			{
				count++;
			}
		}	
	}	
	return count;
}

/***************************************************************
 * ���� : dataset�� str�� �ش��ϴ� ���� ���õǾ����� ���θ� Check�ϴ� �Լ�
 * arg :
			dataset_obj : Dataset Object
			multi_select : true = multi select�� ���, false = multi select�� �ƴҰ��
			col_id : Column ID
			str : ã���� �ϴ� ��
 * return : 
			���õǾ��ٸ� true, ���� �ȵǾ��ٸ� false
****************************************************************/
function Dataset_ChkSelect(Dataset_obj, multi_select, col_id, str)
{
	var		row;

	if( multi_select == true )
	{
		row = Dataset_obj.FindRow(col_id, str);
		if( row >= 0 )
		{
			if( Dataset_obj.GetSelect(row) == true )
				return true;
		}
		return false;
	}
	else
	{
		if( Dataset_obj.GetColumn(Dataset_obj.Row, col_id) == str )
			return true;
		else	
			return false;
	}
}

function Csv2Ds(csv_buff, ds_obj)
{
	var 	row, col;
	var		arr_rec=array(-1);
	var		arr_col=array(-1);

	ds_obj.ClearData();
	arr_rec = Split(csv_buff, "\r\n");
	for( row = 0 ; row < arr_rec.Length() ; row++ )
	{
		arr_col = Split(arr_rec[row], ",");
		ds_obj.AddRow();
		for( col = 0 ; col < arr_col.Length() ; col++ )
		{
			ds_obj.SetColumn(row, col, arr_col[col]);
		}
	}
	ds_obj.Row = 0;
}