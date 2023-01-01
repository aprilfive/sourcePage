﻿var fv_ArrVertPos = Array();
var fv_Control = Array();
var fv_GridInfo = Array();
var fv_GridSeq = -1;
var fv_DatasetId = Array();
var fv_GridBorderGap = 1;

var fv_parent = Array();
var fv_parentControl = Array();
var fv_parentArrVertPos = Array();

var fv_tmpparent = Array();
var fv_tmpparentControl = Array();
var fv_tmpparentArrVertPos = Array();
var fv_tmpParentSeq = -1;

var fv_tmpPstr;

function gfn_findParent(thisObj)
{
	var ParentObj;
	if ( fv_tmpParentSeq == -1 )
	{
		fv_tmpPstr = "";
	}
	
	if ( thisObj.GetType() == "TabPage" ) 
	{
		ParentObj = thisObj.parent.parent;
		fv_tmpPstr += thisObj.parent.parent.id + "." + thisObj.parent.id + ".";
	}	
	else if ( thisObj.GetType() == "Div" )	
	{
	    ParentObj = thisObj.parent;
		fv_tmpPstr += thisObj.parent.id + ".";	    
	}    
	else 
	{
	    ParentObj = null;
	    return ParentObj;
	}
	
	if ( ParentObj != null )
	{
			var l_tmpControlArray = Array();
			var l_tmpPosArray = Array();
			var l_tmpParentInfo = Array();
			var seq = 0;
			
			for ( var i = 0 ; i < ParentObj.Components.Count ; i++ )
			{
				if (  ( ParentObj.Components[i].GetType() == "Dataset" ) ||
					  ( ParentObj.Components[i].GetType() == "File" ) ||	
					  ( ParentObj.Components[i].GetType() == "FileDialog" ) ||	
					  ( ParentObj.Components[i].GetType() == "PopupDiv" ) 
				   )	
					continue;	
				if ( thisObj.id == ParentObj.Components[i].id ) continue;
					
				if ( thisObj.Bottom <= ParentObj.Components[i].Top )
				{
					//l_tmpControlArray[seq] = ParentObj.Components[i];
					l_tmpControlArray[seq] = fv_tmpPstr + ParentObj.Components[i].id;
					l_tmpPosArray[seq] = ParentObj.Components[i].Top - thisObj.Bottom;
					seq++;	
				}
			}
			
			fv_tmpParentSeq++;
			fv_tmpparent[fv_tmpParentSeq] = thisObj;
			fv_tmpparentControl[fv_tmpParentSeq] = l_tmpControlArray;
			fv_tmpparentArrVertPos[fv_tmpParentSeq] = l_tmpPosArray;
			gfn_findParent(ParentObj);
	}
	
	return ParentObj;

}

function gfn_initDynamicGrid(grdObj,HeadCellRow,BodyCellRow,nDisplayRow)
{
		gfn_SetCurForm(this);
		var tmpObj = grdObj;
		var l_tmpPosArray = Array();
		var l_tmpControlArray = Array();
		var l_tmpGridInfo = Array();
		var seq = 0;
		var tmpPObj = grdObj.GetForm();
		
		l_tmpGridInfo[0] = grdObj.RowHeight * BodyCellRow;
		l_tmpGridInfo[1] = nDisplayRow;
		l_tmpGridInfo[2] = grdObj;
		l_tmpGridInfo[3] = HeadCellRow*tmpObj.HeadHeight;
		grdObj.AutoScrollBar = "Horz";
		grdObj.UseDBuff  = false;
		for ( var i = 0 ; i < tmpPObj.Components.Count ; i++ )
		{
			if (  ( tmpPObj.Components[i].GetType() == "Dataset" ) ||
				  ( tmpPObj.Components[i].GetType() == "File" ) ||	
				  ( tmpPObj.Components[i].GetType() == "FileDialog" ) ||	
				  ( tmpPObj.Components[i].GetType() == "PopupDiv" ) 
			   )	
				continue;
			
			if ( tmpPObj.Components[i].id == grdObj.id ) continue;
				
			if ( grdObj.Bottom <= tmpPObj.Components[i].Top )
			{
				//l_tmpControlArray[seq] = tmpPObj.Components[i];
				if ( this.id == tmpPObj.id )
					l_tmpControlArray[seq] = tmpPObj.Components[i].id;
				else
					l_tmpControlArray[seq] = tmpPObj.id + "." + tmpPObj.Components[i].id;
				l_tmpPosArray[seq] = tmpPObj.Components[i].Top - grdObj.Bottom;
				seq++;	
			}
		}
		
   
	    // Event 
	    var dsObj = tmpPObj.Object(tmpObj.BindDataset);

		
			
	    if ( length(dsObj.OnLoadCompleted) > 0 )
	    {
			if ( dsObj.OnLoadCompleted != "gfn_gds_OnLoadCompleted" )
					l_tmpGridInfo[4] = dsObj.OnLoadCompleted;	
						
						
	    } 
	    
	    if ( left(dsObj.id,4) == "gds_" )
	    	dsObj.OnLoadCompleted = "gfn_gds_OnLoadCompleted";
	  	else 
	    	dsObj.OnLoadCompleted = "gfn_ds_OnLoadCompleted";
	    	
	    if ( length(dsObj.OnRowDeleted) > 0 )
	    {
			if ( dsObj.OnRowDeleted != "gfn_gds_OnRowDeleted" )
	    		l_tmpGridInfo[5] = dsObj.OnRowDeleted;		
	    } 	    
	    
	    if ( left(dsObj.id,4) == "gds_" )
	    	dsObj.OnRowDeleted = "gfn_gds_OnRowDeleted";
	  	else 
	    	dsObj.OnRowDeleted = "gfn_ds_OnRowDeleted";

	    if ( length(dsObj.OnRowInserted) > 0 )
	    {
			if ( dsObj.OnRowInserted != "gfn_gds_OnRowInserted" )
	    		l_tmpGridInfo[6] = dsObj.OnRowInserted;		
	    } 	    

	    if ( left(dsObj.id,4) == "gds_" )
	    	dsObj.OnRowInserted = "gfn_gds_OnRowInserted";
	  	else 
	    	dsObj.OnRowInserted = "gfn_ds_OnRowInserted";

			fv_tmpParentSeq = -1;
			gfn_findParent(tmpPObj);
		  
			fv_GridSeq++;
			fv_ArrVertPos[fv_GridSeq] = l_tmpPosArray;
			fv_Control[fv_GridSeq] = l_tmpControlArray;
			fv_GridInfo[fv_GridSeq] = l_tmpGridInfo;
			fv_DatasetId[fv_GridSeq] = ToLower(tmpObj.BindDataset);
			
			fv_parent[fv_GridSeq] = fv_tmpparent;
			fv_parentControl[fv_GridSeq] = fv_tmpparentControl;
			fv_parentArrVertPos[fv_GridSeq] = fv_tmpparentArrVertPos;	 	    

		if ( ( left(dsObj.id,4) == "gds_" ) && (dsObj.rowcount > 0 ) )
			gfn_ds_OnLoadCompleted(dsObj,0,"",0);
}

function gfn_FindDatasetSeq(dsId)
{
	for ( var i = 0 ; i < fv_DatasetId.length() ; i++ )
	{
		if ( fv_DatasetId[i] == ToLower(dsId) )
		{
			return i;
		}
	}
	return -1;
}

function gfn_ReArrange(seq,DsObj)
{
		var tmp_GridInfo = fv_GridInfo[seq];
		
		if ( tmp_GridInfo[1] <= DsObj.RowCount )
		{
			var tmp_ArrVerPos = fv_ArrVertPos[seq];
			var tmp_Control = fv_Control[seq];
			var nGap;
			var GridTop = tmp_GridInfo[2].Top;
			var tmpObj;
			
			tmp_GridInfo[2].redraw = false;
			nGap = tmp_GridInfo[2].Height;
			tmp_GridInfo[2].Height = tmp_GridInfo[3] + (tmp_GridInfo[0] * DsObj.RowCount) + fv_GridBorderGap;
			//nGapRow = nGapRow * tmp_GridInfo[0];
			nGap = tmp_GridInfo[2].Height - nGap;
			tmp_GridInfo[2].redraw = true;
			var nbPos = 0;
			 
			for ( var i = 0 ; i < tmp_Control.length() ;  i++ )
			{
				tmpObj = object(tmp_Control[i]);
				tmpObj.Top = tmp_GridInfo[2].bottom + tmp_ArrVerPos[i];
				if ( nbPos < tmpObj.bottom )
						nbPos = tmpObj.bottom;				
			}
			var tmp_parent = fv_parent[seq];
			var tmp_parentControl = fv_parentControl[seq];
			var tmp_parentArrVertPos = fv_parentArrVertPos[seq];
			var tmpArr;
			var tmpArrPos;
			//alert("111111111111-->" + tmp_parent.length());
			for ( var i = 0 ; i < tmp_parent.length() ;  i++ )
			{
				if ( tmp_parent[i].GetType() == "TabPage" ) 
				{
						tmp_parent[i].parent.Height += nGap;
						//if ( nbPos < tmp_parent[i].parent.bottom )
						//    nbPos = tmp_parent[i].parent.bottom;
				}		
				else if ( tmp_parent[i].GetType() == "Div" ) {	
						tmp_parent[i].Height += nGap; 
						//if ( nbPos < tmp_parent[i].bottom )
						//    nbPos = tmp_parent[i].bottom;						
				}
				
				tmpArr = tmp_parentControl[i];
				tmpArrPos = tmp_parentArrVertPos[i];
				for ( var j = 0 ; j < tmpArr.length() ; j++ )
				{
					tmpObj = object(tmpArr[j]);
					tmpObj.Top = tmp_parent[i].bottom + tmpArrPos[j];
					if ( nbPos < tmpObj.bottom )
						    nbPos = tmpObj.bottom;				
					
				}
				
			}
/*	imbeded	하였을 경우... 	
			if ( tmp_parent[tmp_parent.length() - 1] == null )
			{
				UserNotify(30, nbPos);
				//UserNotify(30,height + nGap);
			}
			else
			{
					if ( tmp_parent[tmp_parent.length() - 1].getform().getType() == "Form" )
					{
						UserNotify(30,tmp_parent[tmp_parent.length() - 1].getform().height + nGap);
						//tmp_parent[tmp_parent.length() - 1].getform().resizeScroll();
					}
					else
						UserNotify(30,tmp_parent[tmp_parent.length() - 1].getform().top + tmp_parent[tmp_parent.length() - 1].getform().height + nGap);
			}
*/			
		}
}
var strVal;
function gfn_ds_OnLoadCompleted(obj,nErrorCode,strErrorMsg,nReason)
{
	var seq = gfn_FindDatasetSeq(obj.id);
	strVal = "gfn_ds_OnLoadCompleted:: " + nReason;	
	if ( nReason <> 9  )
	{
		if ( seq > -1 )
		{
			gfn_ReArrange(seq,obj);
		}
	}
	
	if ( seq > -1 )
	{
		var tmp_GridInfo = fv_GridInfo[seq];
		if ( length(tmp_GridInfo[4]) > 0 )
		{
				eval(tmp_GridInfo[4] + "(obj,nErrorCode,strErrorMsg,nReason)");
		}		
	}
}

function gfn_ds_OnRowDeleted(obj,nRow,nCount)
{

	var seq = gfn_FindDatasetSeq(obj.id);
	if ( seq > -1 )
	{
		gfn_ReArrange(seq,obj);
		var tmp_GridInfo = fv_GridInfo[seq];
		
		if ( length(tmp_GridInfo[5]) > 0 )
		{
				eval(tmp_GridInfo[5] + "(obj,nRow,nCount)");
		}
	}	
}

function gfn_ds_OnRowInserted(obj,nRow,nCount)
{

	var seq = gfn_FindDatasetSeq(obj.id);
 
	if ( seq > -1 )
	{
		
		gfn_ReArrange(seq,obj);
		var tmp_GridInfo = fv_GridInfo[seq];

		if ( length(tmp_GridInfo[6]) > 0 )
		{
				eval(tmp_GridInfo[6] + "(obj,nRow,nCount)");
		}			
	}	
}