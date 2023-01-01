﻿/*====================================================================================================
= 업 무 명 : 
= 프로그램 : 공통처리모듈
= 화 일 명 : commonlib.js
= 작 성 자 : 
= 작성일자 : 2005.10.15
= 수정일자 : 
= 기능설명 : 공통기능을 처리하기 위한 공통처리모듈

공통 함수 설명 - 
=====  공용 함수 기능 목록 ( 추가시 주석란에 함수를 추가햐여 주십시요. ) =======

	//일반 공용함수

	gfn_Modify(dsObj) - 데이타 변경여부 확인
	gfn_PrevObj() - 다음 오브젝트로 포커스를 변경한다.
	gfn_IsNumber(sVal) - 입력값이 숫자인지를 확인한다
	gfn_IsDateYMD(sYmd) - 날짜 여부를 확인한다.(년월일)
	gfn_MonthLastDay(fmonth) - 월에 마지막 날을 가져온다
	gfn_grd_UnSort(grid_obj, cellcnt) - Grid Sort 초기화(Head 부분 - ▲ 제거)
	gfn_Sort(Grid_obj,Dataset_obj,cell) - Grid Sort
	gfn_titleClear(Grid_obj) - Grid Sort
	gfn_ToPrint(dshead, dsbody, report, flag) - 출력물 미리보기..
	gfn_MsgBox(msgcode,msgstr) - 메시지 출력.
	gfn_SetPopupDivCalendar(objGrd, nRow, nCell) - Grid에 달력컴포넌드
	gfn_SetColumnAdd(value) -
	gfn_CalChanged(obj) -
	gfn_IsEmpty(str_val)   Null 및 공란이면 True 아니면 False
	gfn_IsEmpty_d(str_val) Null 및 공란 또는 zero이면 True 아니면 False
*/

///////////////////////////////////////////////////////////////////////////////

var gfn_openChkGrid = false;										// Create Object Check 용 (PopupDivMultiSelect)
var gfn_openChkCal = false;										// Create Object Check 용(PopupDaiv Calendar)
var gfn_objGrid;																// Multi Select Return Object
var gfn_objMGrdDs;															// Multi Select DataSet
var gfn_objBindDs;															// Grid BindDataset 
var gfn_grdRow;																// Grid Selected Row
var gfn_grdColId;															// Grid Selected Column
var gfn_GrdChk, ngmv_GrdCode, ngmv_GrdText;		// DataSet Column(Display)

var gfn_CreateChkDS = false;										// Multi Sort(Column 정의 Dataset)

var gfn_mCnt;
var gfn_gCnt;
var gfn_CodeCol;																// Multi Selected Item(Code)

///////////////////////////////////////////////////////////////////////////////

// Key값 정의 변수 
var KEY_F01 = "112";
var KEY_F02 = "113";
var KEY_F03 = "114";
var KEY_F04 = "115";
var KEY_F05 = "116";
var KEY_F06 = "117";
var KEY_F07 = "118";
var KEY_F08 = "119";
var KEY_F09 = "120";
var KEY_F10 = "121";
var KEY_F11 = "122";
var KEY_F12 = "123";
var KEY_A   = "65";
var KEY_D   = "68";
var KEY_P   = "80";
var KEY_S   = "83";
var KEY_Z   = "90";
var KEY_0   = "48";
var KEY_9   = "57";
var KEY_TAB = "9";
var KEY_ESC = "27";
var KEY_ENTER  = "13";
var KEY_INSERT = "45";
var KEY_DELETE = "46";
var KEY_HOME   = "36";
var KEY_END    = "35";
var KEY_PAGEUP = "33";
var KEY_PAGEDOWN = "34";

var vSortST;						//Grid Sort 시 필요한 배열 변수 [호출하는 페이지에서는 배열의 크기를 결정해야 한다.]
var CONST_ASC_MARK="▲";	//Grid Sort Mark
var CONST_DESC_MARK="▼";	//Grid Sort Mark
var ds_debug;					//Debug Dataset

function gfn_Sort(Grid_obj,Dataset_obj,cell)
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
			//Grid_obj.SetCellProp("head",cell,"align","left");
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
			//Grid_obj.SetCellProp("head",cell,"align","left");
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
			//Grid_obj.SetCellProp("head",cell,"align","left");
		}
		cell_title = Grid_obj.GetCellProp("head",cell,"text");

		flag = "true";
		tmp_str = cell_title + " ▼";
		Grid_obj.SetCellProp("head",cell,"text",tmp_str);
	}

	Dataset_obj.Sort(Grid_obj.GetCellProp("body",cell,"colid"), flag);

	Grid_obj.redraw = true;

}

function gfn_titleClear(Grid_obj)
{
	Grid_obj.redraw = false;

	for ( i = 0 ; i < Grid_obj.GetCellCount("Head") ; i++ )
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
	}
	Grid_obj.redraw = true;
}

/*----------------------------------------------------------------
/설  명 : Grid Sort 초기화(Head 부분 - ▲ 제거)
/인  자 : [grid_obj - 초기화할 Grid, cellcnt - Grid 셀의개수 ]
----------------------------------------------------------------*/
function gfn_grd_UnSort(grid_obj, cellcnt)
{
	var tmp_str;
	var f_pos;

	Grid_obj.redraw() = false;
	cellcnt = Grid_obj.GetCellCount("head");
	for ( i = 0 ; i < cellcnt ; i = i + 1 )
		{
			tmp_str = Grid_obj.GetCellProp("head",i,"text");
			f_pos = pos(tmp_str,"▲");
			if ( f_pos > 0 )
			{
				tmp_str = tmp_str.replace("▲","");
			}
			else
			{
				f_pos1 = pos(tmp_str,"▼");
				if ( f_pos1 > 0 )
				{
					tmp_str = tmp_str.replace("▼","");
				}
			}
			Grid_obj.SetCellProp("head",i,"text", tmp_str );
		}
	Grid_obj.redraw() = true;	
}



/*===============================================================
= 기능 : 데이타 변경여부 확인
= 인수 : dsObj 데이터셋 콤포넌트의 이름 (예 : dsGrid01)
= 리턴 : True : 변경된 자료 존재 False : 변경된 자료 미존재
===============================================================*/
function gfn_Modify(dsObj)
{
	// 데이타변경여부 확인
	for (var i = 0; i < dsObj.RowCount(); i++)
	{
		if ((dsObj.GetRowType(i) == "insert") || (dsObj.GetRowType(i) == "update"))
		{
			return true;
		}
	}
	return false;
}


/*===============================================================
= 기능 : 다음 오브젝트로 포커스를 변경한다.
= 인수 : 
===============================================================*/
function gfn_PrevObj()
{
/* 
  현재 포커스를 가진 Component의 다음 Object를 얻어온다.
  포커스를 [TAB] Order를 가진 윈도우에서만 발생한다. 
  즉, Static, Shape Component, 또한 Static한 Image Component는 무시하게 된다
*/                  
  var objCom = GetNextComponent();
  
  /*
  var str = “다음 Component = ”;
  str = str + objCom.text + " ";
  str = str + objCom.type + " ";
  alert(str);
  */
  objCom.SetFocus();
  
}


/*===============================================================
= 기능 : 입력값이 숫자인지를 확인한다
= 인수 : sVal 입력스트링
= 리턴 : 0(적합), -1(부적합) => 적합이면 숫자값
===============================================================*/
function gfn_IsNumber(sVal)
{
  
  	var i, iBit;
  	
  	var ll_str_len;
  	
  	ll_str_len = length(sVal);  //.length();
  	
  	//alert("ll_str_len : " + ll_str_len);
  

  	for(i=0; i<ll_str_len; i++)
  	{
    	//iBit = parseInt(sVal.substr(i,1));     //문자(Char)를 숫자로 변경
    	
    	iBit = tointeger(substr(sVal,i,1));     //문자(Char)를 숫자로 변경
    	
    	/*
    	if((0 <= iBit) && (9 >= iBit))
    	{
      	//alert(i+':'+iBit+':'+'Mun');
      	//trace("iBit : " +iBit);
    	}
    	else
    	{
      	//alert((i+1)+'번째 문자는 숫자가 아닙니다.');
      	trace("(" + (i+1) + ") 번째 문자는 숫자가 아닙니다");
      	return -1;
    	}
    	*/
    	
    	//trace(substr(sVal,i,1)+" -> "+toNumber(substr(sVal,i,1))+", "+iBit);
    	
    	if((0 > iBit) || (9 < iBit))
    	{
    	    return -1;
    	}
  	}

  	return 0;
}

/*------------------------------------------------------------------
/기능 : 월에 마지막 날을 가져온다
/인수 : 월
/리턴 : 마지막날
------------------------------------------------------------------*/
function gfn_MonthLastDay(fmonth)
{
  if ( fmonth == 1 )
    return 31;  
  if ( fmonth == 2 )
    return 29;  
  if ( fmonth == 3 )
    return 31;  
  if ( fmonth == 4 )
    return 30;  
  if ( fmonth == 5 )
    return 31;  
  if ( fmonth == 6 )
    return 30;  
  if ( fmonth == 7 )
    return 31;  
  if ( fmonth == 8 )
    return 31;  
  if ( fmonth == 9 )
    return 30;  
  if ( fmonth == 10 )
    return 31;  
  if ( fmonth == 11 )
    return 30;  
  if ( fmonth == 12 )
    return 31;
}

/*===============================================================
= 기능 : 날짜 여부를 확인한다.(년월일)
= 인수 : sYmd 입력스트링(YYYYMMDD)
=
= 리턴 : 0(적합), -1(부적합) => 적합이면 날짜값
===============================================================*/
function gfn_IsDateYMD(sYmd)
{
	//
	  
  	if(  length(sYmd) < 1)
  	{
    	return -1;
  	}
  	
	
    // 숫자 확인
    if(gfn_IsNumber(sYmd) == -1)
    {
    	gprAlert("날짜는 숫자만 입력하십시오.!!!","날짜 체크 오류",MM_ERROR);
    	return -1;
  	}
  	
    
  	// 길이 확인
  	if(length(sYmd) == 8) {
  	} else {
	    //gprAlert("일자를 모두 입력하십시오.!!!","날짜 체크 오류",MM_ERROR);
	    gprAlert("일자의 형식을 확인하여 주십시요.","날짜 체크 오류",MM_ERROR); //20040111 정인혁(홍과장요구사항)
    	return -1;
  	}
  	
  	var iYear = ToNumber(sYmd.substr(0,4));  // 년도 입력(YYYY)
  	var iMonth = ToNumber(sYmd.substr(4,2));   //월입력(MM)
  	var iDay = ToNumber(sYmd.substr(6,2));     //일자입력(DD)
  	
  	if((iMonth < 1) ||(iMonth >12))
  	{
	    //gprAlert(iMonth+"월의 입력이 잘못 되었습니다.!!!",DATE_CHECK_TITLE,MM_ERROR);
	    gprAlert(iMonth+"월의 입력이 잘못 되었습니다.!!!","날짜 체크 오류",MM_ERROR);
        return -1;
  	}
  	
  	
  	// 날짜의 존재 여부를 확인
  	if(GetDay(sYmd) < 0 )
  	{
	    gprAlert("해당일자는 존재하지 않습니다.!!!","날짜 체크 오류",MM_ERROR);
    	return -1;
  	}
  	
  	return 0;
}

/*----------------------------------------------------------------
/설  명 : 출력 공통
/인  자 : dshead - head dataset
				dsbody - body dataset
				report - report 파일명
				flag	- "DS_only" 데이터셋 1개로 구성될경우...
----------------------------------------------------------------*/
function gfn_ToPrint(dshead, dsbody, report, flag)
{
	var arg;
	arg	="dshead=" + dshead + " dsbody="+ dsbody + " report="+ report + " flag=" + flag;

	//trace("arg : " + arg);
	
	Dialog("pub_main::Prn_preview.xml", arg, "800", "600",  true, 100,100);
}



/*----------------------------------------------------------------
/설  명 : 메세지 처리
/인  자 : msgcode - 메시지코드
  				msgstr - 메시지 설명
----------------------------------------------------------------*/
function gfn_MsgBox(msgcode,msgstr)
{
	// 코드 값으로 DB 연동 메세지 출력
	var arg_str = "";
	
	arg_str  = "ArgCode=" + quote(msgcode);
	arg_str += " ArgMsg=" + quote(msgstr);
	Dialog("pub_main::MsgForm.xml", arg_str, 465, 265, true);

	//alert("[ " +msgcode + " ] \n\n" + msgstr);
}


/*===============================================================
= 기능 : PopupDiv Calendar Set (공통)
= 인수 : obj			Grid Component ID
				 nRow			Current Row
				 nCell 		Selected Cell 
= 예제 : gfn_SetPopupDivCalendar(obj, nRow, nCell)
===============================================================*/
function gfn_SetPopupDivCalendar(objGrd, nRow, nCell){	
	gfn_objGrid = objGrd;	
	
	var objBDs =  gfn_objGrid.BindDataset;
	gfn_objBindDs = object(objBDS).id;
	
	gfn_grdRow = nRow;
	
	gfn_grdColId =  gfn_objGrid.GetCellProp("Body",nCell, "ColId");

	var str_val = object(gfn_objBindDs).GetColumn(nRow, gfn_grdColId);
	var arr_val =  gfn_objGrid.GetCellRect(nRow,nCell);	
	var div_x = ClientToScreenX(objGrd, arr_val[0]);
	var div_y = ClientToScreenY(objGrd, arr_val[1]);
	var div_w = arr_val[2] - arr_val[0];
	var div_h = arr_val[3] - arr_val[1];
	
	if (gfn_openChkCal == false){
		Create("PopupDiv", "PopDiv_Calendar", 'width="152" height="133"');
		gfn_openChkCal = true;
	}
	
	PopDiv_Calendar.Contents = gfn_SetPopDivCalContent(str_val);
	PopDiv_Calendar.TrackPopup(div_x, div_y, div_w, div_h);	
}		




/*===============================================================
= 기능 : PopupDiv Calendar Set Contents (공통)
= 인수 : str_val		Selected Date
= 결과 : return  		PopupDiv Contents				 
= 예제 : gfn_SetColumnAdd(value)
===============================================================*/
function gfn_SetPopDivCalContent(str_val){
	var str_temp;
/*
	str_temp += '<Contents>';
	str_temp += '<Calendar BackColorColumn="HOLIDAY" Border="Flat" ClickedBkColor="#394c5a" ClickedTextColor="white" ' + chr(10); 
	str_temp += 'DateColumn="HOLIDAY" InnerDataset="GDS_NGMHOLIDAY" LeftMargin="2" Height="152" Id="CAL_PopupDiv" ' + chr(10);
	str_temp += 'Value="' + str_val + '"Left="0" LeftMargin="2" NullValue="&#32;" RightMargin="2" MonthOnly="TRUE" ' + chr(10);
	str_temp += 'OnChanged="gfn_CalChanged" OnDayClick="gfn_CalChanged" SaturdayTextColor="blue" Style="cal_style1" SundayTextColor="red" ' + chr(10);
	str_temp += 'TextColorColumn="HOLIDAY" Top="0" Width="152"></Calendar>' + chr(10);
	str_temp += '</Contents>';
*/
	str_temp += '<Contents>';
	str_temp += '<Calendar Border="Flat" ClickedBkColor="#394c5a" ClickedTextColor="white" ' + chr(10); 
	str_temp += 'LeftMargin="2" Height="152" Id="CAL_PopupDiv" ' + chr(10);
	str_temp += 'Value="' + str_val + '"Left="0" LeftMargin="2" NullValue="&#32;" RightMargin="2" MonthOnly="TRUE" ' + chr(10);
	str_temp += 'OnChanged="gfn_CalChanged" OnDayClick="gfn_CalChanged" SaturdayTextColor="blue" Style="cal_style1" SundayTextColor="red" ' + chr(10);
	str_temp += 'TextColorColumn="HOLIDAY" Top="0" Width="152"></Calendar>' + chr(10);
	str_temp += '</Contents>';	
	return str_temp;
}



/*===============================================================
= 기능 : Calendar Date Changed Event (공통)
= 인수 : obj				Calendar Component ID
= 예제 : gfn_CalChanaged(obj)
===============================================================*/
function gfn_CalChanged(obj){
	object(gfn_objBindDs).SetColumn(gfn_grdRow, gfn_grdColId, obj.Value);
	PopDiv_Calendar.ClosePopup();
}

/*===============================================================
= 기능 : Null 및 공란이면 True 아니면 False
= 인수 : str_val	
= 결과 : return :  rue 아니면 False
===============================================================*/
function gfn_IsEmpty(str_val){
	str_val = trim(str_val);
	if (str_val.length == 0  || str_val == null )
		return true;
	else
		return false;
}

/*===============================================================
= 기능 : Null 및 공란 또는 zero이면 True 아니면 False
= 인수 : str_val	
= 결과 : return :  rue 아니면 False
===============================================================*/
function gfn_IsEmpty_d(str_val){
	str_val = trim(str_val);
	if (str_val == null || str_val == 0 || str_val == 0.0 )
		return true;
	else
		return false;
}
