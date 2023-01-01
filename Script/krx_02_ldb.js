//New Script File


// SQLiteAdp 생성.
var f_cnt = -1;		
var f_protolObj;
var f_protolID;


var dbFileName 	= ""; // "c:\\KR7048550008.s3db";

function fn_adp_free()
{
	if( f_cnt > -1 )
	{
		g_DsRecv.SetColumn(1,f_protolID,"0");
		trace("프로토콜을 해제 합니다. -> Protocal ID = "+f_protolID);
	}
}

function fn_adp_new()
{
	// 프로토콜 할당 ...
	for ( var i=0; i <= g_DsRecv.ColCount(); i++)
	{
		f_protolID 	= "sqliteadp" + i;
		if( g_DsRecv.GetColumn(1,f_protolID) == 0)
		{
			f_cnt = i;
			f_protolObj = Object(f_protolID);
			g_DsRecv.SetColumn(1,f_protolID,"1");
			break;
		}
	}
	
	if( f_cnt == -1 )
	{
		trace("프로토콜을 할당받지 못했습니다. \n\n화면을 닫습니다.");
		close();
		return -1;
	}else{
		trace("프로토콜이 할당되었습니다. -> Protocal ID = "+f_protolID);
	}
	//st_cur_page.Value = fnCurPage;
	return 0;
}



// DB 파일 제거
function fn_db_drop(arg_file)
{
	// 사용중 체크 제거..
	//if( f_cnt > -1 )
	//{		
		//f_protolObj.DBClose();
		
		//global.LiteLocal.DisconnectDB();
		
		//idle();
		// 기존의 DB 파일 제거
		if( arg_file == "" ) return;
		if( File0.Delete(arg_file) == false )
		{
			trace(arg_file + " : 삭제 실패 ..");
		}
		
		trace(arg_file + " : 삭제 .. ..");
	//}
}


function fn_find_ldb(str_svrid, str_arg, str_url, str_inds, str_outds)
{		

	if( fn_adp_new() == -1 ) return;
	
	DS_ORG_DATA.ClearData();
	
	// 기존의 DB 파일 제거
	fn_db_drop(dbFileName);
	
	dbFileName = "C:\\KRX_02_LDB-"+timem()+".s3db";
	
	DS_ORG_DATA.FireFirstCount = fnPageRow;
	DS_ORG_DATA.FireNextCount  = toInteger(fnPageRow)*10;

	// DB open
	f_protolObj.dbfilename=dbFileName;
	
	f_protolObj.DBOpen();
	f_protolObj.FirstData = fnPageRow;

	// table creation
	
	f_protolObj.CreateTable("DS_ORG_DATA", DS_ORG_DATA);
	f_protolObj.CreateTable("DS_GRID1_DATA", DS_TA300QOT);
	f_protolObj.CreateTable("DS_GRID2_DATA", DS_TA310TR);
	f_protolObj.CreateIndex("DS_ORG_DATA", "G1_SEQ_NO", "QOT_TR_SEQ_NO:A");
	f_protolObj.PrepareTable("DS_ORG_DATA", DS_ORG_DATA);

	
	f_protolObj.CommitCount = fnPageRow;   // 중간 Commit 단위 ..
	
	str_url = f_protolID + "://61.107.23.227/miplatform/jspSrc/krx_poc/" + str_url;

	// sqlite adaptor를 이용한 data 요청
	// 1. 받은 데이터를 local db와 grid에 출력
	// 3. 받은 데이터를 일부 Dataset0으로 갈무리하고 나머지는 local db에 저장
	//http://10.10.2.110/tobe/jspSrc/krx_02_s02_csv.jsp?isucd=KR7000250001&dt=20061120
	Transaction(str_svrid, str_url, str_inds, str_outds, str_arg, "Tr_LDB_Callback");
}


function Tr_LDB_Callback(strSvcID, errorcd, errormsg)
{
	if ( strSvcID == "sim_data" ) fn_adp_free();
	SetWaitCursor(false);
	if ( errorcd <> 0 )
	{	
		alert("Error : \n\n" + errormsg);
		//return;
	}
	
	//st_tot.Text = DS_ORG_DATA.rowcount;
	
	if ( strSvcID == "sim_data" )
	{
		isFirstLoading	= false;
		fnTCount		= ToNumber(g_DsRecv.getColumn(0, f_protolID));
		//st_tot.Text 	= fnTCount;
		
		setTotalPage();
		setCurrentPage();
		//trace("[csvxml]정상적으로 조회 완료 처리되었습니다.");
		
		Tr_Callback(strSvcID, errorcd, errormsg);
		
	}
	else if ( strSvcID == "selectLiteDB_Next" )
	{	
		setCurrentPage();
		//trace("Next - [selectLiteDB]정상적으로 처리되었습니다.");
		Tr_Callback("ldb_data_next", errorcd, errormsg);
	}
	else if ( strSvcID == "selectLiteDB_Pre" )
	{	
		setCurrentPage();
		//trace("Pre - [selectLiteDB]정상적으로 처리되었습니다.");
		Tr_Callback("ldb_data_pre", errorcd, errormsg);
	}
	else if ( strSvcID == "selectLiteDB_Tr_G1" )
	{
		//저장 ...
		//Trace(" ------  Save --------- ");
		
		fnG1Count++;
		//Grid1.Redraw = false;
		Scbar_Grid1.Max = fnG1Count; //toNumber(Scbar_Grid1.Max) + 1;
		Scbar_Grid1.Value = fnG1Count; // Scbar_Grid1.Max;
		
		//trace("fnG1Count : " + fnG1Count );
			
	}else if ( strSvcID == "selectLiteDB_Tr_G2" )
	{
		//저장 ...
		//Trace(" ------  Save --------- ");
		
		fnG2Count++;
		//Grid2.Redraw = false;
		Scbar_Grid2.Max = fnG2Count; //toNumber(Scbar_Grid1.Max) + 1;
		Scbar_Grid2.Value = fnG2Count; // Scbar_Grid1.Max;
		//trace("fnG2Count : " + fnG2Count);
		
	} else if ( strSvcID == "selectLiteDB_G_G1" )
	{
		// 스크롤 바 ...
				
	} else if ( strSvcID == "selectLiteDB_G_G2" )
	{
		// 스크롤 바 ...	
		
	}
}


function DS_ORG_DATA_LD_OnLoadCompleted(obj,nErrorCode,strErrorMsg,nReason)
{
	if (DS_ORG_DATA_LD.rowcount > 50)
	{
		ext_CopyDataset("DS_ORG_DATA", "DS_ORG_DATA_LD", fnPageRow);
		ed_count.Text 	= DS_ORG_DATA_LD.count;
		fnTCount		= DS_ORG_DATA_LD.count;

		//trace("DS_ORG_DATA_LD.rowcount="+DS_ORG_DATA_LD.rowcount);
	}
	if (nReason == 0)
		DS_ORG_DATA_LD.clear();
}


// 전체페이지 설정.........................
function setTotalPage()
{
	if(fnTCount%fnPageRow ==0){
		fnPageCnt = toInteger(toInteger(fnTCount)/toInteger(fnPageRow));
	}else{
		fnPageCnt =  ceil(toInteger(fnTCount)/toInteger(fnPageRow));
	}

	fnCurPage = 1;
	if(fnPageCnt==0) fnPageCnt=1;
}

// 현재페이지 설정.........................
function setCurrentPage()
{
	if(fnCurPage==0){
		fnCurPage=1;
	}
	
	//fnCurPage = toInteger((fnRow+1)/fnPageRow)+1;
	Static0.text = toString(fnCurPage)+"/"+toString(fnPageCnt);
	
}

/******************************************
* LiteDB 조회....
******************************************/
function select_LiteDB(arg_page, arg_svrid)
{

	//orderDirect
	
	var strRow = ( arg_page - 1 ) * fnPageRow;
	
	//f_protolObj.DBClose();
	global.LiteLocal.DisconnectDB();

	LiteLocal.ConnectionString = "Data Source="+dbFileName;
	var vWhereStr = " limit " + strRow + ", "+fnPageRow;

	var srchStr = "arg_gu=" + Quote("S");
	srchStr += " szwhere=" + Quote(" "+vWhereStr);
	
	var outDs 	= "DS_ORG_DATA=output";
	
	//trace("vWhereStr : " + vWhereStr);
	
	//Grid1.Redraw = false;
	//Grid2.Redraw = false;
		

	if( arg_svrid == "next" )
		Transaction("selectLiteDB_Next", "liteDB::select_krx02.xml", "", outDs, srchStr, "Tr_LDB_Callback");
	else
		Transaction("selectLiteDB_Pre", "liteDB::select_krx02.xml", "", outDs, srchStr, "Tr_LDB_Callback");
}

function select_LiteDB_G(arg_GU, nstrRow, arg_mode, arg_seqno)
{

	//orderDirect
	var npageCnt;
	var svrId, outDs, srchStr;
	
	//f_protolObj.DBClose();
	global.LiteLocal.DisconnectDB();
	
	if( arg_GU== "G1" )
	{
		npageCnt = Grid1.PageRowCount;
		outDs 	= "DS_TA300QOT=output";
	} else
	{
		npageCnt = Grid2.PageRowCount;
		outDs 	= "DS_TA310TR=output";
	}
	
	if( arg_mode == "pre" )
	{
		nstrRow = nstrRow - npageCnt;
		if( nstrRow < 0 )
		{
			npageCnt = npageCnt + nstrRow;
			nstrRow = 0;
		}
		if( npageCnt < 0 ) npageCnt = 0;
		
		svrId = "selectLiteDB_G_"+arg_GU;
	} else
	{
		svrId = "selectLiteDB_G";
	}

	LiteLocal.ConnectionString = "Data Source="+dbFileName;
	var vWhereStr = " limit " + (nstrRow) + ", " + npageCnt;

	var srchStr = "arg_gu=" + Quote(arg_GU);
	srchStr += " QOT_TR_SEQ_NO=" + Quote(arg_seqno);
	srchStr += " szwhere=" + Quote(" "+vWhereStr);

	//trace( "srchStr : " + srchStr );
	Transaction(svrId, "liteDB::select_krx02.xml", "", outDs, srchStr, "Tr_LDB_Callback");
}

function Tr_LiteDB_G(arg_gu)
{	
	global.LiteLocal.DisconnectDB();

	LiteLocal.ConnectionString = "Data Source="+dbFileName;

	var svrId, srchStr, inDs = "";
	
	if( arg_gu == "1" )
	{
		srchStr = "arg_gu=" + Quote("G1");
		inDs 	= "ds_data=DS_TA300QOT:u";
		svrId = "selectLiteDB_Tr_G1";
	}
	else
	{
		srchStr = "arg_gu=" + Quote("G2");
		inDs 	= "ds_data=DS_TA310TR:u";
		svrId = "selectLiteDB_Tr_G2";
	}
	
	Transaction(svrId, "liteDB::tr_krx02.xml", inDs, "", srchStr, "Tr_LDB_Callback");
}


