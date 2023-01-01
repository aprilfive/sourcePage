// 그리드 소트를 위한 소트 마크
// △▲▼▽↑↓∧∨
var CONST_ASC_MARK="A";
var CONST_DESC_MARK="D";

var G_userFunc;

function G_SrvCall(TrID,SrvID,inData,OutData,Result)
{
	G_userFunc = Result;
	Transaction(TrID,SrvID,
	            "RequestHeader_Req=DS_ReqHead "
	            + inData,
	            "DS_ResHead=ResponceHeader_Res "
	            + OutData
	            ,"","G_Result");
}

function G_Result(TrID,errcode,errmsg)
{
		if ( errcode == 0 )
		{
				var ExprCall = G_userFunc + "(\"" + TrID + "\",\"" 
				+ DS_ResHead.GetColumn(0,"RESULT") + "\",\"" 
				+ DS_ResHead.GetColumn(0,"MESSAGE") + "\",\"" 
				+ DS_ResHead.GetColumn(0,"SEQNO") + "\",\"" 
				+ DS_ResHead.GetColumn(0,"PROCESSDATE") + "\")";
				eval(ExprCall);
		}
		else alert(errmsg);
}

function G_GetUsrPath(FileObj)
{
	var path = GetReg("ComponentPath","C:\\");
	var nLen = Length(path);
	if ( nLen <= 0 )
	{
		return "";
	}

	while ( nLen > 0 )
	{
		if ( path.Right(1) == '\\' )
		{
			break;
		}
		else
		{
			nLen--;
			path = path.Substr(0, nLen);
		}
	}

	FileObj.FileName = path + "Usr";
	//if ( !FileObj.IsExistFile() )
	//{
		FileObj.MakeDir(path + "Usr");
	//}

	var FullPath	= path + "Usr\\";
	return FullPath;
}

function fn_Blink_set(arrRow, arrChgCol,GridObj)
{
    var i;
    var j;
    var z;
    var x;
    
	var arrtmp;
	var flag;
	var DatasetObj = Object(GridObj.BindDataset);
	
	//trace("(1) GridObjectID=>[" + GridObj.id + "]");
	
	for (i = 0 ; i < length(arrRow) ; i++ )
	{
		arrtmp = arrChgCol[i].Split(",");

		//trace("(2) RowChangeColumn=>[" + arrRow[i] + "][" +  arrChgCol[i] + "]");
		for (j = 0 ; j < length(arrtmp) ; j++ )
		{
		    //trace("(3) GridCellCount=>[" + GridObj.GetCellCount("Body") + "]");
			for (z = 0 ; z < GridObj.GetCellCount("Body") ; z++ )
			{
		        //trace("(4) GridSubCellCount=>[" + z + "][" + GridObj.GetSubCellCount("Body", z) + "]");
				if ( GridObj.GetSubCellCount("Body", z) > 0)
				{
					flag = false;
					for (x = 0 ; x < GridObj.GetSubCellCount("Body",z) ; x++ )
					{
						if ( GridObj.GetSubCellProp("Body",z,x,"colid") == arrtmp[j] )
						{
            		        //trace("(5) DatasetObj.GetColumn=>[" + arrRow[i] + "][" + arrtmp[j] + "][" + length(DatasetObj.GetColumn(arrRow[i],arrtmp[j])) + "][" + DatasetObj.GetColumn(arrRow[i],arrtmp[j]) + "]");
							//if ( length(DatasetObj.GetColumn(arrRow[i],arrtmp[j])) > 0 )
							if ( DatasetObj.GetColumn(arrRow[i],arrtmp[j]) != null )
							{
								//trace("Blank[" + arrRow[i] + "][" + z + "]");
								GridObj.SetBlinkColor(arrRow[i],z,"yellow","black",300);
								flag = true;
								break;
							}
						}	
					}
					if ( flag ) break;
				}
				else
				{
					if ( GridObj.GetCellProp("Body",z,"colid") == arrtmp[j] )
					{
           		        //trace("(5) DatasetObj.GetColumn=>[" + arrRow[i] + "][" + arrtmp[j] + "][" + length(DatasetObj.GetColumn(arrRow[i],arrtmp[j])) + "][" + DatasetObj.GetColumn(arrRow[i],arrtmp[j]) + "]");
						//if ( length(DatasetObj.GetColumn(arrRow[i],arrtmp[j])) > 0 )
						if ( DatasetObj.GetColumn(arrRow[i],arrtmp[j]) != null )
						{
							//trace("Blank[" + arrRow[i] + "][" + z + "]");
							GridObj.SetBlinkColor(arrRow[i],z,"yellow","black",300);
						}
                        break;
					}	
				}	
			}	
		}
	}	
}	

function G_Sort(Grid_obj,Dataset_obj,cell)
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
	var cellcnt = Grid_obj.GetCellCount("body");
	Grid_obj.redraw = false;

	if ( chk_str.length() <= 0 )
	{
		for ( i = 0 ; i < cellcnt ; i = i + 1 )
		{
			tmp_str = Grid_obj.GetCellProp("head",i,"text");

			f_pos = pos(tmp_str,CONST_ASC_MARK);
			if ( f_pos > 0 )
			{
				tmp_str = tmp_str.replace(CONST_ASC_MARK,"");
			}
			else
			{
				f_pos1 = pos(tmp_str,CONST_DESC_MARK);
				if ( f_pos1 > 0 )
				{
					tmp_str = tmp_str.replace(CONST_DESC_MARK,"");
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
	if ( pos(cell_title,CONST_ASC_MARK) > 0 )
	{
		for ( i = 0 ; i < cellcnt ; i = i + 1 )
		{
			tmp_str = Grid_obj.GetCellProp("head",i,"text");

			f_pos = pos(tmp_str,CONST_ASC_MARK);
			if ( f_pos > 0 )
			{
				tmp_str = tmp_str.replace(CONST_ASC_MARK,"");
			}
			Grid_obj.SetCellProp("head",i,"text",tmp_str);
			Grid_obj.SetCellProp("head",i,"align","center");
		}

		max_len = max_len - font_width;

		if ( max_len >= tmp_len )
		{
			//Grid_obj.SetCellProp("head",cell,"align","left");
		}
		cell_title = Grid_obj.GetCellProp("head",cell,"text");
		flag = "false";
		tmp_str = cell_title + CONST_DESC_MARK;
		Grid_obj.SetCellProp("head",cell,"text",tmp_str);
	}
	else if ( pos(cell_title,CONST_DESC_MARK) > 0 )
	{
		for ( i = 0 ; i < cellcnt ; i = i + 1 )
		{
			tmp_str = Grid_obj.GetCellProp("head",i,"text");

			f_pos = pos(tmp_str,CONST_DESC_MARK);
			if ( f_pos > 0 )
			{
				tmp_str = tmp_str.replace(CONST_DESC_MARK,"");
			}

			Grid_obj.SetCellProp("head",i,"text",tmp_str);
			Grid_obj.SetCellProp("head",i,"align","center");
		}

		max_len = max_len - font_width;

		if ( max_len >= tmp_len )
		{
			//Grid_obj.SetCellProp("head",cell,"align","left");
		}
		cell_title = Grid_obj.GetCellProp("head",cell,"text");
		flag = "true";
		tmp_str = cell_title + CONST_ASC_MARK;
		Grid_obj.SetCellProp("head",cell,"text",tmp_str);
	}
	else
	{
		for ( i = 0 ; i < cellcnt ; i = i + 1 )
		{
			tmp_str = Grid_obj.GetCellProp("head",i,"text");

			f_pos = pos(tmp_str,CONST_ASC_MARK);
			if ( f_pos > 0 )
			{
				tmp_str = tmp_str.replace(CONST_ASC_MARK,"");
			}
			else
			{
				f_pos1 = pos(tmp_str,CONST_DESC_MARK);
				if ( f_pos1 > 0 )
				{
					tmp_str = tmp_str.replace(CONST_DESC_MARK,"");
				}
			}


			Grid_obj.SetCellProp("head",i,"text",tmp_str);
			Grid_obj.SetCellProp("head",i,"align","center");
		}

		if ( max_len >= tmp_len )
		{
			//Grid_obj.SetCellProp("head",cell,"align","left");
		}
		cell_title = Grid_obj.GetCellProp("head",cell,"text");

		flag = "true";
		tmp_str = cell_title + CONST_ASC_MARK;
		Grid_obj.SetCellProp("head",cell,"text",tmp_str);
	}
	Dataset_obj.Sort(chk_str, flag);

	Grid_obj.redraw = true;
	if ( flag == "true" ) chk_str += ":A";
	else chk_str += ":D";
	return chk_str;
}

function G_SortEx(Grid_obj,Dataset_obj,cell,strExpr)
{
	var rowCnt;
	var i;
	var tmpExpr="";
	
	rowCnt = Dataset_obj.RowCount();

	if ( rowCnt <= 1 ) return;

	var cell_title = Grid_obj.GetCellProp("head",cell,"text");
	var flag;
	var tmp_str;
	var font_width = 16;

	var chk_str = Grid_obj.GetCellProp("body",cell,"colid");
	var cellcnt = Grid_obj.GetCellCount("body");

	if ( chk_str.length() <= 0 ) 	return;

	var arraySort = split(strExpr,",");
	var j ;
	var colidx = -1;

	for ( j = 0 ; j < arraySort.Length(); j++)
	{
		if (pos(arraySort[j],chk_str + ":") >= 0 )
		{
			colidx = j;
			break;
		}
	}
	
	Grid_obj.redraw = false;
	var max_len = length(cell_title)*font_width;
	var tmp_len = Grid_obj.GetColProp(cell,"width");
	var f_pos,f_pos1;

	// alert( max_len + "------" + tmp_len );
	if ( pos(cell_title,CONST_ASC_MARK) > 0 )
	{
		max_len = max_len - font_width;

		if ( max_len >= tmp_len )
		{
			//Grid_obj.SetCellProp("head",cell,"align","left");
		}
		tmp_str = cell_title.Replace(CONST_ASC_MARK,CONST_DESC_MARK);
		
		flag = ":D";
		Grid_obj.SetCellProp("head",cell,"text",tmp_str);
	}
	else if ( pos(cell_title,CONST_DESC_MARK) > 0 )
	{
		max_len = max_len - font_width;

		if ( max_len >= tmp_len )
		{
			//Grid_obj.SetCellProp("head",cell,"align","left");
		}
		tmp_str = cell_title.Replace(CONST_DESC_MARK,CONST_ASC_MARK);
		flag = ":A";
		Grid_obj.SetCellProp("head",cell,"text",tmp_str);
	}
	else
	{
		if ( max_len >= tmp_len )
		{
			//Grid_obj.SetCellProp("head",cell,"align","left");
		}
		cell_title = Grid_obj.GetCellProp("head",cell,"text");

		flag = ":A";
		tmp_str = cell_title + CONST_ASC_MARK;
		Grid_obj.SetCellProp("head",cell,"text",tmp_str);
	}

	if ( colidx > -1 )
	{
		arraySort[colidx] = chk_str + flag;
	} 

	for ( j = 0 ; j < arraySort.Length(); j++)
	{
		if ( j == arraySort.Length()-1 )
			tmpExpr += arraySort[j];
		else	
			tmpExpr += arraySort[j] + ",";
	}

	if ( colidx == -1 )
		tmpExpr += "," + chk_str + flag;

	Dataset_obj.Sort(tmpExpr);

	Grid_obj.redraw = true;

	return tmpExpr;
}

function G_titleClear(Grid_obj)
{
	Grid_obj.redraw = false;

	for ( i = 0 ; i < Grid_obj.GetCellCount("Head") ; i++ )
	{
		tmp_str = Grid_obj.GetCellProp("head",i,"text");

		f_pos = pos(tmp_str,CONST_ASC_MARK);
		if ( f_pos > 0 )
		{
			tmp_str = tmp_str.replace(CONST_ASC_MARK,"");
		}
		else
		{
			f_pos1 = pos(tmp_str,CONST_DESC_MARK);
			if ( f_pos1 > 0 )
			{
				tmp_str = tmp_str.replace(CONST_DESC_MARK,"");
			}
		}


		Grid_obj.SetCellProp("head",i,"text",tmp_str);
	}
	Grid_obj.redraw = true;
}

function Combo2_OnChar(obj,strPreText,nChar,strPostText,LLParam,HLParam)
{
	if ( strPostText.Length() == 2 )
	{
		var fRow = Object(obj.innerDataset).FindRow("cd",strPostText);
		if ( fRow > -1 )
		{
			obj.index = parseInt(strPostText);
			obj.Text = strPostText;
			Object(obj.innerDataset).Row = fRow;
		}
	}
}

var GRow;
var ListFg = 0;

function Combo2_OnKeyDown(obj,nChar,bShift,bCtrl,bAlt,LLParam,HLParam)
{
		if ( nChar == 38 ) //Up Key
		{
			ListFg = 0;
			
			if ( Object(obj.innerDataset).Row == 0 )
				GRow = Object(obj.innerDataset).Row;
			else 
				GRow = Object(obj.innerDataset).Row - 1;
		}
		else if ( nChar == 40 ) //Down Key
		{
			ListFg = 0;
		
			if ( Object(obj.innerDataset).Row == ( Object(obj.innerDataset).RowCount - 1) )
				GRow = Object(obj.innerDataset).Row;
			else 
				GRow = Object(obj.innerDataset).Row + 1;
		}
}

function DateSetting(Val)
{
	return left(Val,4) + substr(Val,5,2) + right(Val,2); 
}

function ComboSetting(obj,Val)
{
		obj.Text = Val;
		Object(obj.innerDataset).Row = parseInt(Val) - 1;

}

function Combo2_OnCloseUp(obj,strCode,strText)
{
	ListFg = 1;
}

function Combo2_OnChanged(obj,strCode,strText,nOldIndex,nNewIndex)
{
	if ( strCode.Length() == 2 )
	{
		if ( ListFg == 0 ) {
			strCode = Object(obj.innerDataset).GetColumn(GRow,"cd");		
			Object(obj.innerDataset).Row = ParseInt(GRow);
			obj.index = parseInt(strCode) - 1;
			obj.Text = strCode;
		}
		else
		{
			obj.index = parseInt(strCode);
			obj.Text = strCode;
			Object(obj.innerDataset).Row = parseInt(strCode) - 1;
		}
	}
}

function Drag_start(GridObj)
{
	var DataObj = CreateDataObject();
	DataObj.SetData("CF_TEXT",Object(GridObj.BindDataset).Row);
	
	if ( GridObj.IsAboveSel() ) return DataObj;
}	

function Drop_end(GridObj,tmpDatasetObj,objData,nRow)
{
	var DatasetObj = object(Gridobj.BindDataset);
	var selRow = parseInt(objData.GetData("CF_TEXT"));

	if(nRow == selRow)
	{
		return;
	}
	
	var i;
	var tagRow;

	tmpDatasetObj.CopyRow(0, Gridobj.BindDataset, selRow);
  	var max_count = DatasetObj.GetCount();
	DatasetObj.FireEvent = false;

	if(selRow > nRow)  // UP Move
	{
		tagRow = nRow; 
		for(i = selRow; i > tagRow; i--)
		{
			DatasetObj.CopyRow(i, Gridobj.BindDataset, i-1);
		}
	}
	else { // DOWN Move
		if(nRow >= max_count) tagRow = max_count - 1;
		else                  tagRow = nRow;
		for(i = selRow; i < tagRow; i++)
		{
			DatasetObj.CopyRow(i, Gridobj.BindDataset, i+1);
		}
	}
	
	DatasetObj.CopyRow(tagRow, tmpDatasetObj.id, 0);
	DatasetObj.Row = tagRow;
	
	DatasetObj.FireEvent = true;	 
}	