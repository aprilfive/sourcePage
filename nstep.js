/*===============================================================
= 기능 : 날짜 여부를 확인한다.(년월일)
= 인수 : 입력스트링(YYYYMMDD)
=
= 리턴 : 0(적합), -1(부적합)
===============================================================*/
function gfnIsDateYMD(strYmd)
{
	// 날짜의 존재 여부를 확인
	if(GetDay(strYmd) < 0 )	return false;
	return true;
}
	
/*===============================================================
= 기능 : Argument를 넘겨줄 스트링 데이터를 생성, 추가한다.
= 인수 : strName: 넘겨줄 Argument명, 
=        strVal: 넘겨줄 Argument값, 
=
= 리턴 : strArg, 에러가 발생한 경우 빈문자열을 넘긴다.
===============================================================*/
function gfnSetParam(strName, strVal) {
	if(length(strName) == 0) {
	   trace("Argument명을 넣어주세요.");
	   return "";
	}
	
	var strArg = " " + strName + "=" + quote(UrlEncode(strVal));
	return strArg;
}

/*===============================================================
= 기능 : 넘겨받은 스트링 데이터에서 갖고올 Argument값을 얻는다 
= 인수 : strArg:  스트링 데이터, strName: 찾는 Argument명, 
=        
=
= 리턴 : Argument값, 에러가 발생한 경우 빈문자열을 넘긴다.
===============================================================*/
function gfnGetParam(strArg, strName) {
	var sArrVal;
	
	if(length(strArg) == 0) return "";
	if(length(strName) == 0) return "";
	
	var nPos = IndexOf(strArg, " " + strName);
	
	if(nPos == -1) return "";
	
	sArrVal = Split(NToken(SubStr(strArg, nPos+1), " ", 1), "=");
    
    if(sArrVal[0] != strName) return "";
    
	return UrlDecode(UnQuote(sArrVal[1]));
}

/*==============================================================================
 * 해당 윈도우를 active처리
 ==============================================================================*/
function gfnActiveWindow(DocID)
{
	DocRow = gds_Map.FindRow("subID", DocID);
	if(DocRow >= 0) {
		for(var i=0;i<global.windows.count;i++) {
			if(global.windows[i].id == DocID) {
				global.windows[i].setFocus();
				return true;
			}	
		}
	}
	return false;
}

/*==============================================================================
 * 전역 글로벌 이벤트 함수들
 * 전용 브자우저에 해당하는 전체 프레임윈도우에 관한 이벤트 처리및 해당 함수
 ==============================================================================*/
function gprMenuFunc_Click(objDataSet, strID,STRFG)
{
	if (length(strID) == 0) return;
	
	var menuRow, appgrp, pgmId, caption, nRow, nTreeRow, sGroup;
	var winOpenXpos = 0;
	var winOpenYpos = 0;
	var winOpenWidth = 0;
	var winOpenHeight = 0;
    
    var DocID =  "W" + g_ScreenNo + strID;
    
	if(gfnActiveWindow(DocID) == true) return;
	
	menuRow = objDataSet.FindRow("pgm_id", strID);
	if(menuRow > 0) {
		pgmId       = objDataSet.GetColumn(menuRow, "pgm_id");
		appgrp 		= "app_krx";
		caption 	= objDataSet.GetColumn(menuRow, "caption");
		sGroup 	= objDataSet.GetColumn(menuRow, "group");
    }
    
	DocRow = gds_Map.AddRow();
	gds_Map.SetColumn(DocRow, "type", "W");
	gds_Map.SetColumn(DocRow, "ID", g_ScreenNo);
	gds_Map.SetColumn(DocRow, "subID",  DocID);
	gds_Map.SetColumn(DocRow, "name",  caption);
	
	gfn_SetWindow(DocID, "Max");
	gfn_SetActiveWindow(DocID);
	Doc_tabbar.AddTab(DocRow);
	
	var strFormArgument = "";
	if(Length(appgrp) == 0) appgrp = "app_krx";
	strFormArgument += "ArgAppGrp=" + quote(appgrp);
	strFormArgument += " ArgFormID=" + quote(pgmId);
	strFormArgument += " ArgCaption=" + quote(caption);
	strFormArgument += " ArgGroup=" + quote(sGroup);

    displayMode = "OpenStyle=Max  TitleBar=false";
    
	NewWindow(DocID, "app_main::form_main.xml", strFormArgument, winOpenWidth, winOpenHeight, displayMode, winOpenXpos, winOpenYpos);
	
	if(STRFG == "N") {
		var objTab = global.Doc_left.Tab0;
		var strDs =	objTab.GetItem(objTab.TabIndex).TreeView0.BindDataSet;
		var objDs = global.Doc_left.object(strDs);
		
		objDs.Row = menuRow;
	}
}



function gfn_UnLoadComplete()
{
	if(global.Doc_tabbar.visible == true) 
		gds_Map.SetConstColumn("tabbar",1);
	else
	    gds_Map.SetConstColumn("tabbar",0);
	    
	if(global.Doc_left.visible == true) 
		gds_Map.SetConstColumn("left",1);
	else
	    gds_Map.SetConstColumn("left",0);
	
	if(global.Doc_button.visible == true) 
		gds_Map.SetConstColumn("button",1);
	else
	    gds_Map.SetConstColumn("button",0);
	    
	if(global.Doc_menu.visible == true) 
		gds_Map.SetConstColumn("menu",1);
	else
	    gds_Map.SetConstColumn("menu",0);
	    
	if(global.Doc_screen.visible == true) 
		gds_Map.SetConstColumn("screen",1);
	else
	    gds_Map.SetConstColumn("screen",0);
	
	gds_Map.Filter("type==\"W\"");
	for(i=gds_Map.rowcount-1;i>=0;i--) gds_Map.DeleteRow(i);
	gds_Map.UnFilter();
	Doc_bottom.SaveConf();
}

function gfn_OnLoadComplete()
{
	//global.AppStatus = "Max"; //"Min"/"Max"/"Normal" 
	
	//g_WinCnt = 0;
	//g_ScreenWidth_Max = Global.Window.Width;
}

function gfn_SetScreen()
{

    global.Doc_tabbar.visible = (gds_Map.GetConstColumn("tabbar") == 1);
    global.Doc_button.visible = (gds_Map.GetConstColumn("button") == 1);
    global.Doc_left.visible = (gds_Map.GetConstColumn("left") == 1);
    global.Doc_menu.visible = (gds_Map.GetConstColumn("menu") == 1);
    global.Doc_screen.visible = (gds_Map.GetConstColumn("screen") == 1);
    
    if(gds_Map.rowcount < 0) return;
    
	global.Doc_screen.initScreen();
	global.Doc_tabbar.initTap();
	global.Doc_button.initButton();
	global.Doc_menu.initMenu();
}

function gfn_SetWindow(subID, status)
{
    nRow = gds_Map.FindRow("subID", subID);
    if(nRow >= 0) 
    {
		gds_Map.SetColumn(nRow, "val", status);
    }
}

function gfn_SetActiveWindow(subID)
{
    nRow = gds_Map.FindRow("subID", subID);
    gds_Map.Filter("ID=\"" + gds_Map.GetColumn(nRow, "ID") + "\"");
    for(i=0;i<gds_Map.rowcount;i++)
    {
		if(gds_Map.GetColumn(i, "subID") != subID)
			gds_Map.SetColumn(i, "active",  0);
		else
			gds_Map.SetColumn(i, "active",  1);
	}
	gds_Map.UnFilter();
}

function gfn_GetWindowStatus(subID)
{
    nRow = gds_Map.FindRow("subID", subID);
    if(nRow >= 0) 
    {
		return gds_Map.GetColumn(nRow, "val");
    }
    return 0;
}

function gfn_DeleteWindow(subID)
{
	nRow = gds_Map.SearchRow("ID=='" + G_ScreenNo + "'&&subID=='" + subID + "'");
    if(nRow >= 0) 
    {
		gds_Map.DeleteRow(nRow);
    }
}

function gfn_GetWindowActive(subID)
{
    nRow = gds_Map.FindRow("subID", subID);
    if(nRow >= 0) 
    {
		return gds_Map.GetColumn(nRow, "active");
    }
    return 0;
}

function gfn_SetMenu(ds)
{
	gds_Map.Filter("type==\"M\"");
	for(i=gds_Map.rowcount-1;i>=0;i--) gds_Map.DeleteRow(i);
	gds_Map.UnFilter();
	for(i=0;i < ds.RowCount;i++)
	{
		nRow = gds_Map.AddRow();
		gds_Map.SetColumn(nRow, "type", "M");
		gds_Map.SetColumn(nRow, "ID", ds.GetColumn(i, "m_id"));
		gds_Map.SetColumn(nRow, "Seq" , ds.GetColumn(i, "m_lvl"));
		gds_Map.SetColumn(nRow, "name", ds.GetColumn(i, "m_name"));
		gds_Map.SetColumn(nRow,  "val", ds.GetColumn(i, "m_url"));
	}
	Doc_menu.initMenu();
}

function gfn_SetButton(ds)
{
	gds_Map.Filter("type==\"B\"");
	for(i=gds_Map.rowcount-1;i>=0;i--) gds_Map.DeleteRow(i);
	gds_Map.UnFilter();
	for(i=0;i < ds.RowCount;i++)
	{
		nRow = gds_Map.AddRow();
		gds_Map.SetColumn(nRow, "type", "B");
		gds_Map.SetColumn(nRow, "ID", ds.GetColumn(i, "imageId"));
		gds_Map.SetColumn(nRow, "Seq" , ds.GetColumn(i, "idx"));
		gds_Map.SetColumn(nRow, "val", ds.GetColumn(i, "link"));
		gds_Map.SetColumn(nRow,  "Name", ds.GetColumn(i, "tooltip"));
		gds_Map.SetColumn(nRow,  "linkFg", ds.GetColumn(i, "linkFg"));
		gds_Map.SetColumn(nRow,  "subID", ds.GetColumn(i, "pgm_id"));
		gds_Map.SetColumn(nRow,  "enable", ds.GetColumn(i, "enable"));
		gds_Map.SetColumn(nRow,  "USE", ds.GetColumn(i, "USE"));
	}
	//Doc_menu.initMenu();
}

// Global script 영역에 추가.
function OnSQLiteRecvData(obj, nRecvCount)
{
	g_DsRecv.SetColumn(0, obj.ID, nRecvCount);        // Global dataset: 1 Row짜리를 미리 선언했음.
}


// MDI 차일들 윈도우 실행 ..
function g_OpenChildWindow(str_prefix, str_url, str_title)
{
	var int_pos, str_formid = "";
	
	if ((str_prefix != null) && (str_url != null)) 
	{	
		//NewWindow(str_url, str_prefix + "::" + str_url, "", 830, 605, "OpenStyle=Max,Instance=Single", 0, 0);
		var ArgStr = "";
		ArgStr  = "arg_Prefix=" + quote(str_prefix);
		ArgStr += " arg_Url=" + quote(str_url);
		ArgStr += " arg_Title=" + quote(str_title);
		
		
		g_OpenUrl = str_prefix + "::" + str_url;
		
		// form id 생성...
		int_pos = Length(str_url) - 4;  // .xml 제거 
		str_formid = g_ScreenNo + left(str_url, int_pos) + "_" + g_WinCnt;
		
		ArgStr += " arg_FormId=" + quote(str_formid);
				
		// 폼 Open ..	
		//if( global.AllWindows.ChildFormCount <= 10 )
		//{
			//NewWindow(str_url, "app_main::work_form.xml", ArgStr, 650, 604, "OpenStyle=Normal,Instance=Single", 0, 0);
			NewWindow(str_formid, "app_main::work_form.xml", ArgStr, 1024, 738, "OpenStyle=Normal TitleBar=false", 0, 0);
		//} else
		//{
		//	alert("작업 화면이 10개로 제한 되어있습니다.");
		//}
	}
}


// 프로그램 종료
function Exit_App()
{
	Exit();
}

// 화면 리사이즈 막음 ..
function Main_OnSize(obj,strType,cx,cy)
{	
/*
	if( strType == "Maximize")
	{
		/// ...
		//Global.Window.OpenStyle = "Restore";
		global.AppStatus = "Normal"; //"Min"/"Max"/"Normal" 
		return false;
	}
*/	
	//trace("strType : " + strType);
}


// Open 메뉴 리스트 추가
function g_OpenMenuAdd( str_prefix, str_url, str_title )
{
	var result, MacCnt;
	var nRow, nCnt;
	
	nRow = gds_OpenMenu.FindRow("page_url", str_url);
	if( nRow >= 0 )
	{
		// 현재 위치 설정
		//Global.Doc_top.cmbOpenMenu.index = nRow;
		
		nCnt = gds_OpenMenu.GetColumn(nRow,"page_cnt" );
		
		gds_OpenMenu.SetColumn(nRow,"page_cnt", nCnt + 1 );
		
	} else
	{
		nRow = gds_OpenMenu.AddRow();
		gds_OpenMenu.SetColumn(nRow,"page_nm", str_title );
		gds_OpenMenu.SetColumn(nRow,"page_prefix", str_prefix );
		gds_OpenMenu.SetColumn(nRow,"page_url", str_url );
		gds_OpenMenu.SetColumn(nRow,"page_cnt", 1 );
		
		// 현재 위치 설정
		//Global.Doc_top.div_openform.stcCnt.Text = "( " + (nRow + 1) + " 개 )";
		//Global.Doc_top.div_openform.cmbOpenMenu.index = nRow;
	}
}

// Open 메뉴 리스트 삭제
function g_OpenMenuDel( str_url )
{
	var nRow;
	
	nRow = gds_OpenMenu.FindRow("page_url", str_url);
	if( nRow >= 0 )
	{
		gds_OpenMenu.DeleteRow(nRow);
		
		nRow = gds_OpenMenu.rowcount;
		//if( nRow > 0 )
		//	Global.Doc_top.div_openform.stcCnt.Text = "( " + (nRow) + " 개 )";
		//else
		//	Global.Doc_top.div_openform.stcCnt.Text = "";
			
		//Global.Doc_top.div_openform.cmbOpenMenu.index = (nRow -1);
	}
}


function g_OpenChildWindowOffLine(str_prefix, str_url, str_title, off_isu_cd)
{	
	if ((str_prefix != null) && (str_url != null)) 
	{	
		var ArgStr = "";
		ArgStr  = "arg_Prefix=" + quote(str_prefix);
		ArgStr += " arg_Url=" + quote(str_url);
		ArgStr += " arg_Title=" + quote(str_title);
		ArgStr += " off_isu_cd=" + quote(off_isu_cd);
		
		g_OpenUrl = str_prefix + "::" + str_url;
		
		// form id 생성...
		int_pos = Length(str_url) - 4;  // .xml 제거 
		str_formid = g_ScreenNo + left(str_url, int_pos) + "_" + g_WinCnt;

		ArgStr += " arg_FormId=" + quote(str_formid);

		// 폼 Open ..	
		//if( global.AllWindows.ChildFormCount <= 10 )
		//{
			NewWindow(str_formid, "app_main::work_form.xml", ArgStr, 1024, 738, "OpenStyle=Normal TitleBar=false", 0, 0);
		//} else
		//{
		//	alert("작업 화면이 10개로 제한 되어있습니다.");
		//}
	}
}
