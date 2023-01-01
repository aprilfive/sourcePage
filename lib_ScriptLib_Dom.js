#include "Lib::lib_ScriptLib_Dataset.js"
// XML --> dsDom
function Dom_ParseXml(dsDom, buff)
{
	var		i, j;
	// flag
	// 시작 : '<' = 0, '<? = 1, '</' = 2, '<tag ' = 3
	// 끝   : '>' = 10('<'로 시작한경우), '>' = 11('</'로 시작한경우), '?> =12, '/> = 13
	var		flag=-1, old_flag;	
	var		row;
	// style : 0 = <tag>, 1 = </tag>, 2 = <tag    />, 3 = <?    ?>, 4 = <tag></tag>
	var		tag, value, prop, style;	
	var		old_tag;
	
	dsDom.DeleteAll();
	for( i = 0 ; i < buff.Length() ; i++ )
	{
		old_flag = flag;
		if( buff[i] == '<' && buff[i+1] == '?' )
			flag = 1;
		else if( buff[i] == '<' && buff[i+1] == '/' )
			flag = 2;
		else if( (flag == 0 || flag == 1) && (buff[i] == ' ' || buff[i] == Chr(9)) )
			flag = 3;
		else if( buff[i] == '?' && buff[i+1] == '>' )
			flag = 12;
		else if( buff[i] == '/' && buff[i+1] == '>' )
			flag = 13;
		else if( buff[i] == '<' && buff[i+1] == '!' &&
			 buff[i+2] == '-' && buff[i+3] == '-' )
		{
			for( i = i+4 ; i < buff.Length() ; i++ )
			{
				if( buff[i] == '-' && buff[i+1] == '-' && buff[i+2] == '>' )
					break;
				
			}
			i += 2;
			continue;
		}
		else if( buff[i] == '<' )
			flag = 0;
		else if( buff[i] == '>' )
		{
			if( flag == 0 )
				flag = 10;
			else if( flag == 2 )
				flag = 11;
			else if( flag == 3 )
				flag = 10;
		}
		else
		{
			if( flag == 0 || flag == 1 || flag == 2 )
			{
				tag += buff[i];
				if( flag == 0 || flag == 1 )
					style = 0;
				else if( flag == 2 )
				{
					if( old_tag == tag )
						style = 4;
					else
						style = 1;
				}
			}
			else if( flag == 3 )
				prop += buff[i];
			else if( flag == 10 )
				value += buff[i];
			else if( flag == 12 )
				style = 3;				
			else if( flag == 13 )
				style = 2;
		}
		if( old_flag != flag )
		{
			if( flag == 0 || flag == 1 || flag == 2 )
			{
				if( flag == 0 )
				{
					if( old_flag == 10 || old_flag == 11 )
						value = "";
				}
				if( "x"+tag != "x" )			
				{
					if( style != 4 )
					{
						row = dsDom.AddRow();
						dsDom.SetColumn(row, "Tag", tag);
						dsDom.SetColumn(row, "Prop", prop);
						dsDom.SetColumn(row, "Value", value);
						dsDom.SetColumn(row, "Style", style);
					}
					else
					{
						dsDom.SetColumn(row, "Style", style);
					}
				}
				old_tag = tag;
				tag = "";
				prop = "";
				value = "";
				style = 0;
			}
			if( flag == 1 || flag == 2 || flag == 12 || flag == 13 )
				i++;
		}
	}
	if( "x"+tag != "x" )			
	{
		row = dsDom.AddRow();
		dsDom.SetColumn(row, "Tag", tag);
		dsDom.SetColumn(row, "Prop", prop);
		dsDom.SetColumn(row, "Value", value);
		dsDom.SetColumn(row, "Style", style);
	}
}

function Dom_MakeXml(dsDom)
{
	var		i, j;
	var		buff="";
	var		row_num;
	var		tag, prop, value, style, prop_tmp;
	var		depth = -1;
	var		start_tag, end_tag;
	var		tab_str;
	
	row_num = dsDom.RowCount();
	for(i = 0 ; i < row_num ; i++ )
	{
		tag = dsDom.GetColumn(i, "Tag");
		prop_tmp = dsDom.GetColumn(i, "Prop");
		if( "x"+prop_tmp == "x" )
			prop = prop_tmp;
		else
			prop = " " + prop_tmp;
		value = dsDom.GetColumn(i, "Value");
		style = dsDom.GetColumn(i, "Style");				
		if( i == 0 )
			tab_str = "";
		else
			tab_str = "\n";
		if( style == 0 )
		{
			depth++;
			start_tag = "<";
			end_tag = ">";
		}
		else if( style == 1 )
		{
			start_tag = "</";
			end_tag = ">";
		}
		else if( style == 2 )
		{
			depth++;
			start_tag = "<";
			end_tag = "/>";
		}
		else if( style == 3 )
		{
			start_tag = "<?";
			end_tag = "?>";
		}
		else if( style == 4 )
		{
			depth++;
			start_tag = "<";
			end_tag = ">";
		}
		for( j = 0 ; j < depth ; j++ )
		{
			tab_str += Chr(9);		
		}
		buff += tab_str + start_tag + tag + prop + end_tag + value;	
		if( style == 1 )
			depth--;
		else if( style == 2 )
			depth--;
		else if( style == 4 )
		{
			depth--;
			buff += "</" + tag + ">";	
		}
	}
	return buff;
}

//return
// arr[0] = start_row
// arr[1] = end_row
function Dom_FindRow(dsDom, tag)
{
	var		ret_arr=array(2);
	var		arr=array(16);
	var		i, j;
	var		start_row, end_row;
	var		pos, pos1;
	var		tag_str, tag_no_str, tag_no;
	var		style;
	
	ret_arr[0] = -1;
	ret_arr[1] = -1;
	arr = Split(tag, '.');
	start_row = -1;
	for( i = 0 ; i < arr.Length() ; i++ )
	{
		if( "x"+arr[i] == "x" )
			break;
		tag_str = arr[i];
		pos = Str_Find(arr[i], '[', 0);
		pos1 = Str_Find(arr[i], ']', 0);
		if( pos >= 0 && pos1 >= 0 )
		{
			tag_str = Substr(arr[i], 0, pos);
			tag_no_str = Substr(arr[i], pos+1, pos1-pos-1);
			tag_no = ToInteger(tag_no_str);
			tag_no++;
		}
		else
		{
			tag_str = arr[i];
			tag_no_str = "";
			tag_no = 1;
		}
		for( j = 0 ; j < tag_no ; j++ )
		{
			start_row++;
			start_row = Dataset_FindRow(dsDom, "Tag", tag_str, start_row);
			if( start_row < 0 )
				break;
			style = dsDom.GetColumn(start_row, "Style");
			if( style == "1" )
				j--;
		}
	}
	if( start_row < 0 )
		return ret_arr;
	if( style != "0" )
		end_row = start_row;
	else
		end_row = Dataset_FindRow(dsDom, "Tag", tag_str, 	start_row+1 );
	ret_arr[0] = start_row;
	ret_arr[1] = end_row;	
	return ret_arr;
}

function Dom_AddXml( dsDom, tag, prop, value, style )
{
	var		row;
	row = dsDom.AddRow();
	dsDom.SetColumn(row, "Tag", tag);
	dsDom.SetColumn(row, "Prop", prop);
	dsDom.SetColumn(row, "Value", value);
	dsDom.SetColumn(row, "Style", style);	
}

function Dom_GetXml( dsDom, tag, col_id )
{
	var		row;
	var		arr=array(2);
	
	arr = Dom_FindRow( dsDom, tag);
	row = arr[0];
	if( row < 0 )
		return "";
	else
		return dsDom.GetColumn(row, col_id);
}

function Dom_CountXml(dsDom, tag)
{
	var		arr=array(2);
	arr = Dom_FindRow( dsDom, tag );
	return arr[1] - arr[0];
}

function Dom_MakeDataset(dsDom, Dataset_target, tag, row_gbn_tag, col_exist)
{
	var		arr=array(2);
	var		i;
	var		dom_tag, dom_style, dom_value;
	var		row_no;
	var		row_tag;
	var		flag = 0;
	
	arr = Dom_FindRow(dsDom, tag);
	start_row = arr[0]+1;
	end_row = arr[1]-1;
	
	// column make
	if( col_exist == false )
	{
		Dataset_target.Clear();
		if( "x"+row_gbn_tag == "x" )
			flag = 0;
		else
			flag = -1;
		for( i = start_row ; i <= end_row ; i++ )
		{
			dom_tag = dsDom.GetColumn(i, "Tag");
			if( dom_tag == row_gbn_tag )
			{
				dom_style = dsDom.GetColumn(i, "Style");
				if( dom_style == "0" )
					flag = 0;
				else
					break;					
			}
			else
			{
				if( flag == 0 )
					Dataset_target.AddColumn(dom_tag, "STRING", 255);
			}
		}
		;
	}
	else
	{
		Dataset_target.DeleteAll();
	}
	
	// data make		
	row_no = -1;
	if( "x"+row_gbn_tag == "x" )
	{
		flag = 0;
		Dataset_target.AddRow();
		row_no=0;
	}
	else
		flag = -1;
	for( i = start_row ; i <= end_row ; i++ )
	{
		dom_tag = dsDom.GetColumn(i, "Tag");
		if( dom_tag == row_gbn_tag )
		{
			dom_style = dsDom.GetColumn(i, "Style");
			if( dom_style == "0" )
			{
				Dataset_target.AddRow();
				row_no++;
				flag = 0;
			}
			else
				flag = -1;
		}
		else
		{
			if( flag == 0 )
			{	
				dom_value = dsDom.GetColumn(i, "Value");
				Dataset_target.SetColumn(row_no, dom_tag, dom_value);
			}
		}
	}
}