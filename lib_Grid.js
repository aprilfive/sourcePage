function Grid_Sort(Grid_obj,Dataset_obj,cell,cellcnt)
{

	var rowCnt;
	var i;

	rowCnt = Dataset_obj.RowCount();

	if ( rowCnt <= 1 ) return;

	var cell_title = Grid_obj.GetCellProp("head",cell,"text");
	var flag;
	var tmp_str;
	var font_width = 16;

	var chk_str = Grid_obj.GetCellProp("body",cell,"colid");

	Grid_obj.redraw = false;

	if ( chk_str.length() <= 0 )
	{
		for ( i = 0 ; i < cellcnt ; i = i + 1 )
		{
			tmp_str = Grid_obj.GetCellProp("head",i,"text");

			f_pos = pos(tmp_str," ▲");
			if ( f_pos > 0 )
			{
				tmp_str = tmp_str.replace(" ▲","");
			}
			else
			{
				f_pos1 = pos(tmp_str," ▼");
				if ( f_pos1 > 0 )
				{
					tmp_str = tmp_str.replace(" ▼","");
				}
			}


			Grid_obj.SetCellProp("head",i,"text",tmp_str);
			Grid_obj.SetCellProp("head",i,"align","center");
		}
		Grid_obj.redraw = true;
		return;
	}

	var max_len = length(cell_title)*font_width;
	var tmp_len = Grid_obj.GetColProp(cell,"width");
	var f_pos,f_pos1;

	// alert( max_len + "------" + tmp_len );
	if ( pos(cell_title," ▲") > 0 )
	{
		for ( i = 0 ; i < cellcnt ; i = i + 1 )
		{
			tmp_str = Grid_obj.GetCellProp("head",i,"text");

			f_pos = pos(tmp_str," ▲");
			if ( f_pos > 0 )
			{
				tmp_str = tmp_str.replace(" ▲","");
			}
			Grid_obj.SetCellProp("head",i,"text",tmp_str);
			Grid_obj.SetCellProp("head",i,"align","center");
		}

		max_len = max_len - font_width;

		if ( max_len >= tmp_len )
		{
			Grid_obj.SetCellProp("head",cell,"align","left");
		}
		cell_title = Grid_obj.GetCellProp("head",cell,"text");
		flag = "true";
		tmp_str = cell_title + " ▼";
		Grid_obj.SetCellProp("head",cell,"text",tmp_str);
	}
	else if ( pos(cell_title," ▼") > 0 )
	{
		for ( i = 0 ; i < cellcnt ; i = i + 1 )
		{
			tmp_str = Grid_obj.GetCellProp("head",i,"text");

			f_pos = pos(tmp_str," ▼");
			if ( f_pos > 0 )
			{
				tmp_str = tmp_str.replace(" ▼","");
			}

			Grid_obj.SetCellProp("head",i,"text",tmp_str);
			Grid_obj.SetCellProp("head",i,"align","center");
		}

		max_len = max_len - font_width;

		if ( max_len >= tmp_len )
		{
			Grid_obj.SetCellProp("head",cell,"align","left");
		}
		cell_title = Grid_obj.GetCellProp("head",cell,"text");
		flag = "false";
		tmp_str = cell_title + " ▲";
		Grid_obj.SetCellProp("head",cell,"text",tmp_str);
	}
	else
	{
		for ( i = 0 ; i < cellcnt ; i = i + 1 )
		{
			tmp_str = Grid_obj.GetCellProp("head",i,"text");

			f_pos = pos(tmp_str," ▲");
			if ( f_pos > 0 )
			{
				tmp_str = tmp_str.replace(" ▲","");
			}
			else
			{
				f_pos1 = pos(tmp_str," ▼");
				if ( f_pos1 > 0 )
				{
					tmp_str = tmp_str.replace(" ▼","");
				}
			}


			Grid_obj.SetCellProp("head",i,"text",tmp_str);
			Grid_obj.SetCellProp("head",i,"align","center");
		}

		if ( max_len >= tmp_len )
		{
			Grid_obj.SetCellProp("head",cell,"align","left");
		}
		cell_title = Grid_obj.GetCellProp("head",cell,"text");

		flag = "true";
		tmp_str = cell_title + " ▼";
		Grid_obj.SetCellProp("head",cell,"text",tmp_str);
	}

	Dataset_obj.Sort(Grid_obj.GetCellProp("body",cell,"colid"), flag);

	Grid_obj.redraw = true;

}

// Grid_obj = grid object
function Grid_MoveToNextEditCell( Grid_obj )
{
	if( Grid_obj.MoveToNextCell() == 0 )
	{
		Grid_obj.SetCellPos(0);
		if( Grid_obj.GetCellProp("body",0,"edit") == "NONE" )
		{
			Grid_obj.MoveToNextCell();
		}
	}
}



// head_flag의 default = true
// widthfit_flag의 default = true ==> Grid가로에 꽉차게 그리기
// heightfit_flag의 default = true ==> Grid세로에 꽉차게 그리기
function Grid_SetFormat(Grid_obj, Dataset_obj, head_flag, widthfit_flag, heightfit_flag)
{
	var		format;
	var		i;

	if( "x"+head_flag == "x" )
		head_flag = true;
	if( "x"+widthfit_flag == "x" )
		widthfit_flag = true;
	if( "x"+heightfit_flag == "x" )
		heightfit_flag = true;

	Grid_obj.AutoFit = widthfit_flag;
	if( heightfit_flag == true )
	{
		var		body_height;
		var		row_height;
		if( head_flag == true )
			body_height = Grid_obj.Height - Grid_obj.HeadHeight - 5;
		else
			body_height = Grid_obj.Height - 5;
		if( Dataset_obj.RowCount() == 0 )
			row_height = 18;
		else
			row_height = body_height/Dataset_obj.RowCount();
		if( row_height < 18 )
			row_height = 18;
		Grid_obj.RowHeight = row_height;
	}
	else
	{
		Grid_obj.RowHeight = 18;
	}
	format = 	"<contents>\n";
	format += 	"	<columns>\n";
	for( i = 0 ; i < Dataset_obj.ColCount() ; i++ )
	{
		format += 	"		<col width=\"80\"/>\n";
	}
	format += 	"	</columns>\n";
	if( head_flag == true )
	{
		format +=	"	<head>\n";
		for( i = 0 ; i < Dataset_obj.ColCount() ; i++ )
		{
			format +=	"		<cell col=\"" + i + "\"" + " text=\"" + Dataset_obj.GetColID(i) + "\"" + " display=\"text\"/>\n";
		}
		format += 	"	</head>\n";
	}
	format += 	"	<body>\n";
	for( i = 0 ; i < Dataset_obj.ColCount() ; i++ )
	{
		format +=	"		<cell col=\"" + i + "\"" + " colid=\"" + Dataset_obj.GetColID(i) + "\"" + " display=\"text\"/>\n";	
	}
	format +=	"	</body>\n";
	format +=	"</contents>";  
	Grid_obj.contents = format;
	Grid_obj.BindDataset = Dataset_obj.Id;
}
   
   
function fn_call()  
{
  return "1111";
} 
