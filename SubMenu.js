
var GCurIdx;
var GTabIdNm;

function G_listAdd()
{
	if ( GRunType == "SDI" ) return;
	
	var TNm;
	GCurIdx = global.windows.count() - 1;
	if ( Global.SubMenu.Tab0.TabCount <= 0 )
	{
		GTabIdNm = "Tab" + GTabId + "_" + GCurIdx;
		TNm = global.windows[GCurIdx].Title;
		if ( left(TNm,5) == "expr:" )
		    TNm = Domain.app.common.submenu0.Text;
		Global.SubMenu.Tab0.InsertTab(GTabIdNm, 0, "", TNm, "tab3");	
	}
	else 
	{
		if ( Global.SubMenu.Tab0.GetItem(0).Title.Length() <= 0 ) Global.SubMenu.Tab0.DeleteTab(0);
		GTabIdNm = "Tab" + GTabId + "_" + GCurIdx;
		TNm = global.windows[GCurIdx].Title;
		if ( left(TNm,5) == "expr:" )
		    TNm = Domain.app.common.submenu0.Text;		
		Global.SubMenu.Tab0.InsertTab(GTabIdNm, Global.SubMenu.Tab0.TabCount() - 1, "", TNm, "tab3");	
	}	
	
	GTabId++;
	
	GCurIdx = Global.SubMenu.Tab0.TabCount - 1;
	//trace("aaaaaaaaaa[" + GCurIdx);
	Global.SubMenu.Tab0.TabIndex = GCurIdx;
	
	if ( Global.SubMenu.Tab0.TabCount > 0 )
		Global.SubMenu.Visible = true;
}


function G_listDel()
{
	if ( GRunType == "SDI" ) return;
	//trace("G_listDel-->[" + GCurIdx + "]");
	var i;
	for ( i = 0 ; i < Global.SubMenu.Tab0.TabCount ; i++ )
	{
		if ( Global.SubMenu.Tab0.GetItem(i).id == GTabIdNm ) break;
	}
	//trace("G_listDel-->[" + i + "]");
	Global.SubMenu.Tab0.DeleteTab(i);
	if ( Global.SubMenu.Tab0.TabCount <= 0 )
		Global.SubMenu.Visible = false;
	GTabId--;	
}

function G_TabTitleChg()
{
	if ( GRunType == "SDI" ) return;
	//trace("G_listDel-->[" + GCurIdx + "]");
	var i;
	for ( i = 0 ; i < Global.SubMenu.Tab0.TabCount ; i++ )
	{
		if ( Global.SubMenu.Tab0.GetItem(i).id == GTabIdNm ) 
		{
				Global.SubMenu.Tab0.GetItem(i).Text = Domain.app.common.submenu0.Text;
				return;
		}
	}

}

function GActivate()
{
	if ( GRunType == "SDI" ) return;
	//trace("GActivate-->[" + GCurIdx + "]");
	Global.SubMenu.Tab0.TabIndex = GCurIdx;
}

function G_listActivate(id)
{
	if ( GRunType == "SDI" ) return;
	var i = parseInt(id.substr(id.pos("_") + 1,100));
	global.windows[i].SetFocus();
}