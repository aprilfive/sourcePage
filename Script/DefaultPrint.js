﻿/****************************************************************
* 펑션 : gfn_Print(obj)
* 기능 : 화면 출력미리보기
* 인수 : obj : form id
* 리턴 : 
* 예제 : 
* 
* 작성자 : 이명남
* 작성일 : 2007-09-10
****************************************************************/

var gv_printPagePerGap = 0;
var gv_pageHeight = 1070;

var gv_tmpPageHeight = 0;
var gv_nCurTop;
var gv_nCurLeft;

var gv_InitFlag = false;
var gv_tmpFile = "";
var gv_formObj;
var gv_strImgFolder = "";

var ArraytmpDS;
var ArrayCompositeCtl;


var gv_init_flag = false;

function gfn_Print(obj)
{
	if ( !gv_init_flag )
	{ 
		Create("Dataset","tmpDS_ScreenInfo");	
		Create("Dataset","tmpDS_ScreenInfo_0");	
		Create("Dataset","tmpDS_ScreenInfo_1");	
		Create("Dataset","tmpDS_ScreenInfo_2");	
		
		var strContents;
		
		strContents  = '\n<Contents>';
		strContents += '\n	<colinfo id="ParentObj" size="256" type="STRING"/>';
		strContents += '\n	<colinfo id="Obj" size="256" type="STRING"/>';
		strContents += '\n	<colinfo id="left" size="256" type="INT"/>';
		strContents += '\n	<colinfo id="Top" size="256" type="INT"/>';
		strContents += '\n	<colinfo id="width" size="256" type="INT"/>';
		strContents += '\n	<colinfo id="orgHeight" size="256" type="INT"/>';
		strContents += '\n	<colinfo id="orgleft" size="256" type="INT"/>';
		strContents += '\n	<colinfo id="orgTop" size="256" type="INT"/>';
		strContents += '\n	<colinfo id="orgwidth" size="256" type="INT"/>';
		strContents += '\n	<colinfo id="Height" size="256" type="INT"/>';
		strContents += '\n	<colinfo id="ObjType" size="256" type="STRING"/>';
		strContents += '\n	<colinfo id="Depth" size="256" type="INT"/>';
		strContents += '\n	<colinfo id="Composite" size="256" type="STRING"/>';
		strContents += '\n	<colinfo id="Value" size="256" type="STRING"/>';
		strContents += '\n</Contents>	';
		
		tmpDS_ScreenInfo.Contents = strContents;
		tmpDS_ScreenInfo_0.Contents = strContents;
		tmpDS_ScreenInfo_1.Contents = strContents;
		tmpDS_ScreenInfo_2.Contents = strContents;
		gv_init_flag = true;
	}
	
	tmpDS_ScreenInfo.ClearData();
	tmpDS_ScreenInfo_0.ClearData();
	tmpDS_ScreenInfo_1.ClearData();
	tmpDS_ScreenInfo_2.ClearData();
	
	//----------------------------------------
	gv_printPagePerGap = 0;
	gfn_PrintFirst();
	gfn_PrintReset(tmpDS_ScreenInfo);
	gfn_PrintSend(tmpDS_ScreenInfo, obj);
	
}

// 화면 존재하는 Component들을 Dataset에 등록함...
function gfn_PrintFirst()
{
	
	var objDs1 = tmpDS_ScreenInfo;
	var nDepth = 0;
	var nRow;
	var nCompositeCnt = 0;
	var objDstmp;
	
	var objComp;
	
	for ( var i = 0 ; i < this.Components.Count ; i++ )
	{
			if (  ( this.Components[i].GetType() == "Dataset" ) 
				 || ( this.Components[i].GetType() == "File" ) 
				 ||	( this.Components[i].GetType() == "FileDialog" ) 
				 ||	( this.Components[i].GetType() == "PopupDiv" )  
				// || ( this.Components[i].id == "divTip" ) 
				// || ( this.Components[i].id == "div_tmpPrint" )
			   )	
				continue;
				
			if ( this.Components[i].Visible == false ) 
				continue;

				
			nRow = objDs1.AddRow();
			objDs1.SetColumn(nRow,"Depth",nDepth);
			objDs1.SetColumn(nRow,"ParentObj",this.id);
			objDs1.SetColumn(nRow,"Obj",this.Components[i].id);
			objDs1.SetColumn(nRow,"left",this.Components[i].left);
			objDs1.SetColumn(nRow,"Top",this.Components[i].Top);
			objDs1.SetColumn(nRow,"width",this.Components[i].Width);
			objDs1.SetColumn(nRow,"height",this.Components[i].Height);
			objDs1.SetColumn(nRow,"orgleft",this.Components[i].left);
			objDs1.SetColumn(nRow,"orgTop",this.Components[i].Top);
			objDs1.SetColumn(nRow,"orgwidth",this.Components[i].Width);
			objDs1.SetColumn(nRow,"orgheight",this.Components[i].Height);
			objDs1.SetColumn(nRow,"ObjType",tolower(this.Components[i].GetType()));
			if ( this.Components[i].GetType() == "Static" )
				objDs1.SetColumn(nRow,"value",tolower(this.Components[i].Value));

			// division,tab등
			if(this.Components[i].IsComposite())
			{
				if( this.Components[i].GetType() == "Tab" )
				{
					objComp = this.Components[i].GetItem(this.Components[i].TabIndex);
				}
				else 
				{
					objComp = this.Components[i];
				}
				
			    
				nCompositeCnt++;
				fv_Depth = 0;
				fv_objid = "";
				objDs1.SetColumn(nRow,"Composite",nCompositeCnt);
				objDstmp = tmpDS_ScreenInfo_0;
				gfn_SearchComponent(objDstmp,objComp,nCompositeCnt,this.Components[i].left,this.Components[i].top);
				
			}

	}

}

/*--------------------------------------------------------------------------*/
//	조회시 composite component 처리
/*--------------------------------------------------------------------------*/
var fv_Depth;
var fv_objid;
var fv_frist;
function gfn_SearchComponent(objDs,obj,nCompositeCnt,nLeft,nTop)
{
	//tmpDS_ScreenInfo.FireEvent = false;
	fv_Depth++;
	var nRow;
	var objComp;
	var objDstmp;
	
	if ( obj.GetType() == "TabPage" )
		fv_objid += obj.parent.id + "." + obj.id + ".";
	else
		fv_objid += obj.id + ".";
	
	for ( var i = 0 ; i < obj.Components.Count ; i++ )
	{
			if (  ( obj.Components[i].GetType() == "Dataset" ) ||
				  ( obj.Components[i].GetType() == "File" ) ||	
				  ( obj.Components[i].GetType() == "FileDialog" ) ||	
				  ( obj.Components[i].GetType() == "PopupDiv" ) 
			   )	
				continue;
							
			if ( obj.Components[i].Visible == false )
				continue;

				
			nRow = objDs.AddRow();
			objDs.SetColumn(nRow,"Depth",fv_Depth);
			if ( obj.GetType() == "TabPage" )
				objDs.SetColumn(nRow,"ParentObj",obj.parent.id);
			else
				objDs.SetColumn(nRow,"ParentObj",obj.id);
			objDs.SetColumn(nRow,"Obj",fv_objid + obj.Components[i].id);
			objDs.SetColumn(nRow,"left",obj.Components[i].left);
			objDs.SetColumn(nRow,"Top",obj.Components[i].Top);
			objDs.SetColumn(nRow,"width",obj.Components[i].Width);
			objDs.SetColumn(nRow,"height",obj.Components[i].Height);
			objDs.SetColumn(nRow,"orgleft",obj.Components[i].left);
			objDs.SetColumn(nRow,"orgTop",obj.Components[i].Top);
			objDs.SetColumn(nRow,"orgwidth",obj.Components[i].Width);
			objDs.SetColumn(nRow,"orgheight",obj.Components[i].Height);
			objDs.SetColumn(nRow,"ObjType",tolower(obj.Components[i].GetType()));
			objDs.SetColumn(nRow,"Composite",nCompositeCnt);
			if ( obj.Components[i].GetType() == "Static" )
				objDs.SetColumn(nRow,"value",tolower(obj.Components[i].Value));			
			// division,tab등
			if(obj.Components[i].IsComposite())
			{
				if( obj.Components[i].GetType() == "Tab" )
				{
					objComp = obj.Components[i].GetItem(obj.Components[i].TabIndex);
				}
				else 
				{
					objComp = obj.Components[i];
				}
				objDstmp = object("tmpDS_ScreenInfo_" + fv_Depth);
				gfn_SearchComponent(objDstmp,objComp,nCompositeCnt,obj.Components[i].left + nLeft,obj.Components[i].Top + nTop);
			}

	}
	
}

// Grid Border Pixcel 값을 얻는 함수
function gfn_getBorderPixcel(Obj)
{
	switch(obj.Border)
	{
		case "Flat" :
				return 2;
		case "Default" :
				return 4;
		default :
				return 4;
	}
}

// Grid Band 별 Row 정보 얻는 함수
function gfn_getGridRowInfo(GrdObj,strBand)
{
	if ( GrdObj.GetCellCount(strBand) == 0 ) return 0;

	var nMaxRow = 0;
	var nTmpVal;
	for ( var i = 0 ; i < GrdObj.GetCellCount(strBand) ; i++ )
	{
		nTmpVal = toInteger(GrdObj.GetCellProp(strBand,i,"row"));
		if ( nMaxRow < nTmpVal )
			nMaxRow = nTmpVal;
	}
	
	
	return nMaxRow + 1;
}

// Grid Scroll 되는 영역을 Width 정보 얻는 함수
function gfn_getGridColInfo(GrdObj)
{
	var nMaxW = 0;
	for ( var i = 0 ; i < GrdObj.GetColCount() ; i++ )
	{
		nMaxW += toInteger(GrdObj.GetColProp(i,"Width"));
	}
	
	return nMaxW;
}



// Component 위치 정보를 Scroll 영역까지 고려하여 계산함.
function gfn_PrintReset(objDs1)
{
	var objDs2;
	objDs1.Sort("Top:A,Left:A");

	var nBorderPixcel;
	var CurObj;
	var DsObj;
	
	var tmpH;
	var tmpW;
	var nGapH = 0;
	var npriorGapH = 0;
		
	var nGapW = 0;
	
	var nCurLeft;
	var nCurRight;
	var nCurTop = -1;
	var nCurHeight;
	
	var nOrgLeft;
	var nOrgRight;
	var nOrgTop = -1;
	var nOrgHeight;
	

	var nTmpLeft;
	var nTmpRight;
	var nTmpTop;
	var nTmpHeight;
	
	var nSvComposite = 0;
	var strSvComposite;
	
	var nMinVal,nMaxVal;
	var nCompositeCnt = 0;
	var strRtn;
	var arrRtn = array();
	var nCaseSumCnt = 0;
	var nSvLeft = 5000;


	var nCurPosBottom;
	
	
   for ( var i = 0 ; i < objDs1.rowcount ; i++ )
   {

		if(toNumber(objDs1.GetColumn(i,"Left")) < nSvLeft)
		{
			nGapW = 0;
			nSvLeft = toNumber(objDs1.GetColumn(i,"Left"));
		}
		
		
		if ( nGapH > 0 )
		{
		
			nTmpLeft =  objDs1.GetColumn(i,"Left");
			nTmpRight = objDs1.GetColumn(i,"Left") + objDs1.GetColumn(i,"Width"); 

			nTmpTop = objDs1.GetColumn(i,"Top");
			nTmpHeight = objDs1.GetColumn(i,"Height");
			
			if ( nCurPosBottom <= (objDs1.GetColumn(i,"orgTop") + objDs1.GetColumn(i,"orgHeight")) )
			{			
				objDs1.SetColumn(i,"Top",toNumber(objDs1.GetColumn(i,"Top")) + nGapH);
			}
			else
				objDs1.SetColumn(i,"Top",toNumber(objDs1.GetColumn(i,"Top")) + npriorGapH);
	

		} else {
			if ( objDs1.GetColumn(i,"ObjType") != "grid" )
			{
				nCurTop = objDs1.GetColumn(i,"Top");
				nCurRight = objDs1.GetColumn(i,"Left") + objDs1.GetColumn(i,"Width");
				nCurHeight = objDs1.GetColumn(i,"Height");
				nCurLeft = objDs1.GetColumn(i,"Left");
			}
		}

		if ( ( objDs1.GetColumn(i,"ObjType") == "tab" ) ||
		     ( objDs1.GetColumn(i,"ObjType") == "div" ) )
		{
			objDs2 = object("tmpDS_ScreenInfo_" + objDs1.GetColumn(i,"Depth"));
			objDs2.Filter("ParentObj==" + quote(object(objDs1.GetColumn(i,"Obj")).id));
				
			if(objDs2.RowCount() > 0)
			{
				tmpH = gfn_PrintReset(objDs2);
				//trace("11111111111--->" + tmpH);
				if ( objDs1.GetColumn(i,"ObjType") == "tab" )
					tmpH += 27;
				
				// Div/Tab는 여유 Height 조정함.
				tmpH += 4;
				if ( tmpH > objDs1.GetColumn(i,"Height") )
				{
					
					npriorGapH = nGapH;
					if ( objDs1.getcolumn(i,"Obj") == "divTip" ) contiune;
					nGapH += tmpH - toNumber(objDs1.GetColumn(i,"Height"));
					//nGapH += objDs1.GetColumn(i,"Top") + tmpH;
					objDs1.SetColumn(i,"Height",tmpH);
					
				}
				if ( tmpW > toNumber(objDs1.GetColumn(i,"width")) )
				{
					//nGapW += tmpW - tmpDS_ScreenInfo.GetColumn(i,"width");
					//nGapW += tmpDS_ScreenInfo.GetColumn(i,"Left") + tmpW;
					
					//tmpDS_ScreenInfo.SetColumn(i,"width",tmpW);
					
				}
				
				nCurPosBottom = objDs1.GetColumn(i,"orgTop") + objDs1.GetColumn(i,"orgHeight");

				nCurTop = objDs1.GetColumn(i,"Top");
				nCurRight = objDs1.GetColumn(i,"Left") + objDs1.GetColumn(i,"Width");
				nCurHeight = objDs1.GetColumn(i,"Height");
				nCurLeft = objDs1.GetColumn(i,"Left");
			}
		}
		else if ( objDs1.GetColumn(i,"ObjType") == "grid" )
		{
			nOrgTop = objDs1.GetColumn(i,"Top");
			nOrgRight = objDs1.GetColumn(i,"Left") + objDs1.GetColumn(i,"Width");
			nOrgHeight = objDs1.GetColumn(i,"Height");
			nOrgLeft = objDs1.GetColumn(i,"Left");
			
			nCurPosBottom = objDs1.GetColumn(i,"orgTop") + objDs1.GetColumn(i,"orgHeight");
			CurObj = object(objDs1.GetColumn(i,"Obj"));
			nBorderPixcel = gfn_getBorderPixcel(CurObj);
			if ( objDs1.GetColumn(i,"Depth") > 0 )
			{
				var Pobj = CurObj.GetForm();
				DsObj = Pobj.Object(CurObj.bindDataset);
			}
			else
			{
				DsObj = Object(CurObj.bindDataset);
			}	
			if ( DsObj != null )
			{
				tmpH = ( CurObj.HeadHeight * gfn_getGridRowInfo(CurObj,"Head") ) 
					 + ( CurObj.RowHeight  * ( gfn_getGridRowInfo(CurObj,"Body")  * DsObj.rowcount ) )
					 + ( CurObj.HeadHeight  * gfn_getGridRowInfo(CurObj,"Summary") ) + nBorderPixcel;
				tmpW = 	gfn_getGridColInfo(CurObj) + nBorderPixcel;

				if ( tmpH > objDs1.GetColumn(i,"Height") )
				{
					
					npriorGapH = nGapH;
					nGapH += tmpH - toNumber(objDs1.GetColumn(i,"Height"));
					//nGapH += objDs1.GetColumn(i,"Top") + tmpH;
					objDs1.SetColumn(i,"Height",tmpH);
					
				}
				if ( tmpW > toNumber(objDs1.GetColumn(i,"width")) )
				{
					//nGapW += tmpW - tmpDS_ScreenInfo.GetColumn(i,"width");
					//nGapW += tmpDS_ScreenInfo.GetColumn(i,"Left") + tmpW;
					
					//tmpDS_ScreenInfo.SetColumn(i,"width",tmpW);
					
				}
				
				nCurTop = objDs1.GetColumn(i,"Top");
				nCurRight = objDs1.GetColumn(i,"Left") + objDs1.GetColumn(i,"Width");
				nCurHeight = objDs1.GetColumn(i,"Height");
				nCurLeft = objDs1.GetColumn(i,"Left");
			}
		}
   }
   
   return objDs1.GetColumn((objDs1.rowcount - 1),"Height") + objDs1.GetColumn((objDs1.rowcount - 1),"Top");
}


function gfn_PrintSend(objDs1, obj)
{
    createHtml(objDs1,obj);
}

// Html 화면 로드가 완료되면 출력 미리보기 인 EXTAPI 모듈에 존재하는 MiPrint 호출 
function gfn_MSIE0_DocumentComplete(obj,pDisp,URL)
{
	//gv_formObj.tmpPrint.ExecWB(7);
	MiPrint(gv_formObj.tmpPrint);
	gv_formObj.tmpFile.Delete();
}

// MiPlatform 화면 를 html로 변환하는 작업 시작
function createHtml(objDs1,comp){

	//gv_strImgFolder = GetStartXmlPath() + "img/";	//이미지폴더
	gv_strImgFolder = GetStartXmlPath() + "../../images/tobesoft/";	//이미지폴더
	gv_formObj = comp;
	gv_nCurTop = 0;
	gv_nCurLeft = 0;
	if ( !gv_InitFlag )
	{
		//MSIE
		Create("AxMSIE","tmpPrint","left=\"-200\" top=\"0\" width=\"100\" height=\"100\" ");
		tmpPrint.DocumentComplete = "gfn_MSIE0_DocumentComplete";
		Create("file","tmpFile");
		gv_tmpFile = G_GetUsrPath(tmpFile);
		gv_tmpFile = gv_tmpFile + "prt.html";
		gv_InitFlag = true;
	}
	
	var comp1 = "";
	var strHtml = "";
	var tmpobjDs;
	
	strHtml = "<html><head><title>" + comp.title + "</title>" + chr(10);
	
	strHtml += "<META http-equiv=Content-type content=\"text/html; charset=euc-kr\">" + chr(10);
	strHtml += "<style>table.PageBreak { page-break-after : always }</style>" + chr(10);
	strHtml += "<SCRIPT LANGUAGE=\"JavaScript\">" + chr(10);
	strHtml += "	function Init()" + chr(10);
	strHtml += "	{" + chr(10);
	strHtml += "		document.marginInfo = new Object();" + chr(10);
	//strHtml += "		document.marginInfo.top = " + gv_topMargin + ";" + chr(10);
	strHtml += "	}" + chr(10);
	strHtml += "</SCRIPT>" + chr(10);
	
	strHtml += "</head>" + chr(10);
	strHtml += "<body style='zoom:95%;' onload=\"Init()\">" + chr(10);
	
	
	for ( var i = 0; i < objDs1.rowcount; i++ ) {
		
		comp1 = object(objDs1.GetColumn(i,"Obj"));
		
		if (tolower(comp1.getType()) = "grid"){	//grid 생성 
			strHtml = strHtml + createGrid(comp, comp1, objDs1, i);
		}else if (tolower(comp1.getType()) = "edit"){	//edit 생성		
			strHtml = strHtml + createEdit(comp1, objDs1, i);
		}else if (tolower(comp1.getType()) = "maskedit"){	//maskedit 생성		
			strHtml = strHtml + createMaskEdit(comp1, objDs1, i);
		}else if (tolower(comp1.getType()) = "button"){	//button 생성
			strHtml = strHtml + createButton(comp1, objDs1, i);
		}else if (tolower(comp1.getType()) = "combo"){	//combo 생성
			strHtml = strHtml + createCombo(comp, comp1, objDs1, i);
		}else if (tolower(comp1.getType()) = "list"){	//list 생성
			strHtml = strHtml + createList(comp, comp1, objDs1, i);
		}else if (tolower(comp1.getType()) = "radio"){	//radio 생성
			strHtml = strHtml + createRadio(comp, comp1, objDs1, i);
		}else if (tolower(comp1.getType()) = "static"){	//static 생성
			strHtml = strHtml + createStatic(comp1, objDs1, i);
		}else if (tolower(comp1.getType()) = "calendar"){	//calendar 생성	
			strHtml = strHtml + createCalendar(comp1, objDs1, i);
		}else if (tolower(comp1.getType()) = "checkbox"){	//checkbox 생성		
			strHtml = strHtml + createCheckbox(comp1, objDs1, i);
		}else if (tolower(comp1.getType()) = "textarea"){	//textarea 생성
			strHtml = strHtml + createTextarea(comp1, objDs1, i);
		}else if (tolower(comp1.getType()) = "image"){	//image 생성
			strHtml = strHtml + createImage(comp1, objDs1, i);
		}else if (tolower(comp1.getType()) = "tab"){	//tab 생성
			tmpobjDs = object("tmpDS_ScreenInfo_" + objDs1.GetColumn(i,"Depth"));
			tmpobjDs.Filter("ParentObj==" + quote(comp1.id));
			strHtml = strHtml + createTab(comp1,objDs1,tmpobjDs, i);			
		}else if (tolower(comp1.getType()) = "div"){	//div 생성
			tmpobjDs = object("tmpDS_ScreenInfo_" + objDs1.GetColumn(i,"Depth"));
			tmpobjDs.Filter("ParentObj==" + quote(comp1.id));
			strHtml = strHtml + createDiv(comp1,objDs1,tmpobjDs, i);	
		}
	}
	
	strHtml = strHtml + "</body></html>";
	tmpFile.fileName = gv_tmpFile;
	if ( tmpFile.open("wt") )
	{
		tmpFile.write(strHtml);
		tmpFile.close();
		tmpPrint.Navigate(gv_tmpFile);
	}
}

function filelog(str)
{
Create("file","tmpFile");
	tmpFile.fileName = "c:\\aa.log";
	if ( tmpFile.open("at") )
	{
		tmpFile.write(str + "\r\n");
		tmpFile.close();
	}
}

var GridHeight = 0;;
var GridTop = 0;

// 출력시 Page가 넘어가는 것 Check하는 함수
function gfn_PageSkipCheck(nTop,nHeight)
{
	var nStepH = (nTop + nHeight);
	var nRemainVal = gv_pageHeight - (nStepH % gv_pageHeight);

	if ( nHeight > nRemainVal )
	{
		gv_printPagePerGap += nRemainVal;
		//trace(gv_pageHeight + "///" + nTop + "///" + nHeight + "///" + nRemainVal);
		return nRemainVal;
	}	
	else
		return -1;
}

function createGrid(obj, comp, objDs1, nRow){

	var strHtml;
	//gfn_PageSkipCheck(nTop,nHeight)

	var nCurTop = gv_nCurTop + objDs1.GetColumn(nRow,"Top") + gv_printPagePerGap;
	
	var colWidth = 0;
	
	if (comp.visible == true) {		
	
		var tmpHeadstr = "";
		var nH = objDs1.GetColumn(nRow,"Height");
		var ntmpTop = gv_nCurTop + objDs1.GetColumn(nRow,"Top") + gv_printPagePerGap;
		var StrBorder = "1";	
		if (tolower(comp.border) <> "default" && tolower(comp.border) <> "none") StrBorder = "1"; else StrBorder = 0;
		
//		strHtml = strHtml + "<table id=\"tmpGrid\" border=1 cellspacing=0 cellpadding=0 width=" + comp.width + " style='table-layout:auto;border-collapse:collapse;color:" + decode(ToColorName(comp.color),"default","black",ToColorName(comp.color)) + ";background-color:" + decode(ToColorName(comp.bkcolor),"default","white",ToColorName(comp.bkcolor)) + ";border:" + StrBorder + "px solid " + decode(ToColorName(comp.linecolor),"default","black",ToColorName(comp.linecolor)) + ";'>" + chr(10);
    
		var objDs = obj.object(comp.binddataset);
		var WGap;
		for(var i=0; i < comp.getcellcount("head"); i++){	//Grid header 생성

			var varCol = 0;
			
			for(var j=0; j < comp.getcellcount("head"); j++){	
			
				if(comp.GetCellProp("head",j,"row") == i) {
				
					if(varCol <> comp.GetCellProp("head",j,"row") ){
						strHtml = strHtml + "</tr>" + chr(10);
						tmpHeadstr +=  "</tr>" + chr(10);
						nCurTop += comp.headheight;
						//trace("11Head-->" + nCurTop);
					}			
					if(j == 0 || varCol <> comp.GetCellProp("head",j,"row") ){
						strHtml = strHtml + "<tr height=" + comp.headheight + ">" + chr(10);
						tmpHeadstr +=  "<tr height=0 >" + chr(10);
					}	
					
					var strAlign = comp.GetCellProp("head",j,"align"); 	
					if (strAlign = "default") strAlign = "center"; 		
					var strColspan = comp.GetCellProp("head",j,"colspan"); 	
					var strRowspan = comp.GetCellProp("head",j,"rowspan");
					var strWidth = comp.GetColProp(comp.GetCellProp("head",j,"col"),"Width");
					var strcellText = comp.getcelltext("head",i,j);
					
					if (strWidth == 0 || strWidth == "")  strcellText = "";
					if (strColspan <> 1 ) strWidth = "";

					if (strcellText <> ""){
						colWidth += toNumber(strWidth);
 						if ( j == ( comp.getcellcount("head") - 1 ) )
 						{
 							WGap = toNumber(comp.width) - colWidth;
 							if ( WGap > 0 )
 							{
 								strWidth = toNumber(strWidth) + WGap;
 							}
 						}
						if(comp.GetCellProp("head",j,"display") == "checkbox"){
							var StrChk = "";
							var strCheckbox = "";
							if (comp.getcelltext("head",i,j) <> "0") StrChk = "checked";
							strAlign = "center";
							strCheckbox = "<input type=checkbox style='text-align:center;' value='" + comp.getcelltext("head",i,j) + "' " + StrChk + ">" + chr(10);
							
							strHtml = strHtml + "<td align=" + strAlign + " colspan=" + strColspan + " rowspan=" + strRowspan + " style='width:" + strWidth + ";color:" + ToColorName(comp.color) + ";background-color:" + ToColorName(comp.GetCellProp("head",j,"BkColor")) + ";border-collapse:collapse;border:" + StrBorder + "px solid " + ToColorName(comp.bordercolor) + ";font-size:" + comp.displayfontsize + "pt;font-family:" + comp.displayfontname + ";'>" + strCheckbox + "</td>" + chr(10);
						}else {
							strHtml = strHtml + "<td align=" + strAlign + " colspan=" + strColspan + " rowspan=" + strRowspan + " style='width:" + strWidth + ";color:" + ToColorName(comp.color) + ";background-color:" + ToColorName(comp.GetCellProp("head",j,"BkColor")) + ";border-collapse:collapse;border:" + StrBorder + "px solid " + ToColorName(comp.bordercolor) + ";font-size:" + comp.displayfontsize + "pt;font-family:" + comp.displayfontname + ";'>" + strcellText + "</td>" + chr(10);
						}
						tmpHeadstr += "<td align=" + strAlign + " colspan=" + strColspan + " rowspan=" + strRowspan + " style='width:" + strWidth + ";color:" + ToColorName(comp.color) + ";background-color:" + ToColorName(comp.GetCellProp("head",j,"BkColor")) + ";border-collapse:collapse;border:0px solid " + ToColorName(comp.bordercolor) + ";'></td>" + chr(10);
					}

					if(j == comp.getcellcount("head") -1){
						strHtml = strHtml + "</tr>" + chr(10);
						tmpHeadstr +=  "</tr>" + chr(10);
						nCurTop += comp.headheight;
						//trace("22Head-->" + nCurTop);
					}
					varCol = comp.GetCellProp("head",j,"row");
				}	
				
			}
			
		}
		
		var flag = false;
		for(var i=0; i < objDs.count(); i++){		//Grid body 생성

			var varCol = 0;
			
			for(var k=0; k < comp.getcellcount("body"); k++){		//Grid body 생성
						
				for(var j=0; j < comp.getcellcount("body"); j++){	
				
					if(comp.GetCellProp("body",j,"row") == k) {		
							
						if(varCol <> comp.GetCellProp("body",j,"row") ){
							strHtml = strHtml + "</tr>" + chr(10);
						}			
						if(j == 0 || varCol <> comp.GetCellProp("body",j,"row") ){
							var nPageGap = gfn_PageSkipCheck(nCurTop,comp.rowheight);
							//trace(nCurTop + "///" + nPageGap + "///" + i);
							if ( nPageGap > 0 )
							{
								//if ( nPageGap == 0 ) nPageGap = 2;
								//nH += nPageGap;
								//if ( i != 0 ) 
								//{
									nCurTop = comp.rowheight;
								//	trace("check///" + i + "///" + nCurTop);
									nH += nPageGap;
									//gv_printPagePerGap += comp.rowheight;
									gv_printPagePerGap += 70;
								//}
								//else
								//{
								//	gv_printPagePerGap++;
								//	nPageGap++;
								//	nH += nPageGap;
								//}
								
								nCurTop += nPageGap;
								strHtml = strHtml + "</table>" + chr(10);
								strHtml = strHtml + "<table class=\"PageBreak\" border=0 cellspacing=0 cellpadding=0 ><tr height=\"1\" ><td></td></tr></table>" + chr(10);
								strHtml = strHtml + "<table id=\"tmpGrid\" border=0 cellspacing=0 cellpadding=0 width=" + comp.width + " style='position:relative;left:" + (comp.left + gv_nCurLeft - 1) + ";top:0;table-layout:auto;border-collapse:collapse;color:" + decode(ToColorName(comp.color),"default","black",ToColorName(comp.color)) + ";background-color:" + decode(ToColorName(comp.bkcolor),"default","white",ToColorName(comp.bkcolor)) + ";border:" + StrBorder + "px solid " + decode(ToColorName(comp.bordercolor),"default","black",ToColorName(comp.bordercolor)) + ";'>" + chr(10);
								strHtml = strHtml + tmpHeadstr;
								strHtml = strHtml + "<tr height=" + comp.rowheight + ">" + chr(10);
								flag = false;
							}
							else
							{
								flag = false;
								strHtml = strHtml + "<tr height=" + comp.rowheight + ">" + chr(10);
							}
							//trace("nnnn///" + i + "///" + nCurTop);
							nCurTop += comp.rowheight;
						}	
						var strAlign = comp.GetCellProp("body",j,"align"); 	
						if (strAlign = "default") strAlign = "center"; 		
						var strColspan = comp.GetCellProp("body",j,"colspan"); 	
						var strRowspan = comp.GetCellProp("body",j,"rowspan");
						var strWidth = comp.GetColProp(comp.GetCellProp("body",j,"col"),"width");
						var strcellText = comp.getcelltext("body",i,j);
						if (strWidth == 0 || strWidth == "")  strcellText = "";
						var strWordWrap = "";
						var strTblFixed = "";
						if (comp.GetCellProp("body",j,"WordWrap") <> 2) strWordWrap = "nowrap"; strTblFixed = "table-layout:auto;";
						
						//trace(comp.GetCellProp("body",j,"WordWrap"));
						//var strFontSize = comp.GetCellProp("body",j,"rowspan");
						if (strcellText <> ""){ 
	 						if ( j == ( comp.getcellcount("body") - 1 ) )
	 						{
	 							if ( WGap > 0 )
	 							{
	 								strWidth = toNumber(strWidth) + WGap;
	 							}
	 						}							
							if(comp.GetCellProp("body",j,"display") == "checkbox"){
								var StrChk = "";
								var strCheckbox = "";
								if (comp.getcelltext("body",i,j) <> "0") StrChk = "checked";
								strAlign = "center";
								strCheckbox = "<input type=checkbox style='text-align:center;' value='" + comp.getcelltext("body",i,j) + "' " + StrChk + ">" + chr(10);
								
								strHtml = strHtml + "<td " + strWordWrap + " align=" + strAlign + " colspan=" + strColspan + " rowspan=" + strRowspan + " style='" + strTblFixed + iif( flag , "width:" + strWidth + ";","") + "color:" + decode(ToColorName(comp.color),"default","black",ToColorName(comp.color)) + ";background-color:" + decode(ToColorName(comp.GetCellProp("body",j,"BkColor")),"default","white",ToColorName(comp.GetCellProp("body",j,"BkColor"))) + ";border-collapse:collapse;border:" + StrBorder + "px solid " + decode(ToColorName(comp.Linecolor),"default","black",ToColorName(comp.Linecolor)) + ";font-size:" + "9" + "pt;font-family:" + comp.displayfontname + ";'>" + strCheckbox + "</td>" + chr(10);
							}else {
								strHtml = strHtml + "<td " + strWordWrap + " align=" + strAlign + " colspan=" + strColspan + " rowspan=" + strRowspan + " style='" + strTblFixed + iif( flag , "width:" + strWidth + ";","")  + "color:" + decode(ToColorName(comp.color),"default","black",ToColorName(comp.color)) + ";background-color:" + decode(ToColorName(comp.GetCellProp("body",j,"BkColor")),"default","white",ToColorName(comp.GetCellProp("body",j,"BkColor"))) + ";border-collapse:collapse;border:" + StrBorder + "px solid " + decode(ToColorName(comp.Linecolor),"default","black",ToColorName(comp.Linecolor)) + ";font-size:" + "9" + "pt;font-family:" + comp.displayfontname + ";'>" + strcellText + "</td>" + chr(10);
							}
						}
						
						if(j == comp.getcellcount("body") -1){
							strHtml = strHtml + "</tr>" + chr(10);							
						}
						varCol = comp.GetCellProp("body",j,"row");
					}	
					
				}	
				
			}	
			
		}	

		for(var i=0; i < 1; i++){	//Grid summ 생성

			var varCol = 0;

			for(var j=0; j < comp.getcellcount("summ"); j++){					
				if(varCol <> comp.GetCellProp("summ",j,"row") ){
					strHtml = strHtml + "</tr>" + chr(10);
				}			
				if(j == 0 || varCol <> comp.GetCellProp("summ",j,"row") ){
					strHtml = strHtml + "<tr height=" + comp.headheight + ">" + chr(10);
					GridSummCount += 1;
				}	
			
				var strAlign = comp.GetCellProp("summ",j,"align"); 	
				if (strAlign = "default") strAlign = "center"; 	
				var strColspan = comp.GetCellProp("summ",j,"colspan"); 	
				var strRowspan = comp.GetCellProp("summ",j,"rowspan");
				var strWidth = comp.GetColProp(comp.GetCellProp("summ",j,"col"),"width");
				var strcellText = comp.getcelltext("summ",i,j);
				if (strWidth == 0 || strWidth == "")  strcellText = "";
				
				if (strcellText <> ""){ 
					strHtml = strHtml + "<td align=" + strAlign + " colspan=" + strColspan + " rowspan=" + strRowspan + " style='width:" + "" + ";color:" + ToColorName(comp.color) + ";background-color:" + ToColorName(comp.GetCellProp("summ",j,"BkColor")) + ";border-collapse:collapse;border:" + StrBorder + "px solid " + ToColorName(comp.bordercolor) + ";font-size:" + comp.displayfontsize + "pt;font-family:" + comp.displayfontname + ";'>" + strcellText + "</td>" + chr(10);
				}
				if(j == comp.getcellcount("summ") -1){
					strHtml = strHtml + "</tr>" + chr(10);
				}
				varCol = comp.GetCellProp("summ",j,"row");
				
			}
			
		}
		
		//var tmpstr = "<div style='border:0px solid;position:absolute;top:" + ntmpTop + ";left:" + (comp.left + gv_nCurLeft) +  "; overflow:none;height:" + nH + "'>" + chr(10);
		var tmpstr = "<table id=\"tmpGrid\" border=1 cellspacing=0 cellpadding=0 width=" + comp.width + " style='position:absolute;top:" + ntmpTop + ";left:" + (comp.left + gv_nCurLeft) +  ";table-layout:auto;border-collapse:collapse;color:" + decode(ToColorName(comp.color),"default","black",ToColorName(comp.color)) + ";background-color:" + decode(ToColorName(comp.bkcolor),"default","white",ToColorName(comp.bkcolor)) + ";border:" + StrBorder + "px solid " + decode(ToColorName(comp.linecolor),"default","black",ToColorName(comp.linecolor)) + ";'>" + chr(10);
		
		//strHtml = tmpstr + strHtml + "</table></div>" + chr(10);
		strHtml = tmpstr + strHtml + "</table>" + chr(10);
	}
			

	return strHtml;
}

function createEdit(comp, objDs1, nRow){
	var strHtml;
	
	var leftMargin = "";
	if (comp.leftMargin <> 0) leftMargin = comp.leftMargin + "px";
	
	if (comp.visible == true) { 
	
		var nTop = gv_nCurTop + objDs1.GetColumn(nRow,"Top") + gv_printPagePerGap;
		var nLeft = gv_nCurLeft + comp.left;
		var strPosition = "position:absolute;";
/***		
		if ( gv_printPagePerGap > 0 )
		{
			strPosition = "position:relative;";
			
			nTop = objDs1.GetColumn(nRow,"orgTop") - (objDs1.GetColumn(nRow - 1,"orgTop") + objDs1.GetColumn(nRow - 1,"orgheight"));
			nLeft = objDs1.GetColumn(nRow,"orgleft") - (objDs1.GetColumn(nRow - 1,"orgleft") + objDs1.GetColumn(nRow - 1,"orgwidth"));			
		}
***/		
		
		var StrBorder = "";		
		if (tolower(comp.border) <> "default" && tolower(comp.border) <> "none") StrBorder = "1"; else StrBorder = 0;

		strHtml = strHtml + "<div style='border:0px;" + strPosition + "top:" + nTop + "; left:" + nLeft +  "; '>" + chr(10);
		strHtml = strHtml + "<table border=0 cellspacing=0 cellpadding=0 height=" + objDs1.GetColumn(nRow,"Height") + "><tr>" + chr(10);
		strHtml = strHtml + "<td valign=" + comp.valign + " style='height:" + objDs1.GetColumn(nRow,"Height") + ";color:" + ToColorName(comp.color) + ";background-color:" + ToColorName(comp.bkcolor) + ";border:" + StrBorder + "px solid " + "black" + "; '>" + chr(10);
		strHtml = strHtml + "<input type=text name=" + comp.id + " value='" + comp.text + "' style='width:" + tonumber(comp.width -2) + ";border:0px;padding-left:" + leftmargin + ";font-size:" + comp.displayfontsize + "pt;font-family:" + comp.displayfontname + ";'>" + chr(10);
		strHtml = strHtml + "</td></tr></table></div>" + chr(10);
	}	
	
	return strHtml;
}

function createMaskEdit(comp, objDs1, nRow){
	var strHtml;
	
	var leftMargin = "";
	if (comp.leftMargin <> 0) leftMargin = comp.leftMargin + "px";
	
	if (comp.visible == true) { 
		var nTop = gv_nCurTop + objDs1.GetColumn(nRow,"Top") + gv_printPagePerGap;
		var nLeft = gv_nCurLeft + comp.left;	
		var strPosition = "position:absolute;";
		
		/***
		if ( gv_printPagePerGap > 0 )
		{
			strPosition = "position:relative;";
			nTop = objDs1.GetColumn(nRow,"orgTop") - (objDs1.GetColumn(nRow - 1,"orgTop") + objDs1.GetColumn(nRow - 1,"orgheight"));
			nLeft = objDs1.GetColumn(nRow,"orgleft") - (objDs1.GetColumn(nRow - 1,"orgleft") + objDs1.GetColumn(nRow - 1,"orgwidth"));			
		}
		***/

		var StrBorder = "";		
		if (tolower(comp.border) <> "default" && tolower(comp.border) <> "none") StrBorder = "1"; else StrBorder = 0;

		strHtml = strHtml + "<div style='border:0px;" + strPosition + "top:" + nTop + "; left:" + nLeft +  "; '>" + chr(10);
		strHtml = strHtml + "<table border=0 cellspacing=0 cellpadding=0 height=" + objDs1.GetColumn(nRow,"Height") + "><tr>" + chr(10);
		strHtml = strHtml + "<td valign=" + comp.valign + " style='width:" + tonumber(comp.width -2) + ";height:" + objDs1.GetColumn(nRow,"Height") + ";color:" + ToColorName(comp.color) + ";background-color:" + ToColorName(comp.bkcolor) + ";border:" + StrBorder + "px solid " + "black" + "; '>" + chr(10);
		strHtml = strHtml + "<input type=text name=" + comp.id + " value='" + comp.text + "' style='border:0px;padding-left:" + leftmargin + ";font-size:" + comp.displayfontsize + "pt;font-family:" + comp.displayfontname + ";'>" + chr(10);
		strHtml = strHtml + "</td></tr></table></div>" + chr(10);
	}	
	
	return strHtml;
}

function createButton(comp, objDs1, nRow){
	var strHtml;
	var leftMargin = "";
	if (comp.leftMargin <> 0) leftMargin = comp.leftMargin + "px";
	var strImg = gv_strImgFolder + comp.ImageId + ".bmp";
	if (comp.visible == true) {	
		var nTop = gv_nCurTop + objDs1.GetColumn(nRow,"Top") + gv_printPagePerGap;
		var nLeft = gv_nCurLeft + comp.left;
		var strPosition = "position:absolute;";

		/***
		if ( gv_printPagePerGap > 0 )
		{
			strPosition = "position:relative;";
			nTop = objDs1.GetColumn(nRow,"orgTop") - (objDs1.GetColumn(nRow - 1,"orgTop") + objDs1.GetColumn(nRow - 1,"orgheight"));
			nLeft = objDs1.GetColumn(nRow,"orgleft") - (objDs1.GetColumn(nRow - 1,"orgleft") + objDs1.GetColumn(nRow - 1,"orgwidth"));			
		}
		***/
							
		strHtml = strHtml + "<div style='" + strPosition + "top:" + nTop + "; left:" + nLeft +  "; border-color:" + ToColorName(comp.bordercolor) + ";' width=" + comp.width + " height=" + objDs1.GetColumn(nRow,"Height") + ">" + chr(10);
		if (comp.ImageId <> "") {
			strHtml = strHtml + "<input type=" + comp.getType() + " name=" + comp.id + " value='" + comp.text + "' style='width:" + comp.width + ";height:" + objDs1.GetColumn(nRow,"Height") + ";background:url(" + strImg + ") no-repeat;vertical-align: " + comp.valign + ";border:0;font-size:" + comp.displayfontsize + "pt;font-family:" + comp.displayfontname + ";'>" + chr(10);
		} else {
			strHtml = strHtml + "<input type=" + comp.getType() + " name=" + comp.id + " value='" + comp.text + "' style='width:" + comp.width + ";height:" + objDs1.GetColumn(nRow,"Height") + ";font-size:" + comp.displayfontsize + "pt;font-family:" + comp.displayfontname + ";'>" + chr(10);		
		}
		strHtml = strHtml + "</div>" + chr(10);
	}	
		
	return strHtml;
}

function createCombo(obj, comp, objDs1, nRow){
	var strHtml;
	
	if (comp.visible == true) {		
		var nTop = gv_nCurTop + objDs1.GetColumn(nRow,"Top") + gv_printPagePerGap;
		var nLeft = gv_nCurLeft + comp.left;
		var strPosition = "position:absolute;";

		/***
		if ( gv_printPagePerGap > 0 )
		{
			strPosition = "position:relative;";
			nTop = objDs1.GetColumn(nRow,"orgTop") - (objDs1.GetColumn(nRow - 1,"orgTop") + objDs1.GetColumn(nRow - 1,"orgheight"));
			nLeft = objDs1.GetColumn(nRow,"orgleft") - (objDs1.GetColumn(nRow - 1,"orgleft") + objDs1.GetColumn(nRow - 1,"orgwidth"));			
		}
		***/
					
		strHtml = strHtml + "<div style='" + strPosition + "top:" + ( nTop ) + "; left:" + nLeft +  "; '>" + chr(10);
		strHtml = strHtml + "<select name=" + comp.id + "' style='width:" + comp.width + "'>" + chr(10);

		/*
		var objDs = obj.object(comp.innerDataSet);
		
		if (objDs.Count() <> 0){					
			for(var i = 0; i < objDs.Count();i++){
				strHtml = strHtml + "<option value='" + objDs.GetColumn(i, comp.CodeColumn) + "'>" + objDs.GetColumn(i, comp.DataColumn) + "</option>" + chr(10);
			}	
		}
		*/
	        strHtml = strHtml + "<option value='" + comp.Text + "'>" + comp.Text + "</option>" + chr(10);
		
		strHtml = strHtml + "</select></div>" + chr(10);
	}				
	
	return strHtml;
}

function createList(obj, comp, objDs1, nRow){
	var strHtml;
	
	if (comp.visible == true) {	
		var nTop = gv_nCurTop + objDs1.GetColumn(nRow,"Top") + gv_printPagePerGap;
		var nLeft = gv_nCurLeft + comp.left;
		var strPosition = "position:absolute;";

		/***
		if ( gv_printPagePerGap > 0 )
		{
			strPosition = "position:relative;";
			nTop = objDs1.GetColumn(nRow,"orgTop") - (objDs1.GetColumn(nRow - 1,"orgTop") + objDs1.GetColumn(nRow - 1,"orgheight"));
			nLeft = objDs1.GetColumn(nRow,"orgleft") - (objDs1.GetColumn(nRow - 1,"orgleft") + objDs1.GetColumn(nRow - 1,"orgwidth"));			
		}
		***/
						
		strHtml = strHtml + "<div style='" + strPosition + "top:" + nTop + "; left:" + nLeft +  "; '>" + chr(10);
		strHtml = strHtml + "<select name=" + comp.id + "' style='width:" + comp.width + ";height:" + objDs1.GetColumn(nRow,"Height") + "' size=2>" + chr(10);

		var objDs = obj.object(comp.innerDataSet);

		if (objDs.Count() <> 0){					
			for(var i = 0; i < objDs.Count();i++){
				strHtml = strHtml + "<option value='" + objDs.GetColumn(i, comp.CodeColumn) + "'>" + objDs.GetColumn(i, comp.DataColumn) + "</option>" + chr(10);
			}	
		}
		strHtml = strHtml + "</select></div>" + chr(10);
	}				

	return strHtml;
}

function createRadio(obj, comp, objDs1, nRow){
	var strHtml;
	
	if (comp.visible == true) {	
		var nTop = gv_nCurTop + objDs1.GetColumn(nRow,"Top") + gv_printPagePerGap;
		var nLeft = gv_nCurLeft + comp.left;
		var strPosition = "position:absolute;";

		/***
		if ( gv_printPagePerGap > 0 )
		{
			strPosition = "position:relative;";
			nTop = objDs1.GetColumn(nRow,"orgTop") - (objDs1.GetColumn(nRow - 1,"orgTop") + objDs1.GetColumn(nRow - 1,"orgheight"));
			nLeft = objDs1.GetColumn(nRow,"orgleft") - (objDs1.GetColumn(nRow - 1,"orgleft") + objDs1.GetColumn(nRow - 1,"orgwidth"));			
		}
		***/
							
		strHtml = strHtml + "<div style='" + strPosition + "top:" + nTop + "; left:" + nLeft +  "; '>" + chr(10);

		var objDs = obj.object(comp.innerDataSet);

		if (objDs.Count() <> 0){					
			for(var i = 0; i < objDs.GetRowCount();i++){
				var StrChecked = "";
				if (comp.value = objDs.GetColumn(i, comp.CodeColumn)) StrChecked = "checked";						
				strHtml = strHtml + "<input type=" + comp.getType() + " value='" + objDs.GetColumn(i, comp.CodeColumn) + "' " + StrChecked + ">" + objDs.GetColumn(i, comp.DataColumn);
			}	
		}
		strHtml = strHtml + "</div>" + chr(10);
	}	

	return strHtml;
}

function createStatic(comp, objDs1, nRow){
	var strHtml;
	if (comp.id == "stTip") return;
	if (comp.visible == true && comp.height > 1) {	
		var nTop = gv_nCurTop + objDs1.GetColumn(nRow,"Top") + gv_printPagePerGap;
		var nLeft = gv_nCurLeft + comp.left;
		var strPosition = "position:absolute;";

		/***
		if ( gv_printPagePerGap > 0 )
		{
			strPosition = "position:relative;";
			nTop = objDs1.GetColumn(nRow,"orgTop") - (objDs1.GetColumn(nRow - 1,"orgTop") + objDs1.GetColumn(nRow - 1,"orgheight"));
			nLeft = objDs1.GetColumn(nRow,"orgleft") - (objDs1.GetColumn(nRow - 1,"orgleft") + objDs1.GetColumn(nRow - 1,"orgwidth"));			
		}
		***/
					
		var StrBorder = "";	
		var StrText = "";
		if (tolower(comp.border) <> "default" && tolower(comp.border) <> "none") StrBorder = "1"; else StrBorder = 0;
		if (length(trim(comp.text)) <> 0) {
			StrText=replace(comp.text,chr(34),'&quot;'); 
		} else {
			StrText ='&nbsp;';
		}
		
		strHtml = strHtml + "<div style='border:0px;" + strPosition + "top:" + nTop + "; left:" + nLeft +  ";width:" + comp.width + ";' height=" + objDs1.GetColumn(nRow,"Height") + ">" + chr(10);
		strHtml = strHtml + "<table border=0 cellspacing=0 cellpadding=0 height=" + objDs1.GetColumn(nRow,"Height") + " style='table-layout:fixed;'><tr>" + chr(10);
		strHtml = strHtml + "<td id=" + comp.id + " valign=" + comp.valign + " style='width:" + comp.width + ";height:" + objDs1.GetColumn(nRow,"Height") + ";text-align:" + comp.align + ";color:" + ToColorName(comp.color) + ";background-color:" + ToColorName(comp.bkcolor) + ";border:" + StrBorder + "px solid " + "black" + "; font-size:" + comp.displayfontsize + "pt;font-family:" + comp.displayfontname + ";vertical-align:" + comp.valign + ";'>" + StrText + chr(10);
		strHtml = strHtml + "</td></tr></table></div>" + chr(10);		

	} else if (comp.visible == true && comp.height = 1) {	
		var StrBorder = "";	
		var StrText ="&nbsp;";
		var nTop = gv_nCurTop + objDs1.GetColumn(nRow,"Top") + gv_printPagePerGap;
		var nLeft = gv_nCurLeft + comp.left;	
		var strPosition = "position:absolute;";

		/***
		if ( gv_printPagePerGap > 0 )
		{
			strPosition = "position:relative;";
			nTop = objDs1.GetColumn(nRow,"orgTop") - (objDs1.GetColumn(nRow - 1,"orgTop") + objDs1.GetColumn(nRow - 1,"orgheight"));
			nLeft = objDs1.GetColumn(nRow,"orgleft") - (objDs1.GetColumn(nRow - 1,"orgleft") + objDs1.GetColumn(nRow - 1,"orgwidth"));			
		}
		***/
		
		if (tolower(comp.border) <> "default" && tolower(comp.border) <> "none") StrBorder = "1"; else StrBorder = 0;
		if (length(comp.text) <> 0) StrText=replace(comp.text,chr(34),"&quot;");
		
		strHtml = strHtml + "<div style='overflow:hidden;border:1px solid;" + strPosition + "top:" + nTop + "; left:" + nLeft +  ";  width:" + comp.width + "; height:" + objDs1.GetColumn(nRow,"Height") + "'>" + chr(10);
		strHtml = strHtml + "</div>" + chr(10);
	}

	return strHtml;
}

function createCalendar(comp, objDs1, nRow){
	var strHtml;
	
	if (comp.visible == true) {
		var nTop = gv_nCurTop + objDs1.GetColumn(nRow,"Top") + gv_printPagePerGap;
		var nLeft = gv_nCurLeft + comp.left;
		var strPosition = "position:absolute;";

		/***
		if ( gv_printPagePerGap > 0 )
		{
			strPosition = "position:relative;";
			nTop = objDs1.GetColumn(nRow,"orgTop") - (objDs1.GetColumn(nRow - 1,"orgTop") + objDs1.GetColumn(nRow - 1,"orgheight"));
			nLeft = objDs1.GetColumn(nRow,"orgleft") - (objDs1.GetColumn(nRow - 1,"orgleft") + objDs1.GetColumn(nRow - 1,"orgwidth"));			
		}
		***/
					
		strHtml = strHtml + "<div style='" + strPosition + "top:" + nTop + "; left:" + nLeft +  "; border-color:" + "" + ";' width=" + comp.width + " height=" + objDs1.GetColumn(nRow,"Height") + ">" + chr(10);
		strHtml = strHtml + "<input type=text name=" + comp.id + " value='" + comp.text + "' style='width:" + comp.width + ";height:" + objDs1.GetColumn(nRow,"Height") + ";border-color:" + "" + ";' readonly>" + chr(10);
		strHtml = strHtml + "</div>" + chr(10);	
	}	

	return strHtml;
}

function createCheckbox(comp, objDs1, nRow){
	var strHtml;
	
	if (comp.visible == true) {
		var StrChk = "";				
		if (comp.value <> "0") StrChk = "checked";
		var nTop = gv_nCurTop + objDs1.GetColumn(nRow,"Top") + gv_printPagePerGap;
		var nLeft = gv_nCurLeft + comp.left;
		var strPosition = "position:absolute;";

		/***
		if ( gv_printPagePerGap > 0 )
		{
			strPosition = "position:relative;";
			nTop = objDs1.GetColumn(nRow,"orgTop") - (objDs1.GetColumn(nRow - 1,"orgTop") + objDs1.GetColumn(nRow - 1,"orgheight"));
			nLeft = objDs1.GetColumn(nRow,"orgleft") - (objDs1.GetColumn(nRow - 1,"orgleft") + objDs1.GetColumn(nRow - 1,"orgwidth"));			
		}
		***/
										
		strHtml = strHtml + "<div style='" + strPosition + "top:" + nTop + "; left:" + nLeft +  "; ' width=" + comp.width + " height=" + objDs1.GetColumn(nRow,"Height") + ">" + chr(10);
		strHtml = strHtml + "<table border=0 cellspacing=0 cellpadding=0 width=" + comp.width + " height=" + objDs1.GetColumn(nRow,"Height") + "><tr>" + chr(10);
		
		if (tolower(comp.align) == "left") {
			strHtml = strHtml + "<td valign=" + comp.valign + " style='text-align:" + comp.textalign + ";color:" + ToColorName(comp.color) + ";background-color:" + ToColorName(comp.bkcolor) + ";border:0;font-size:" + comp.displayfontsize + "pt;font-family:" + comp.displayfontname + ";'>" + comp.text + "</td>" + chr(10);
			strHtml = strHtml + "<td><input type=checkbox name=" + comp.id + " value='" + comp.text + "' " + StrChk + "></td>" + chr(10);
		} else {
			strHtml = strHtml + "<td><input type=checkbox name=" + comp.id + " value='" + comp.text + "' " + StrChk + "></td>" + chr(10);		
			strHtml = strHtml + "<td valign=" + comp.valign + " style='text-align:" + comp.textalign + ";color:" + ToColorName(comp.color) + ";background-color:" + ToColorName(comp.bkcolor) + ";border:0;font-size:" + comp.displayfontsize + "pt;font-family:" + comp.displayfontname + ";'>" + comp.text + "</td>" + chr(10);
		}
		strHtml = strHtml + "</tr></table></div>" + chr(10);	
	}	

	return strHtml;
}

function createTextarea(comp, objDs1, nRow){
	var strHtml;
	
	if (comp.visible == true) {		
		var StrBorder = "";	
		if (tolower(comp.border) <> "default" && tolower(comp.border) <> "none") StrBorder = "1"; else StrBorder = 0;
		var nTop = gv_nCurTop + objDs1.GetColumn(nRow,"Top") + gv_printPagePerGap;
		var nLeft = gv_nCurLeft + comp.left;
		var strPosition = "position:absolute;";

		/***
		if ( gv_printPagePerGap > 0 )
		{
			strPosition = "position:relative;";
			nTop = objDs1.GetColumn(nRow,"orgTop") - (objDs1.GetColumn(nRow - 1,"orgTop") + objDs1.GetColumn(nRow - 1,"orgheight"));
			nLeft = objDs1.GetColumn(nRow,"orgleft") - (objDs1.GetColumn(nRow - 1,"orgleft") + objDs1.GetColumn(nRow - 1,"orgwidth"));			
		}
		***/
				
		strHtml = strHtml + "<div style='border:" + StrBorder + "px solid;" + strPosition + "top:" + nTop + "; left:" + nLeft +  "; ' width=" + comp.width + " height=" + objDs1.GetColumn(nRow,"Height") + ">" + chr(10);
		strHtml = strHtml + "<textarea name=" + comp.id + " style='width:" + comp.width + ";height:" + objDs1.GetColumn(nRow,"Height") + ";text-align:" + comp.align +  ";color:" + ToColorName(comp.color) + ";background-color:" + ToColorName(comp.bkcolor) + ";border-color:" + ToColorName(comp.bordercolor) + ";border:0'>" + comp.text + "</textarea>" + chr(10);
		strHtml = strHtml + "</div>" + chr(10);
	}

	return strHtml;
}

function createImage(comp, objDs1, nRow){
	var strHtml;
	
	var strImg = gv_strImgFolder + comp.ImageId + ".bmp";
	
	if (comp.visible == true) {		
		var nTop = gv_nCurTop + objDs1.GetColumn(nRow,"Top") + gv_printPagePerGap;
		var nLeft = gv_nCurLeft + comp.left;
		var strPosition = "position:absolute;";

		/***
		if ( gv_printPagePerGap > 0 )
		{
			strPosition = "position:relative;";
			nTop = objDs1.GetColumn(nRow,"orgTop") - (objDs1.GetColumn(nRow - 1,"orgTop") + objDs1.GetColumn(nRow - 1,"orgheight"));
			nLeft = objDs1.GetColumn(nRow,"orgleft") - (objDs1.GetColumn(nRow - 1,"orgleft") + objDs1.GetColumn(nRow - 1,"orgwidth"));			
		}
		***/
					
		strHtml = strHtml + "<div style='" + strPosition + "top:" + nTop + "; left:" + nLeft +  "; ' width=" + comp.width + " height=" + objDs1.GetColumn(nRow,"Height") + ">" + chr(10);
		strHtml = strHtml + "<img src='" + strImg + "' style='border:0;vertical-align: top;'>" + chr(10);
		strHtml = strHtml + "</div>" + chr(10);
	}
	
	return strHtml;
}

function createTab(comp,PobjDs,objDs1, nRow){

	var strHtml = "";
	var tmpobjDs;
		
	if (comp.visible = true) {		
		
		gv_nCurTop += PobjDs.GetColumn(nRow,"Top");
		gv_nCurLeft += PobjDs.GetColumn(nRow,"Left");
		var strPosition = "position:absolute;";

		/***
		if ( gv_printPagePerGap > 0 )
		{
			strPosition = "position:relative;";
			nTop = objDs1.GetColumn(nRow,"orgTop") - (objDs1.GetColumn(nRow - 1,"orgTop") + objDs1.GetColumn(nRow - 1,"orgheight"));
			nLeft = objDs1.GetColumn(nRow,"orgleft") - (objDs1.GetColumn(nRow - 1,"orgleft") + objDs1.GetColumn(nRow - 1,"orgwidth"));			
		}
		***/
						
		//strHtml = strHtml + "<div style='position:absolute;top:" + (PobjDs.GetColumn(nRow,"Top") + gv_printPagePerGap) + "; left:" + PobjDs.GetColumn(nRow,"Left") +  ";;height:27;'>" + chr(10);
		strHtml = strHtml + "<div style='" + strPosition + "top:" + gv_nCurTop + "; left:" + gv_nCurLeft +  ";height:27;'>" + chr(10);
		
		for( var i = 0; i < comp.tabcount; i++){
			var objTabpage = comp.GetItem(i);
			var strImg = gv_strImgFolder + objTabpage.ImageId + ".bmp";
			if ( i == comp.TabIndex){
				strHtml = strHtml + "<span style='height:27;border:1px solid;font-size:" + comp.displayfontsize + "pt;font-family:" + comp.displayfontname + ";font-weight:bold; vertical-align:middle;padding-top:8;'>&nbsp;" + objTabpage.text + "&nbsp;</span>" + chr(10);
			} else {
				strHtml = strHtml + "<span style='height:27;border:1px solid;font-size:" + comp.displayfontsize + "pt;font-family:" + comp.displayfontname + ";vertical-align:middle;padding-top:7;'>&nbsp;" + objTabpage.text + "&nbsp;</span>" + chr(10);			
			}
		}	
		strHtml = strHtml + '</div>' + chr(10);
		gv_nCurTop += 27;
		
		//strHtml = strHtml + "<div id=" + comp.id + " style='border:1px solid;position:absolute;top:" + tonumber((PobjDs.GetColumn(nRow,"Top") + gv_printPagePerGap) + 27) + "; left:" + comp.left +  "; overflow:auto; height:" + tonumber(PobjDs.GetColumn(nRow,"Height") - 27) + ";width:" + tonumber(PobjDs.GetColumn(nRow,"Width")) + ";'>" + chr(10);

		for ( var i = 0; i < objDs1.rowcount; i++ ) {
			
			var comp1 = object(objDs1.getColumn(i,"obj"));
			
			if (tolower(comp1.getType()) = "grid"){	//grid 생성 
				strHtml = strHtml + createGrid(comp, comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "edit"){	//edit 생성		
				strHtml = strHtml + createEdit(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "maskedit"){	//maskedit 생성		
				strHtml = strHtml + createMaskEdit(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "button"){	//button 생성
				strHtml = strHtml + createButton(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "combo"){	//combo 생성
				strHtml = strHtml + createCombo(comp, comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "list"){	//list 생성
				strHtml = strHtml + createList(comp, comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "radio"){	//radio 생성
				strHtml = strHtml + createRadio(comp, comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "static"){	//static 생성
				strHtml = strHtml + createStatic(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "calendar"){	//calendar 생성	
				strHtml = strHtml + createCalendar(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "checkbox"){	//checkbox 생성		
				strHtml = strHtml + createCheckbox(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "textarea"){	//textarea 생성
				strHtml = strHtml + createTextarea(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "image"){	//image 생성
				strHtml = strHtml + createImage(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "tab"){	//tab 생성
				tmpobjDs = object("tmpDS_ScreenInfo_" + objDs1.GetColumn(i,"Depth"));
				tmpobjDs.Filter("ParentObj==" + quote(comp1.id));
				strHtml = strHtml + createTab(comp1,objDs1,tmpobjDs, i);				
			}else if (tolower(comp1.getType()) = "div"){	//div 생성
				tmpobjDs = object("tmpDS_ScreenInfo_" + objDs1.GetColumn(i,"Depth"));
				tmpobjDs.Filter("ParentObj==" + quote(comp1.id));
				strHtml = strHtml + createDiv(comp1,objDs1,tmpobjDs, i);				
			}
			
		}
		
		//strHtml = strHtml + "</div>" + chr(10);
		gv_nCurTop -= PobjDs.GetColumn(nRow,"Top") + 27;
		gv_nCurLeft -= PobjDs.GetColumn(nRow,"Left");
	}
	
	return strHtml;
}


function createDiv(comp,PobjDs,objDs1, nRow){

	var strHtml = "";
	var comp1 = ""; 
	var tmpobjDs;
	
	if (comp.visible == true && comp.id <> "divTip") {		
	
		gv_nCurTop += PobjDs.GetColumn(nRow,"Top");
		gv_nCurLeft += PobjDs.GetColumn(nRow,"Left");
	
		var StrBorder = "1";	
		if (tolower(comp.border) <> "default" && tolower(comp.border) <> "none") StrBorder = "1"; else StrBorder = 0;

		//strHtml = strHtml + "<div id=" + comp.id + " style='border:" + StrBorder + "px solid;position:absolute;top:" + (PobjDs.GetColumn(nRow,"Top") + gv_printPagePerGap) + "; left:" + PobjDs.GetColumn(nRow,"Left")  +  "; overflow:none; height:" + PobjDs.GetColumn(nRow,"Height") + ";width:" + comp.width + ";'>" + chr(10);
			
		for ( var i = 0; i < objDs1.rowcount ; i++ ) {
			
			comp1 = object(objDs1.GetColumn(i,"obj"));
			
			if (tolower(comp1.getType()) = "grid"){	//grid 생성 
				strHtml = strHtml + createGrid(comp, comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "edit"){	//edit, maskedit 생성		
				strHtml = strHtml + createEdit(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "maskedit"){	//edit, maskedit 생성		
				strHtml = strHtml + createMaskEdit(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "button"){	//button 생성
				strHtml = strHtml + createButton(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "combo"){	//combo 생성
				strHtml = strHtml + createCombo(comp,comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "list"){	//list 생성
				strHtml = strHtml + createList(comp,comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "radio"){	//radio 생성
				strHtml = strHtml + createRadio(comp,comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "static"){	//static 생성
				strHtml = strHtml + createStatic(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "calendar"){	//calendar 생성	
				strHtml = strHtml + createCalendar(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "checkbox"){	//checkbox 생성		
				strHtml = strHtml + createCheckbox(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "textarea"){	//textarea 생성
				strHtml = strHtml + createTextarea(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "image"){	//image 생성
				strHtml = strHtml + createImage(comp1, objDs1, i);
			}else if (tolower(comp1.getType()) = "tab"){	//tab 생성
				tmpobjDs = object("tmpDS_ScreenInfo_" + objDs1.GetColumn(i,"Depth"));
				tmpobjDs.Filter("ParentObj==" + quote(comp1.id));
				strHtml = strHtml + createTab(comp1,objDs1,tmpobjDs, i);				
			}else if (tolower(comp1.getType()) = "div"){	//div 생성
				tmpobjDs = object("tmpDS_ScreenInfo_" + objDs1.GetColumn(i,"Depth"));
				tmpobjDs.Filter("ParentObj==" + quote(comp1.id));
				strHtml = strHtml + createDiv(comp1,objDs1,tmpobjDs, i);				
			}
		
		}
		//strHtml = strHtml + "</div>" + chr(10);
		gv_nCurTop -= PobjDs.GetColumn(nRow,"Top");
		gv_nCurLeft -= PobjDs.GetColumn(nRow,"Left");

	}
	
	return strHtml;
}

// %Component%/Usr 디렉토리 얻음(없으면 생성 함)
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


// StartXml 경로 찾기
function GetStartXmlPath()
{
	var i, len, start_xml, c;
	
	start_xml = global.StartXml;
	len = Length(start_xml);
	for( i = len-1 ; i >= 0 ; i-- )
	{
		c = CharAt(start_xml, i);
		if( c == "\\" || c == "/" )
			break;
	}
	return substr(start_xml, 0, i) + c;
}
