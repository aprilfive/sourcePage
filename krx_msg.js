//New Script File

// 임의계좌 색상체크........
function checkAct(act_no, columnType){
	
	if(columnType=='b'){
		var searchRow = gds_act.FindRow("ACT_NO",act_no);

		if(searchRow!=-1){
			if( gds_act.getColumn(searchRow, "colCheck")==1 ){
				var color = gds_act.getColumn(searchRow, "bColor");
				//trace("########Act_no="+act_no + " ,searchRow="+searchRow+ " ,Color="+color);
				return color;
			}
		}
	}else if(columnType=='f'){
		var searchRow = gds_act.FindRow("ACT_NO" , act_no);

		if(searchRow!=-1){
			if( gds_act.getColumn(searchRow, "colCheck")==1 ){
				var color = gds_act.getColumn(searchRow, "fColor");
				//trace("########Act_no="+act_no + " ,searchRow="+searchRow+ " ,Color="+color);
				return color;
			}
		}
	
	}
}

function fn_err_msg(title, errormsg)
{	
	var str_arg 	=  "title="+quote(title);
		str_arg 	+= " msg="+quote(errormsg);
	var str_result 	= "";
	
	str_result = Dialog("app_main::msgForm.xml", str_arg, 520, 360, true, -1, -1);
}

function fn_show_msg(arg_msg)
{
	Div_wait.st_msg.Text = arg_msg;
}

function fn_wait_create(arg_msg)
{
	var strContent, nTop, nLeft;
	
	//nTop  = ( Form.Window.Height + 55 ) / 2;	
	//nLeft = ( Form.Window.Width + 375 )/ 2 ;	
	
	var topObj = GetTopWindow();
	
	//alert("msg : " + topObj.id);

	nTop  = ( topObj.Window.Height - 100 ) / 2;
	nLeft = ( topObj.Window.Width - 375 )/ 2;
	
	//Create("Div", "Div_wait", "left='" + nLeft + "' border='flat'  top='" + nTop + "' width='375' height='55' url='app_main::form_wait.xml'");
	Create("Div", "Div_wait", "left='" + nLeft + "' border='flat'  top='" + nTop + "' width='375' height='55' url='' syncContents='true'");
	
	strContent  = "<Contents>";
	strContent += "	<Static Border='Flat' BorderColor='#7f9db9' Height='45' Id='Static12' Left='5' TabOrder='2' Top='5' Width='365'></Static>";
	strContent += "	<Static Align='Center' BKColor='#e2e2e2' Border='Flat' BorderColor='#7f9db9' Font='굴림,9,Bold' Height='36' Id='st_msg' Left='10' TabOrder='1' Top='9' VAlign='Middle' Width='356'></Static>";
	strContent += "</Contents>";
	
	Div_wait.Contents = strContent;
	
	if( arg_Msg == null || arg_msg == "" )
		Div_wait.st_msg.Text = "서버에서 조회중입니다.";
	else
		Div_wait.st_msg.Text = arg_msg;
}

function fn_wait_create_pop(topObj, arg_msg)
{
	var strContent, nTop, nLeft;
	
	//var topObj = GetTopWindow();

	nTop  = ( topObj.Window.Height - 100 ) / 2;
	nLeft = ( topObj.Window.Width - 375 )/ 2;
	
	//Create("Div", "Div_wait", "left='" + nLeft + "' border='flat'  top='" + nTop + "' width='375' height='55' url='app_main::form_wait.xml'");
	Create("Div", "Div_wait", "left='" + nLeft + "' border='flat'  top='" + nTop + "' width='375' height='55' url='' syncContents='true'");
	
	strContent  = "<Contents>";
	strContent += "	<Static Border='Flat' BorderColor='#7f9db9' Height='45' Id='Static12' Left='5' TabOrder='2' Top='5' Width='365'></Static>";
	strContent += "	<Static Align='Center' BKColor='#e2e2e2' Border='Flat' BorderColor='#7f9db9' Font='굴림,9,Bold' Height='36' Id='st_msg' Left='10' TabOrder='1' Top='9' VAlign='Middle' Width='356'></Static>";
	strContent += "</Contents>";
	
	Div_wait.Contents = strContent;
	
	if( arg_Msg == null || arg_msg == "" )
		Div_wait.st_msg.Text = "서버에서 조회중입니다.";
	else
		Div_wait.st_msg.Text = arg_msg;
}

function fn_wait_drop()
{
	Destroy("Div_wait");
}

function fn_load_act()
{
	//alert("aaaaa");
	trace("init before : "+ gds_isu_cd.RowCountNF());
	if(gds_isu_cd.RowCountNF() == 0){
		var outds 	= "gds_isu_cd=gds_isu_cd";
		Transaction("init_gds", "DATASVC::gds_isu_cd_nm.xml", "", outds, "", "re_initcb");
	}
	
	if(gds_act.count==0){
		gds_act.ServiceID = "c:\\tempAccount.xml";
		gds_act.Load();

		cb_act_no.BindDataset = "";
		cb_act_no.BindDataset = "gds_act";
	}
}

function re_initcb(strSvcID, nErrorCode, strErrorMsg)
{
	if ( nErrorCode <> 0 )
	{
		btn_search.Enable = true;
		fn_wait_drop();
		
		alert("Error : " + strErrorMsg);
		return;
	}
	
	if ( strSvcID == "init_gds" )
	{
		trace("---------------------------------------");
		trace("init gds_isu_cd.count = "+gds_isu_cd.RowCountNF() );
	}

}

//숫자 입력 Check....
function fn_checkNumber(nChar)
{
	if( nChar < 48 || nChar > 57 )
	{
		//trace (nChar+'는 숫자가 아닙니다.');
		return false;
	}
	//trace (nChar+'는 숫자입니다.');
	return true;
}