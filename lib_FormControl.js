
function proj_NewForm(Fprefix,Formid,FormName,strParm) 
{ 
	
//	trace(strParm + "," + fmid);
	var objForms = AllWindows(Formid);
																										
	// newform ???�는경우                                                                                      
//	global.topbar.cmb_go.value = fmid;
	
	if(objForms[0] == null) {
		
		G_XMLNAME   = Fprefix + "::" + Formid + ".xml";
		
		if ( Formid == "SDI" )
		{
			NewWindow(Formid, "Main::Main_SDI.xml", "", , , "OpenStyle=max resize=true",-1 , -1);
		} else {
			NewWindow(Formid, "Main::MainForm.xml", "", , , "OpenStyle=max resize=true",-1 , -1);
		}
	} else {
		if ( toUpper(objForms[0].MdiStatus) == "MIN" ) objForms[0].MdiStatus = "MAX";
		objForms[0].SetFocus();
	}
} 

function proj_findWindow(formid)
{
	var wGlobal = Globals();
	var fObj;
	
	for ( var i = 1 ; i < wGlobal.Count ; i++ )
	{
		var wObj = wGlobal[i].AllWindows(formid);
		if ( wObj[0] != null ) {
			fObj = wObj[0];
			break;
		}
	}
	return fObj;
}

function proj_closeForm()
{
	var dRow =  gds_windows.rowcount - 1;

	if ( dRow < 0 ) return;
	
	for ( var i = dRow ; i >= 0 ; i-- )
	{
		wObj = Global.Object(gds_windows.getColumn(i,"formid"));
		wObj.Close();
	}
	
}

