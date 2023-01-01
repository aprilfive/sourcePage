

var CONST_ASC_MARK="";
var CONST_DESC_MARK="";

///////////////////////////////////////////////////////////////////////////////

var Gv_objMGrdDs;															// Multi Select DataSet
var Gv_objBindDs;															// Grid BindDataset 
var Gv_grdRow;																// Grid Selected Row
var Gv_grdColId;															// Grid Selected Column
var Gv_GrdChk, Gv_GrdCode, Gv_GrdText;		// DataSet Column(Display)

var Gv_mCnt;
var Gv_gCnt;
var Gv_CodeCol;																// Multi Selected Item(Code)
var Gv_FixCol;																// Multi Selected Fixed Column
var Gv_FixExist = false;											// Fix Column Value Exist check


var Gv_CreateChkDS = false;

// ORG Sort Column 
var Gv_sortCol;

// Calendar  
var Gv_CalendarPopDivURL = "Template::Temp2_CalendarPopup.xml";
var Gv_CalendarPopDiv3URL = "Template::Temp2_CalendarPopup3.xml";
var Gv_CalendarPopDivImageID = "btn_Grid_Calendar";
var Gv_CalendarPopDiv3ImageID = "btn_Grid_Popup";
var Gv_CalendarPopDivX;
var Gv_CalendarPopDivY;
var Gv_CalendarPopDivW;
var Gv_CalendarPopDivH;
var Gv_openChkCal = false;										// Create Object Check (PopupDaiv Calendar)
var Gv_openChkCal3 = false;										// Create Object Check (PopupDaiv Calendar)
var Gv_rtnDate = "";													// Selected Date Return Value
var Gv_rtnDFlag;															// Check Flag (return falg)
var Gv_CalendarPopnRow;

///////////////////////////////////////////////////////////////////////////////

function Gf_CreatePopDivCalendar()
{
		Create("PopupDiv", "PopDiv_Calendar", 'Border="Flat" BorderColor="#d0d0d0" Height="135" Width="145"');
		PopDiv_Calendar.Url = Gv_CalendarPopDivURL;
		Gv_openChkCal = true;	
}

function Gf_CreatePopDiv3Calendar()
{
		Create("PopupDiv", "PopDiv_Calendar3", 'Border="Flat" BorderColor="#d0d0d0" Height="135" Width="431"');
		PopDiv_Calendar3.Url = Gv_CalendarPopDiv3URL;
		Gv_openChkCal3 = true;	
}
/*===============================================================
=  : PopupDiv Calendar Set ()
= μ : obj			Grid Component ID
				 nRow			Current Row
				 nCell 		Selected Cell 
=  : Gf_SetPopupDivCalendar(obj, nRow, nCell, chkFlg)
===============================================================*/
function Gf_SetPopupDivCalendar(objGrd, nRow, nCell, chkFlg){	
	Gv_objGrid = objGrd;
	
	if (chkFlg) Gv_rtnDFlag = true;
	else Gv_rtnDFlag = false;
	
	var objBDs =  Gv_objGrid.BindDataset;
	Gv_objBindDs = object(objBDS).id;
	
	Gv_grdRow = nRow;
	Gv_grdColId =  Gv_objGrid.GetCellProp("Body",nCell, "ColId");
	
	var str_val = object(Gv_objBindDs).GetColumn(nRow, Gv_grdColId);
	
	var arr_val =  Gv_objGrid.GetCellRect(nRow,nCell);	
	var div_x = ClientToScreenX(objGrd, arr_val[0]);
	var div_y = ClientToScreenY(objGrd, arr_val[1]);
	var div_w = arr_val[2] - arr_val[0];
	var div_h = arr_val[3] - arr_val[1];
	
	if (Gv_openChkCal == false){
		Gv_rtnDate = str_val;
		Gv_CalendarPopDivX = div_x ;
		Gv_CalendarPopDivY = div_y;
		Gv_CalendarPopDivW = div_w;
		Gv_CalendarPopDivH = div_h;
		Gv_CalendarPopnRow = nRow;	
		Gf_CreatePopDivCalendar();
	}
	else
	{
		if ( length(str_val) > 0 )
		{
			var sYear = mid(str_val,0,4);
			var sMonth = mid(str_val,4,2);
			var sDay = mid(str_val,6,2);
			PopDiv_Calendar.Show_cal(sYear,sMonth,sDay,true);	
		}	
		else	
			PopDiv_Calendar.Show_cal("0","0","0",true);	

		if ( div_x < 0 ) div_x = 0;
		var ret = PopDiv_Calendar.TrackPopup(div_x, div_y,div_w,div_h);
		
		if ( ret.length() > 0 )
		{
			Gv_rtnDate = ret;
			object(Gv_objBindDs).SetColumn(nRow, Gv_grdColId,ret);
			
		}
	}

	if ( Gv_rtnDFlag ) return Gv_rtnDate;
	else return;
}		

/*===============================================================
=  : PopupDiv Calendar Set ()
= μ : obj			Grid Component ID
				 nRow			Current Row
				 nCell 		Selected Cell 
=  : Gf_SetPopupDivThreeCalendar(obj, nRow, nCell, chkFlg)
===============================================================*/
function Gf_SetPopupDivThreeCalendar(objGrd, nRow, nCell, chkFlg){	
	Gv_objGrid = objGrd;
	
	if (chkFlg) Gv_rtnDFlag = true;
	else Gv_rtnDFlag = false;
	
	var objBDs =  Gv_objGrid.BindDataset;
	Gv_objBindDs = object(objBDS).id;
	
	Gv_grdRow = nRow;
	Gv_grdColId =  Gv_objGrid.GetCellProp("Body",nCell, "ColId");
	
	var str_val = object(Gv_objBindDs).GetColumn(nRow, Gv_grdColId);
	
	var arr_val =  Gv_objGrid.GetCellRect(nRow,nCell);	
	var div_x = ClientToScreenX(objGrd, arr_val[0]);
	var div_y = ClientToScreenY(objGrd, arr_val[1]);
	var div_w = arr_val[2] - arr_val[0];
	var div_h = arr_val[3] - arr_val[1];
	
	if (Gv_openChkCal3 == false){
		Gv_rtnDate = str_val;
		Gv_CalendarPopDivX = div_x -141;
		Gv_CalendarPopDivY = div_y;
		Gv_CalendarPopDivW = div_w;
		Gv_CalendarPopDivH = div_h;
		Gv_CalendarPopnRow = nRow;	
		Gf_CreatePopDiv3Calendar();
	}
	else
	{
		if ( length(str_val) > 0 )
		{
			var sYear = mid(str_val,0,4);
			var sMonth = mid(str_val,4,2);
			var sDay = mid(str_val,6,2);
			PopDiv_Calendar3.Show_cal(sYear,sMonth,sDay,true);	
		}	
		else	
			PopDiv_Calendar3.Show_cal("0","0","0",true);	

		if ( ( div_x - 141) < 0 ) 
		{
			div_x = 0;
		}
		else
		{
			div_x = div_x -141;
		}	
		var ret = PopDiv_Calendar3.TrackPopup(div_x, div_y,div_w,div_h);
		
		if ( ret.length() > 0 )
		{
			Gv_rtnDate = ret;
			object(Gv_objBindDs).SetColumn(nRow, Gv_grdColId,ret);
			
		}
	}

	if ( Gv_rtnDFlag ) return Gv_rtnDate;
	else return;
}
/*===============================================================
=  : PopupDiv Calendar Set () --> User Calendar 
= μ : obj			Grid Component ID
				 nRow			Current Row
				 nCell 		Selected Cell 
=  : Gf_SetPopupDivCalendar(obj, nRow, nCell, chkFlg)
===============================================================*/
function Gf_OnUserPopup(obj,strText,nX,nY) {

		if ( length(strText) > 0 )
		{
			var sYear = mid(strText,0,4);
			var sMonth = mid(strText,4,2);
			var sDay = mid(strText,6,2);
			if ( obj.ButtonImageID == Gv_CalendarPopDiv3ImageID )
			{
				PopDiv_Calendar3.Show_cal(sYear,sMonth,sDay,true);	
			}
			else
			{
				PopDiv_Calendar.Show_cal(sYear,sMonth,sDay,true);	
			}	
		}	
		else	
		{
			if ( obj.ButtonImageID == Gv_CalendarPopDiv3ImageID )
			{
				PopDiv_Calendar3.Show_cal("0","0","0",true);	
			}
			else
			{
				PopDiv_Calendar.Show_cal("0","0","0",true);	
			}	
		}
		
		nX = ClientToScreenX(obj,0);
		nY = ClientToScreenY(obj,0);
		var ret;
		if ( obj.ButtonImageID == Gv_CalendarPopDiv3ImageID )
		{
			if ( ( nX - 141) < 0 ) 
			{
				nX = 0;
			}
			else
			{
				nX = nX -141;
			}	
			ret = PopDiv_Calendar3.TrackPopup(nX, nY,obj.Width,obj.Height);
		}
		else
		{
			if ( nX < 0 ) nX = 0;
			ret = PopDiv_Calendar.TrackPopup(nX, nY,obj.Width,obj.Height);
		}
		return ret;

}

/*===============================================================
=  : Grid Header Click => Sorting ó
= μ : Gridobj		Grid Object
         nCell			Column Index(Click Head index)
===============================================================*/
function Gf_SetGridSort(Gridobj,nCell, resetCol){

	var objBDs = Gridobj.BindDataset;	
	
	Gv_mCnt = Gridobj.GetCellProp("head",0,"colspan");
 	Gv_gCnt = 0;
 	
// ߰ ::>>> ʱ Sort Column
 	Gv_sortCol = resetCol;
 	
 	//if (Gridobj.GetSubCellCount("head",0) > 0) Gv_gCnt = Gridobj.GetSubCellCount("head",0) - 1;
	
	
	if (getKeyState("shift")){
		
		if (Gv_CreateChkDS == false){
			
			Create("Dataset","ds_grdsort", "");
			ds_grdsort.AddColumn("Col", "String",255); 
			ds_grdsort.AddColumn("Sort","String",255);
			
			Gv_CreateChkDS = true;
		}
		
		if (ds_grdsort.RowCount() < 1) Gf_SetHeadClearAll(Gridobj);
		
		Gf_SetGridShiftSort(Gridobj, objBDs, nCell);
		
	} else {	
		if (Gv_CreateChkDS) ds_grdsort.DeleteAll();
		Gf_GridSort(Gridobj,objBDs,nCell);
	}	
}

/*===============================================================
=  : Grid Header Click => Sorting ó
= μ : Gridobj		Grid Object
         dsObj      Grid BindDataset
         nCell			Column Index(Click Head index)
=  : Gf_GridSort(Gridobj,Dataset,nCell);
===============================================================*/
function Gf_GridSort(Gridobj,dsObj,nCell){
	var nheadText,sflag;
	
	var sort_cell;
	var sort_col;
	var sort_span;
 	var sort_columns="";
 	var rtnColumns;
 	
  //---------------------------------------------------------
	//  شϴ  ŸƲ Ʈũ ߰ Ǵ Ѵ.
	//---------------------------------------------------------
	if(right(Gridobj.GetCellProp("head",nCell,"text"),1) == CONST_ASC_MARK) {
	
		if (Gridobj.GetCellProp("head",nCell,"colspan") > 1){
			sort_col = Gridobj.GetCellProp("head",nCell,"col");
			sort_col -= Gv_gCnt;
			sort_span = Gridobj.GetCellProp("head",nCell,"colspan");			
			
			for (i=sort_col; i<toNumber(sort_col)+toNumber(sort_span); i++){
				if ( (Gridobj.getCellProp("body",i,"celltype") != "head") && 
					 (Gridobj.getCellProp("body",i,"display") != "checkbox") && 
					 ( length(Gridobj.getCellProp("body",i,"colid")) > 0) ) {
					sort_columns += Gridobj.GetCellProp("Body",i,"colid") + ",";
				}
			}
		} else {
			if ( (Gridobj.getCellProp("body",sort_col,"celltype") != "head") && 
				 (Gridobj.getCellProp("body",sort_col,"display") != "checkbox") && 
				 ( length(Gridobj.getCellProp("body",sort_col,"colid")) > 0) )	
			{	 		
				sort_col = Gridobj.GetCellProp("head",nCell,"col");
				sort_col -= Gv_gCnt;
				sort_columns = Gridobj.GetCellProp("Body",sort_col,"colid") + ",";
			}
		}
		
		nheadText = Gridobj.GetCellProp("head",nCell,"text");
		nheadText = replace(nheadText,CONST_ASC_MARK,"");
		nheadText = nheadText + CONST_DESC_MARK;
		
		rtnColumns = Gf_getSortColumn(Gridobj);
		sort_columns = sort_columns + rtnColumns;	 //",img_id:A,img_cd:A,";
		
		object(dsObj).sort(sort_columns,false);
		
	} else if(right(Gridobj.GetCellProp("head",nCell,"text"),1) == CONST_DESC_MARK) {
	
		var body_cnt = Gridobj.GetCellCount("Body");
		var sort_idx = 0;
		
// ߰ Sort Reset Column  ϴ 
		if (length(Gv_sortCol) > 2) {
			//sort_columns += Gv_sortCol+":A,";
			sort_columns += Gf_defaultSortCols();
		} else {
			for (i=0; i<body_cnt; i++){
				if (Length(Gridobj.GetCellProp("Body",i,"colid")) > 1){
				
				if ( (Gridobj.getCellProp("body",i,"celltype") != "head") && 
					 (Gridobj.getCellProp("body",i,"display") != "checkbox") && 
					 ( length(Gridobj.getCellProp("body",i,"colid")) > 0) ) {
					 	sort_columns += Gridobj.GetCellProp("Body",i,"colid") + ",";
						sort_idx++;
					}
				}
				if (sort_idx == 5) break;
			}
		}
		
		nheadText = Gridobj.GetCellProp("head",nCell,"text");
		nheadText = replace(nheadText,CONST_DESC_MARK,"");
		
		//rtnColumns = Gf_getSortColumn(Gridobj);
		
		//sort_columns = sort_columns + rtnColumns;
		//sort_columns = rtnColumns + sort_columns;
	//trace(sort_columns);	
		object(dsObj).sort(sort_columns,true);
		
	} else {
	
		if (nCell == 0 && Gv_gCnt > 0) return;
		
		if (Gridobj.GetCellProp("head",nCell,"colspan") > 1){
			sort_col = Gridobj.GetCellProp("head",nCell,"col");
			sort_col -= Gv_gCnt;
			sort_span = Gridobj.GetCellProp("head",nCell,"colspan");
			for (i=sort_col; i<toNumber(sort_col)+toNumber(sort_span); i++){
						
				if ( (Gridobj.getCellProp("body",i,"celltype") != "head") && 
					 (Gridobj.getCellProp("body",i,"display") != "checkbox") && 
					 ( length(Gridobj.getCellProp("body",i,"colid")) > 0) ) {
					 		sort_columns += Gridobj.GetCellProp("Body",i,"colid") + ",";
				}
			}
			
		} else {
			sort_col = Gridobj.GetCellProp("head",nCell,"col");
			
			sort_col -= Gv_gCnt;
			if ( (Gridobj.getCellProp("body",sort_col,"celltype") != "head") && 
				 (Gridobj.getCellProp("body",sort_col,"display") != "checkbox") && 
				 ( length(Gridobj.getCellProp("body",sort_col,"colid")) > 0) )
			{	 
				sort_columns = Gridobj.GetCellProp("Body",sort_col,"colid") + ",";
			}	
		}
		
		nheadText = Gridobj.GetCellProp("head",nCell,"text");
		nheadText = nheadText + CONST_ASC_MARK;
		
		rtnColumns = Gf_getSortColumn(Gridobj);
		
		sort_columns = sort_columns + rtnColumns;		//img_id:A,img_cd:A,";
		
		object(dsObj).sort(sort_columns,true);
	}
	 
	Gridobj.SetCellProp("head",nCell,"text",nheadText);	
	
	//---------------------------------------------------------
	//  شϴ  ̿ ش ŸƲ Ʈũ Ѵ.
	//---------------------------------------------------------
	
	var nColCnt = Gridobj.GetCellCount("head");
	var sRepText;
	
	
	for(i=Gv_gCnt;i<nColCnt;i++){
		
		if(nCell <> i) {		
		
			//if (length(Gridobj.GetCellProp("head",i,"text")) <1 ) continue;
			
			sRepText = replace(Gridobj.GetCellProp("head",i,"text"), CONST_ASC_MARK,"");
			//Gridobj.SetCellProp("head",i,"text", sRepText);
			
			sRepText = replace(sRepText, CONST_DESC_MARK,"");
			//sRepText = replace(Gridobj.GetCellProp("head",i,"text"), CONST_DESC_MARK,"");
			Gridobj.SetCellProp("head",i,"text", sRepText);
		}
	}
}

/*===============================================================
=  : Grid Sort   Column (Argument)
= Return : Column ID
===============================================================*/
function Gf_defaultSortCols() {
	var defaultCol;
	var arrSortCol = split(Gv_sortCol,",","webstyle");
	var sortLen = length(arrSortCol);
	
	for (i=0; i<sortLen; i++) {
		if (length(arrSortCol[i]) < 1) continue;
		defaultCol += arrSortCol[i]+",";// + ":A,";
	}
	
	return defaultCol;
}

/*===============================================================
=  : Grid Sort  Column 
= μ : objGrdgetCol		Grid Object
= Return : Column ID
===============================================================*/
function Gf_getSortColumn(objGrdgetCol){
	var bodyCount = objGrdgetCol.GetCellCount("body");
	var loopCnt = 0;
	var rtnCol = "";
	
	for (i=0; i<bodyCount; i++){
	
		if ( (objGrdgetCol.getCellProp("body",i,"celltype") != "head") && 
		     (objGrdgetCol.getCellProp("body",i,"display") != "checkbox") && 
				 (objGrdgetCol.getCellProp("body",i,"colid") != null) ) {
			
			if ( (loopCnt < 2) && ( i != (bodyCount -1))) {
				rtnCol += objGrdgetCol.getCellProp("body",i,"colid") + ":A,";
				loopCnt++;
			}
			
			if (loopCnt == 2) break;
		}
	}
	
	return rtnCol;
}

/*===============================================================
=  : Shift Key + Grid Header Click => Sorting ó
= μ : Gridobj		Grid Object
         dsObj      Grid BindDataset
         nCell			Column Index(Click Head index)
=  : Gf_SetGridShiftSort(obj, Dataset ,nCell);
===============================================================*/
function Gf_SetGridShiftSort(Gridobj, dsObj, nCell){
	var nheadText,sflag;
	
	var sort_cell;
	var sort_col;
	var sort_span;
 	var sort_columns="";
 	var depth_row;
 	var endCell;
 	
	if(right(Gridobj.GetCellProp("head",nCell,"text"),1) == CONST_ASC_MARK)	{
	
		if (Gridobj.GetCellProp("head",nCell,"colspan") > 1){
			sort_col = Gridobj.GetCellProp("head",nCell,"col");
			sort_col -= Gv_gCnt;
			sort_span = Gridobj.GetCellProp("head",nCell,"colspan");
			depth_row = Gridobj.GetCellProp("head",nCell,"row");
			
			for (i=sort_col; i<toNumber(sort_col)+toNumber(sort_span); i++){
				sort_columns += Gridobj.GetCellProp("Body",i,"colid") + ",";
			}
			endCell = toNumber(sort_col)+toNumber(sort_span);
			Gf_SetSubHeadClear(Gridobj, sort_col, endCell, depth_row);
			
		} else {
			sort_col = Gridobj.GetCellProp("head",nCell,"col");
			sort_col -= Gv_gCnt;
			sort_columns = Gridobj.GetCellProp("Body",sort_col,"colid");
		}
		
		nheadText = Gridobj.GetCellProp("head",nCell,"text");
		nheadText = replace(nheadText,CONST_ASC_MARK,"");
		nheadText = nheadText + CONST_DESC_MARK;
		sflag = CONST_DESC_MARK;
		
	}	else if (right(Gridobj.GetCellProp("head",nCell,"text"),1) == CONST_DESC_MARK) {
	
		if (Gridobj.GetCellProp("head",nCell,"colspan") > 1){
			sort_col = Gridobj.GetCellProp("head",nCell,"col");
			sort_col -= Gv_gCnt;
			sort_span = Gridobj.GetCellProp("head",nCell,"colspan");
			depth_row = Gridobj.GetCellProp("head",nCell,"row");
			
			for (i=sort_col; i<toNumber(sort_col)+toNumber(sort_span); i++){
				sort_columns += Gridobj.GetCellProp("Body",i,"colid") + ",";
			}
			
			endCell = toNumber(sort_col)+toNumber(sort_span);
			Gf_SetSubHeadClear(Gridobj, sort_col, endCell, depth_row);
			
		} else {
			sort_col = Gridobj.GetCellProp("head",nCell,"col");
			sort_col -= Gv_gCnt;
			sort_columns = Gridobj.GetCellProp("Body",sort_col,"colid");
		}
		
		nheadText = Gridobj.GetCellProp("head",nCell,"text");
		nheadText = replace(nheadText,CONST_DESC_MARK,"");		
		sflag = "";
		
	} else {
	
		if (nCell == 0 && Gv_gCnt > 0) return;
		
		if (Gridobj.GetCellProp("head",nCell,"colspan") > 1){
			sort_col = Gridobj.GetCellProp("head",nCell,"col");
			sort_col -= Gv_gCnt;
			sort_span = Gridobj.GetCellProp("head",nCell,"colspan");
			depth_row = Gridobj.GetCellProp("head",nCell,"row");
			
			for (i=sort_col; i<toNumber(sort_col)+toNumber(sort_span); i++){
				sort_columns += Gridobj.GetCellProp("Body",i,"colid") + ",";
			}
			endCell = toNumber(sort_col)+toNumber(sort_span);
			Gf_SetSubHeadClear(Gridobj, sort_col, endCell, depth_row);
			
		} else {
			sort_col = Gridobj.GetCellProp("head",nCell,"col");
			sort_col -= Gv_gCnt;
			sort_columns = Gridobj.GetCellProp("Body",sort_col,"colid");
		}
		
		nheadText = Gridobj.GetCellProp("head",nCell,"text");
		nheadText = nheadText + CONST_ASC_MARK;
		sflag = CONST_ASC_MARK;
	}
	
	var arr_cols = split(sort_columns,",");
	
	for (i=0; i<length(arr_cols); i++){
	
		var str_exist = ds_grdsort.FindRow("Col", arr_cols[i]);
		
		if (str_exist < 0) {
			ds_grdsort.AddRow();
			
			ds_grdsort.SetColumn(ds_grdsort.currow,"Col", arr_cols[i]);			
			ds_grdsort.SetColumn(ds_grdsort.currow,"Sort", "A");
			
			if (sflag == "") ds_grdsort.DeleteRow(str_exist);
			
		} else {
		
			ds_grdsort.DeleteRow(str_exist);
			
			if (sflag != "") {
				ds_grdsort.AddRow();
				ds_grdsort.SetColumn(ds_grdsort.currow,"Col", arr_cols[i]);
				if (sflag == CONST_DESC_MARK) ds_grdsort.SetColumn(ds_grdsort.currow,"Sort", "D");
				else ds_grdsort.SetColumn(ds_grdsort.currow,"Sort", "A");
			} 
		}
	}
	
	var str_sort = "";
	for (i=0; i<ds_grdsort.RowCount(); i++){
		if (length(ds_grdsort.GetColumn(i,"Col")) < 1) continue;
		
		if (i == toNumber(ds_grdsort.Rowcount()) -1) {
			str_sort += ds_grdsort.GetColumn(i,"Col") + ":" + ds_grdsort.GetColumn(i,"Sort");
		} else {
			str_sort += ds_grdsort.GetColumn(i,"Col") + ":" + ds_grdsort.GetColumn(i,"Sort") + ",";
		}
		//str_sort += ds_grdsort.GetColumn(i,"Col") + ":" + ds_grdsort.GetColumn(i,"Sort") + ",";
	}
	
	if (ds_grdsort.RowCount() < 1){
		var body_cnt = Gridobj.GetCellCount("Body");
		var sort_idx = 0;
		
		// ߰ Sort Reset Column  ϴ 
		if (length(Gv_sortCol) > 2) {
			str_sort += Gf_defaultSortCols();
		} else {
			for (i=0; i<body_cnt; i++){
				if (Length(Gridobj.GetCellProp("Body",i,"colid")) > 1){		
					
					if ((Gridobj.GetCellProp("Body",i,"colid") != null) && (Gridobj.GetCellProp("Body",i,"colid") != "" ) && (Gridobj.getCellProp("body",i,"display") != "checkbox") ) {
						str_sort += Gridobj.GetCellProp("Body",i,"colid") + ",";
						sort_idx++;
					}
				}
				if (sort_idx == 5) break;
			}
		}
		
	}
	
	object(dsObj).sort(str_sort,true);
	
	Gridobj.SetCellProp("head",nCell,"text",nheadText);
}

/*===============================================================
=  : Grid Selected Head Clear All ()
= μ : obj				Grid Component ID
=  : Gf_SetColumnAdd(obj)
===============================================================*/
function Gf_SetHeadClearAll(obj){	
	var nColCnt = obj.GetCellCount("head");
	var sRepText;
	
	for(i=Gv_gCnt;i<nColCnt;i++){		
		sRepText = replace(obj.GetCellProp("head",i,"text"), CONST_ASC_MARK,"");
		obj.SetCellProp("head",i,"text", sRepText);
		
		sRepText = replace(obj.GetCellProp("head",i,"text"), CONST_DESC_MARK,"");
		obj.SetCellProp("head",i,"text", sRepText);		
	}
}

/*===============================================================
=  : Grid Head Clear ()
= μ : obj		Grid Component ID
				 sCell	Start Cell Index
				 eCell 	End Cell Index
				 dRow		Head Depth
=  : Gf_SetSubHeadClear(obj, sCell, eCell, dRow)
===============================================================*/
function Gf_SetSubHeadClear(obj, sCell, eCell, dRow){	
	var nColCnt = obj.GetCellCount("head");
	var sRepText;
	var depth_row;
	var str_col;
	
	if (Gv_gCnt > 0){
		//sCell++;
		//eCell++;
		sCell += toNumber(Gv_gCnt);
		eCell += toNumber(Gv_gCnt);
	}
	
	for(i=Gv_gCnt;i<nColCnt;i++){
		depth_row = obj.GetCellProp("head",i,"row");
		str_col = obj.GetCellProp("head",i,"col");
		
		if (str_col >= sCell && str_col < eCell) {
		
			if(dRow < depth_row) {
				sRepText = replace(obj.GetCellProp("head",i,"text"), CONST_ASC_MARK,"");
				obj.SetCellProp("head",i,"text", sRepText);
				
				sRepText = replace(obj.GetCellProp("head",i,"text"), CONST_DESC_MARK,"");
				obj.SetCellProp("head",i,"text", sRepText);
			}
		}
	}
}


var gsv_FocusObj;
var gsv_FocusBkColor = "yellow";
var gsv_OrgBkColor;
/*===============================================================
=  :  Է Control  Focus ġ ÿ Bkcolor ó...Ŀ ִ ġ ǥ
          // Grid,Edit,TextArea,Calanar,MasKEdit,Combo,spin,radio,checkbox
= μ : Gridobj		Grid Object
         nCell			Column Index(Click Head index)
===============================================================*/
function Gf_OnFocus(Obj)
{
	if ( gsv_FocusObj != null )
	{
		gsv_FocusObj.bkcolor = gsv_OrgBkColor; 
		gsv_FocusObj = null;
	}
	
	if ( ( Obj.GetType() == "Edit" ) ||
		 ( Obj.GetType() == "TextArea" ) ||
		 ( Obj.GetType() == "Calendar" ) ||
		 ( Obj.GetType() == "MaskEdit" ) )
	{
		gsv_FocusObj = Obj;
		gsv_OrgBkColor = Obj.bkcolor;
		Obj.bkcolor = gsv_FocusBkColor;		
	}
}

/*===============================================================
=  :  Ű    Ʈ ̵
          // Grid
= μ : Gridobj		Grid Object
         nCell			Column Index(Click Head index)
===============================================================*/
function Gf_form_OnKeyDown(obj,objSenderObj,nChar,bShift,bControl,bAlt,nLLParam,nHLParam)
{
	if ( nChar == 13 ) // Enter Ű
	{
		// Ű Է½ ش ۳Ʈ ؽƮ    о....
		if ( ToUpperCase(objSenderObj.GetType()) == "TEXTAREA" ) return;
		
		var tmpObj;
		// ۳Ʈ   Ŀ ָ ǹư Ƿ
		// ش     ...
		if ( ToUpperCase(obj.GetNextComponent(true).GetType()) == "TAB" )
		{
			tmpObj = obj.GetNextComponent(true);
			tmpObj = tmpObj.GetItem(tmpObj.TabIndex);
			obj = tmpObj;
			//trace(tmpObj.id);
			obj.setFocus();
		}
		else if ( ToUpperCase(objSenderObj.GetType()) == "TAB" )
		{
			tmpObj = objSenderObj.GetItem(objSenderObj.TabIndex);
			//trace(">>>>>>>>>>>>>>>" + tmpObj.id);
			tmpObj.setFocus();
		}
		else if ( ( ToUpperCase(objSenderObj.GetType()) == "GRID" ) &&
				  ( objSenderObj.Editable ) )
		{
			var ret = objSenderObj.MoveToNextCell();
			if ( !ret )
			{
				obj.GetNextComponent(true).setFocus();
			}
		}
		else
		{
			obj.GetNextComponent(true).setFocus();
		}
	}	
}

/*===============================================================
=  :  MaskEdit  Number  
          // MaskEdit , Type = Number
= μ : Gridobj		Grid Object
         nCell			Column Index(Click Head index)
===============================================================*/
function Gf_MaskEdit0_OnClick(obj,objDragObj,nX,nY)
{
	obj.SetSel(Length(obj.Text),Length(obj.Text));
}


var Gsv_GridHeadClickEvent = Array();
/*===============================================================
=  :  Loadÿ Event  ó.....
          // MaskEdit , Type = Number
= μ : Gridobj		Grid Object
         nCell			Column Index(Click Head index)
===============================================================*/
function Gf_FormLoadEventProc()
{
	this.OnKeyDown = "Gf_form_OnKeyDown";
	for ( var i = 0 ; i < this.Components.Count ; i++ )
	{
		if (  ( this.Components[i].GetType() == "Dataset" ) ||
			  ( this.Components[i].GetType() == "File" ) ||	
			  ( this.Components[i].GetType() == "FileDialog" ) ||	
			  ( this.Components[i].GetType() == "PopupDiv" ) 
		   )	
			continue;
		
		Gf_EventLink(this.Components[i]);
		if ( Components[i].IsComposite() )
		{
			Gfn_SubFormEventProc(Components[i]);
		}
	}
}

function Gfn_SubFormEventProc(obj)
{
	for ( var i = 0 ; i < obj.Components.Count ; i++ )
	{
		if (  ( obj.Components[i].GetType() == "Dataset" ) ||
			  ( obj.Components[i].GetType() == "File" ) ||	
			  ( obj.Components[i].GetType() == "FileDialog" ) ||	
			  ( obj.Components[i].GetType() == "PopupDiv" ) 
		   )	
			continue;
			
		Gf_EventLink(obj.Components[i]);
		if ( obj.Components[i].IsComposite() )
		{
			Gfn_SubFormEventProc(obj.Components[i]);
		}
	}
}

function Gf_EventLink(obj)
{
//Grid,Edit,TextArea,Calanar,MasKEdit,Combo,spin,radio,checkbox
	switch(obj.GetType())
	{
		case "Grid" :
			obj.UserData = obj.OnHeadClick;
			obj.OnHeadClick = "Gfn_grd_OnHeadClick";
			obj.OnFocus = "Gf_OnFocus";
			break;
		case "MaskEdit" :
		
			obj.OnFocus = "Gf_OnFocus";
			if ( obj.Type == "NUMBER" )
			{
				obj.OnClick = "Gf_MaskEdit0_OnClick";
			}
			break;
		case "Edit" :
			obj.OnFocus = "Gf_OnFocus";
			break;
		case "TextArea" :
			obj.OnFocus = "Gf_OnFocus";
			break;
		case "Combo" :
			obj.OnFocus = "Gf_OnFocus";
			break;
		case "Calendar2" :
			obj.OnFocus = "Gf_OnFocus";
			if ( obj.ButtonImageID == Gv_CalendarPopDivImageID )
			{
				if (Gv_openChkCal == false)
				{
					Gv_CalendarPopnRow = -1;
					Gf_CreatePopDivCalendar();
				}
			}
			if ( obj.ButtonImageID == Gv_CalendarPopDiv3ImageID )
			{
				if (Gv_openChkCal3 == false)
				{
					Gv_CalendarPopnRow = -1;
					Gf_CreatePopDiv3Calendar();
				}
			}
			obj.OnUserPopup = "Gf_OnUserPopup";
			break;
		case "Spin" :
			obj.OnFocus = "Gf_OnFocus";
			break;
		case "Radio" :
			obj.OnFocus = "Gf_OnFocus";
			break;
		case "Checkbox" :
			obj.OnFocus = "Gf_OnFocus";
			break;
	}
}


function Gfn_grd_OnHeadClick(obj,nCell,nX,nY)
{
	if ( length() > 0 )
	{
		var ret = eval(obj.UserData + "(obj,nCell,nX,nY)");
		if ( !ret ) return; 
	}
	
	Gf_SetGridSort(obj,nCell);
}