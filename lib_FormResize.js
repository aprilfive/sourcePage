/**********************************************************************************************
//                                 Copyright 2006 Tobesoft
// -. 사용 방법
// nWidth,nHeight 는 현재 Form size를 상수값으로 구성해야 함...
// Form  OnLoadCompleted 이벤트에서 Gfn_ResizeInit(nWidth,nHeight); 를 호출하시면 자동으로 Resize 처리가 됩니다.
//   예제
  #include "lib::FormResize.js"
  function form_OnLoadCompleted(obj)
  {
	Gfn_ResizeInit(1024,768);
  }
// -. 주의 사항
// Running 중간에 Component를 Destory하는 처리가 있으면 Resize처리가 오 작동 할 수 있습니다.
// Gfn_ResizeInit();  호출후에 Component 위치 및 size를 조정하면 Resize시에 조정된 위치및 size가 무시됩니다.   
// Tab 인경우 Url Link 처리 되면서 Preload에서 false하면 로드되지 전에 Gfn_ResizeInit하면
// Resize할 Control를 등록하지 못하여 로드되지 않아서 처리가 안되게 되어 있습니다.
**********************************************************************************************/

var fv_nResizeProcCnt = 0;
var fv_FirstResize = false;
var fv_orgWidth;
var fv_orgHeight;

var fv_forgWidth;
var fv_forgHeight;

var fv_ArrHorzPosition = Array();
var fv_ArrVertPosition = Array();


var fv_ArrSubHorzPosition = Array();
var fv_ArrSubVertPosition = Array();
var fv_SubSeq = -1;


var fv_SuborgWidth = Array();
var fv_SuborgHeight = Array();

var fv_SubforgWidth = Array();
var fv_SubforgHeight = Array();


function Gfn_ResizeInit(nWidth,nHeight)
{
	this.OnSize = "Gfn_frm_OnSize";
		
	fv_orgWidth   = nWidth;
	fv_orgHeight  = nHeight;
	fv_forgWidth  = nWidth;
	fv_forgHeight = nHeight;
	var seq = 0;
	for ( var i = 0 ; i < this.Components.Count ; i++ )
	{
		if (  ( this.Components[i].GetType() == "Dataset" ) ||
			  ( this.Components[i].GetType() == "File" ) ||	
			  ( this.Components[i].GetType() == "FileDialog" ) ||	
			  ( this.Components[i].GetType() == "PopupDiv" ) 
		   )	
			continue;
		fv_ArrHorzPosition[seq] = Components[i].left;
		fv_ArrVertPosition[seq] = Components[i].top;
		seq++;
		fv_ArrHorzPosition[seq] = Components[i].right;
		fv_ArrVertPosition[seq] = Components[i].bottom;
		seq++;
		if ( Components[i].IsComposite() )
		{
			Gfn_SubFormResizeInit(Components[i]);
		}
	}
	
	//alert(this.width + "///" + this.height);
	fv_FirstResize = true;
	Gfn_frm_OnSize(this,this.width,this.height);

}

function Gfn_SubFormResizeInit(obj)
{
	var seq = 0;
	var tmpArrayHorz = Array();
	var tmpArrayVert = Array();
	fv_SubSeq++;
	var subseq = fv_SubSeq;
	fv_SuborgWidth[subseq] = obj.width;
	fv_SuborgHeight[subseq] = obj.height;

	fv_SubforgWidth[subseq] = obj.width;
	fv_SubforgHeight[subseq] = obj.height;
	
	for ( var i = 0 ; i < obj.Components.Count ; i++ )
	{
		if (  ( obj.Components[i].GetType() == "Dataset" ) ||
			  ( obj.Components[i].GetType() == "File" ) ||	
			  ( obj.Components[i].GetType() == "FileDialog" ) ||	
			  ( obj.Components[i].GetType() == "PopupDiv" ) 
		   )	
			continue;
		tmpArrayHorz[seq] = obj.Components[i].left;
		tmpArrayVert[seq] = obj.Components[i].top;
		seq++;
		tmpArrayHorz[seq] = obj.Components[i].right;
		tmpArrayVert[seq] = obj.Components[i].bottom;
		seq++;
		if ( obj.Components[i].IsComposite() )
		{
			Gfn_SubFormResizeInit(obj.Components[i]);
		}
	}
	fv_ArrSubHorzPosition[subseq] = tmpArrayHorz;
	fv_ArrSubVertPosition[subseq] = tmpArrayVert;	
}

function Gfn_ResizeProc(nCx,nCy)
{
	fv_SubSeq = -1;
	var seq = 0;
	var nWidthRate;
	var nHeightRate;
	var bProcSizeFlag = true;
	for ( var i = 0 ; i < this.Components.Count ; i++ )
	{
		if (  ( this.Components[i].GetType() == "Dataset" ) ||
			  ( this.Components[i].GetType() == "File" ) ||	
			  ( this.Components[i].GetType() == "FileDialog" ) ||	
			  ( this.Components[i].GetType() == "PopupDiv" ) 
		   )	
			continue;
		
		bProcSizeFlag = true;
		
		if ( this.Components[i].GetType() == "Button" )  bProcSizeFlag = false;
		else if ( this.Components[i].GetType() == "Image" )
		{
			if ( this.Components[i].FillType == "NONE" ) bProcSizeFlag = false;
		}
		if ( Components[i].GetType() != "TabPage" )
		{		    
			if ( !bProcSizeFlag ) // 위치를 중앙으로 조정
			{
				nWidthRate  = parseInt( (ToNumber(fv_ArrHorzPosition[seq]) * ToNumber(nCx)) / ToNumber(fv_forgWidth) );
				nHeightRate = parseInt( (ToNumber(fv_ArrVertPosition[seq]) * ToNumber(nCy)) / ToNumber(fv_forgHeight) );
				seq++;
				nWidthRate  = nWidthRate + parseInt( ((ToNumber(fv_ArrHorzPosition[seq]) * ToNumber(nCx)) / ToNumber(fv_forgWidth) - nWidthRate)/2) - parseInt(this.Components[i].Width/2);
				nHeightRate = nHeightRate + parseInt( ((ToNumber(fv_ArrVertPosition[seq]) * ToNumber(nCy)) / ToNumber(fv_forgHeight) - nHeightRate)/2) - parseInt(this.Components[i].Height/2);
				this.Components[i].left = nWidthRate;
				this.Components[i].top = nHeightRate;
				seq++;
			}
			else // size 조정 처리.
			{
				nWidthRate  = parseInt( (ToNumber(fv_ArrHorzPosition[seq]) * ToNumber(nCx)) / ToNumber(fv_forgWidth) );
				nHeightRate = parseInt( (ToNumber(fv_ArrVertPosition[seq]) * ToNumber(nCy)) / ToNumber(fv_forgHeight) );
				this.Components[i].left = nWidthRate;
				this.Components[i].top = nHeightRate;
				seq++;
				nWidthRate  = parseInt( (ToNumber(fv_ArrHorzPosition[seq]) * ToNumber(nCx)) / ToNumber(fv_forgWidth) );
				nHeightRate = parseInt( (ToNumber(fv_ArrVertPosition[seq]) * ToNumber(nCy)) / ToNumber(fv_forgHeight) );
				this.Components[i].right = nWidthRate;
				this.Components[i].bottom = nHeightRate;
				seq++;
			 }
		 }
		 else
		 {
			seq++;
			seq++;
		 }
		 if ( this.Components[i].GetType() == "Grid" ) this.Components[i].FitToArea();
		 if ( this.Components[i].IsComposite() )
		 {
			Gfn_SubFormResizeProc(this.Components[i]);
		 }
	}
}

function Gfn_SubFormResizeProc(obj)
{
	var nCx = obj.width;
	var nCy = obj.height;
	var seq = 0;
	var nWidthRate;
	var nHeightRate;
	var bProcSizeFlag = true;
	var tmpArrayHorz;
	var tmpArrayVert;
	fv_SubSeq++;
	var subseq = fv_SubSeq;
	fv_SuborgWidth[subseq] = obj.width;
	fv_SuborgHeight[subseq] = obj.height;

	tmpArrayHorz = fv_ArrSubHorzPosition[subseq];
	tmpArrayVert = fv_ArrSubVertPosition[subseq];	
	var loopCnt = 	tmpArrayHorz.length()/2;
	for ( var i = 0 ; i < loopCnt ; i++ )
	{
		if (  ( obj.Components[i].GetType() == "Dataset" ) ||
			  ( obj.Components[i].GetType() == "File" ) ||	
			  ( obj.Components[i].GetType() == "FileDialog" ) ||	
			  ( obj.Components[i].GetType() == "PopupDiv" ) 
		   )	
			continue;
		
		bProcSizeFlag = true;
		
		//trace(obj.id + "////" + obj.Components[i].id + "///" + obj.Components[i].GetType());
		if ( obj.Components[i].GetType() == "Button" )  bProcSizeFlag = false;
		else if ( obj.Components[i].GetType() == "Image" )
		{
			if ( obj.Components[i].FillType == "NONE" ) bProcSizeFlag = false;
		}
		
		if ( obj.Components[i].GetType() != "TabPage" )
		{
			if ( !bProcSizeFlag ) // 위치를 중앙으로 조정
			{
				nWidthRate  = parseInt( (ToNumber(tmpArrayHorz[seq]) * ToNumber(nCx)) / ToNumber(fv_SubforgWidth[subseq]) );
				nHeightRate = parseInt( (ToNumber(tmpArrayVert[seq]) * ToNumber(nCy)) / ToNumber(fv_SubforgHeight[subseq]) );
				seq++;
				nWidthRate  = nWidthRate + parseInt( ((ToNumber(tmpArrayHorz[seq]) * ToNumber(nCx)) / ToNumber(fv_SubforgWidth[subseq]) - nWidthRate)/2) - parseInt(obj.Components[i].Width/2);
				nHeightRate = nHeightRate + parseInt( ((ToNumber(tmpArrayVert[seq]) * ToNumber(nCy)) / ToNumber(fv_SubforgHeight[subseq]) - nHeightRate)/2) - parseInt(obj.Components[i].Height/2);
				obj.Components[i].left = nWidthRate;
				obj.Components[i].top = nHeightRate;
				seq++;
			}
			else // size 조정 처리.
			{
				nWidthRate  = parseInt( (ToNumber(tmpArrayHorz[seq]) * ToNumber(nCx)) / ToNumber(fv_SubforgWidth[subseq]) );
				nHeightRate = parseInt( (ToNumber(tmpArrayVert[seq]) * ToNumber(nCy)) / ToNumber(fv_SubforgHeight[subseq]) );
				obj.Components[i].left = nWidthRate;
				obj.Components[i].top = nHeightRate;
				seq++;
				nWidthRate  = parseInt( (ToNumber(tmpArrayHorz[seq]) * ToNumber(nCx)) / ToNumber(fv_SubforgWidth[subseq]) );
				nHeightRate = parseInt( (ToNumber(tmpArrayVert[seq]) * ToNumber(nCy)) / ToNumber(fv_SubforgHeight[subseq]) );
				obj.Components[i].right = nWidthRate;
				obj.Components[i].bottom = nHeightRate;
				seq++;
			 }
		 }
		 else
		 {
			seq++;
			seq++;
		 }
		 if ( obj.Components[i].GetType() == "Grid" ) obj.Components[i].FitToArea();
		 if ( obj.Components[i].IsComposite() )
		 {
			Gfn_SubFormResizeProc(obj.Components[i]);
		 }
	}
	
	if ( obj.GetType() != "TabPage" )
		obj.ResizeScroll();
}

function Gfn_frm_OnSize(obj,nCx,nCy,nState)
{
	if ( ( fv_orgWidth == nCx ) && ( fv_orgHeight == nCy ) ) return;

	fv_nResizeProcCnt++;
	
	if ( fv_nResizeProcCnt > 1 )
	{
		fv_nResizeProcCnt--;
		return;
	}
	
	var GapW;
	var GapH;
	
	if ( !fv_FirstResize )
	{
		fv_orgWidth = nCx;
		fv_orgHeight = nCy;
		fv_FirstResize = true;
		fv_nResizeProcCnt--;
		return;
	}

    Gfn_ResizeProc(nCx,nCy);
	ResizeScroll();
	fv_orgWidth = nCx;
	fv_orgHeight = nCy;
	fv_nResizeProcCnt--;
}