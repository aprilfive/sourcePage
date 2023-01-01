#include "Lib::lib_String.js"

/***************************************************************
 * 설명 : dataset을 Delimeter를 사용하여 String으로 만드는 함수
 * arg :
			dataset_obj : Dataset Object
			header  : true = header를 포함시킬 경우, 
			          false = header를 포함시키지 않음
			col_del : Column Delimeter
			rec_del : Record Delimeter
 * return : 
			만들어진 String
****************************************************************/
function Dataset_SaveWithDelimeter( Dataset_obj, header, col_del, rec_del )
{
	var	i, j;
	var buff = "";
	var	tmp;

	// column을 최초 record에 setting할 경우
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
 * 설명 : Delimeter를 사용하여 만들어진 String을 Dataset으로 Loading하는 함수
 * arg :
			dataset_obj : Dataset Object
			buff : Loading할 String
			header  : true = 기존 Dataset의 Column정보를 buff내용으로 교체, 
			          false = 기존 Dataset의 Column정보는 변경안함
			col_del : Column Delimeter
			rec_del : Record Delimeter
 * return : 
			없음
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
 * 설명 : Dataset을 ?.xls string으로 만드는 함수
 * arg :
			dataset_obj : Dataset Object
			header  : true = header를 포함시킬 경우, 
			          false = header를 포함시키지 않음
 * return : 
			만들어진 String
****************************************************************/
function Dataset_SaveXls( Dataset_obj, header )
{
	var		col_del = chr(9);
	var		rec_del = chr(13) + chr(10);
	return Dataset_SaveWithDelimeter( Dataset_obj, header, col_del, rec_del );
}

/***************************************************************
 * 설명 : ?.xls 형태의 string을 Dataset으로 Loading하는 함수
 * arg :
			dataset_obj : Dataset Object
			buff : ?.xls형태의 string
			header  : true = 기존 Dataset의 Column정보를 buff내용으로 교체, 
			          false = 기존 Dataset의 Column정보는 변경안함
 * return : 
			없음
****************************************************************/
function Dataset_LoadXls( Dataset_obj, buff, header )
{
	var		col_del = chr(9);
	var		rec_del = chr(13) + chr(10);

	return Dataset_LoadWithDelimeter( Dataset_obj, buff, header, col_del, rec_del );
}

/***************************************************************
 * 설명 : Dataset을 ?.csv string으로 만드는 함수
 * arg :
			dataset_obj : Dataset Object
			header  : true = header를 포함시킬 경우, 
			          false = header를 포함시키지 않음
 * return : 
			만들어진 String
****************************************************************/
function Dataset_SaveCsv( Dataset_obj, header )
{
	var		col_del = ",";
	var		rec_del = chr(13) + chr(10);
	
	return Dataset_SaveWithDelimeter( Dataset_obj, header, col_del, rec_del );
}

/***************************************************************
 * 설명 : ?.csv 형태의 string을 Dataset으로 Loading하는 함수
 * arg :
			dataset_obj : Dataset Object
			buff : ?.xls형태의 string
			header  : true = 기존 Dataset의 Column정보를 buff내용으로 교체, 
			          false = 기존 Dataset의 Column정보는 변경안함
 * return : 
			없음
****************************************************************/
function Dataset_LoadCsv( Dataset_obj, buff, header )
{
	var		col_del = ",";
	var		rec_del = chr(13) + chr(10);

	return Dataset_LoadWithDelimeter( Dataset_obj, buff, header, col_del, rec_del );
}

/***************************************************************
 * 설명 : dataset에서 data를 입력,수정,삭제 했는지 여부 체크
 * arg :
			dataset_obj : Dataset Object
 * return : 
			실패 = -1
			성공 = 변한것이 있으면 true, 없으면 false
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
 * 설명 : dataset에서 data의 입력,수정,삭제,normal case별로 row count를 구함
 * arg :
			dataset_obj : Dataset Object
			str_row_type : "insert" or "update" or "delete" or "normal"
 * return : 
			실패 = -1
			성공 = 해당 Case의 row count
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
 * 설명 : dataset이 str에 해당하는 값이 선택되었는지 여부를 Check하는 함수
 * arg :
			dataset_obj : Dataset Object
			multi_select : true = multi select의 경우, false = multi select가 아닐경우
			col_id : Column ID
			str : 찾고자 하는 값
 * return : 
			선택되었다면 true, 선택 안되었다면 false
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