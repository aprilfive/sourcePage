/*
=============================   Program description   ====================================
* Script ID    : uChartX_H2o.js
* Comment      : 
* Create Date  : 2005/11/07 
* Author       : tobesoft/T.Y Kwon 
* Modifier     : tobesoft/J.S Yoon
* 
* ---------------------------------------------------------------------------------------- 
* Revision No     Date         Modifier      Comment                       
* ----------------------------------------------------------------------------------------
*          1      
*          2      
*          3	
*          4
*          5
==========================================================================================
*/


var uChartX_H2o____BuildSkip = false;

var cAvailableDataCount = 100000000;
//var cAvailableDataCount = 500;
//var rateChartDeb = false;

/*
 *====================================================================================================
 * Comment: 
 * para   :
 *        1.aStr : 
 *====================================================================================================
 */
function isEmChar( aStr )
{
    var lCnt;
    var lbCnt;
    var isEm = false;
    
    lCnt  = Length( aStr ); 
    lbCnt = Lengthb( aStr );
    
    if ( lbCnt != lCnt ) isEm = true;
    
    return isEm;
}

/*
 *====================================================================================================
 * Comment: 
 * para   :
 *        1.aStartForm  :
 *        2.aFindFormId :
 *====================================================================================================
 */
function findParentForm ( aStartForm, aFindFormId )
{
    var startForm  = aStartForm;
    var findFormId = aFindFormId;
    var curForm;
    var findForm = null;

    curForm = startForm;

    while( true ) {
        if ( curForm.id == findFormId ) {
            findForm = curForm;
            break;
        }
        curForm = curForm.GetForm();
        if ( curForm == null ) break;
    }
    return findForm;
}

/*
 *====================================================================================================
 * Comment: 
 * para   :
 *        1.aParamStr      :
 *        2.aItemDivChr    :
 *        3.aElementDivChr :
 *        4.aTypeDivChr    :
 *====================================================================================================
 */
function userDataToList ( aParamStr, aItemDivChr, aElementDivChr, aTypeDivChr )
{
   /*******************************************************************************************
    * FORM(DIV,TAB)�� UserData ������Ƽ�� ��Ʈ�� ����(data)�� LIst Array �� ��ȯ�Ͽ� ��ȯ
    * param ex)
    *   UserData = [BrandCd=4037&BrandName=ab_co&PreferenceMarket=TKY&MarketCd=TKY:NRI:JST&OnFocus=fn_SetFocusBound]
    ******************************************************************************************/
    var prmStr  = aParamStr;
    var itemDiv = Iif( aItemDivChr    != null, aItemDivChr   , "&" );
    var elemDiv = Iif( aElementDivChr != null, aElementDivChr, "=" );
    var typeDiv = Iif( aTypeDivChr    != null, aTypeDivChr   , "::");
    
    var cKEY  = 0;
    var cVAL  = 1;
    var cTYPE = 2;

    var tmpList = Split( prmStr, itemDiv );
    var resultList = Array( Length( tmpList ) );
    var listCnt = Length( resultList );
    var listIdx;
    var resultItem;

    var tmpItem;
    var tmpKey;
    var tmpVal;
    var tmpType;

    var outPutList = "";

    for ( listIdx = 0; listIdx < listCnt; listIdx++ )
    {
        resultItem = Array( 3 );

        tmpItem = Split( tmpList[ listIdx ], elemDiv );
        tmpKey  = tmpItem[ cKEY ];
        tmpVal  = tmpItem[ cVAL ];
        tmpType = "STRING";

        tmpItem = Split( tmpVal, typeDiv, "false" );
        if ( Length( tmpItem ) > 1 ) {
            tmpType = tmpItem[ cKEY ];
            tmpVal  = tmpItem[ cVAL ];
        }

        switch( ToLower( tmpType ) )
        {
            case "integer" :
                 tmpVal = parseInt( tmpVal );
                 break;
            case "decimal" :
                 tmpVal = parseFloat( tmpVal );
                 break;
            case "object"  :
            case "dataset" :
            case "array"   :
                 tmpVal = Object( tmpVal );
                 break;
            case "binary"  :
                 tmpVal = parseInt( tmpVal );
                 break;
            case "currency":
                 tmpVal = parseCurrency( tmpVal );
                 break;
            case "date"    :
                 tmpVal = parseDateTime( tmpVal );
                 break;
            case "null"    :
            case "unkown"  :
            case "string"  :
                 tmpVal = ToString( tmpVal );
                 break;
            default:
                 tmpVal = ToString( tmpVal );
                 break;
        }
        resultItem[ cKEY  ] = tmpKey ;
        resultItem[ cVAL  ] = tmpVal ;
        resultItem[ cTYPE ] = tmpType;

        resultList[ listIdx ] = resultItem;

        outPutList += "\n---------------------------------------------\n" +
                      "List[" + listIdx + "] \n" +
                      "\t[Key :" + resultList[ listIdx ][ cKEY  ] + "]\n" +
                      "\t[Val :" + resultList[ listIdx ][ cVAL  ] + "]\n" +
                      "\t[Type:" + resultList[ listIdx ][ cTYPE ] + "]\n" +
                      "";
    }
  //trace("listObj=" + outPutList + "\n\n\n");
  //alert("��userDataToList____listObj=" + outPutList + "\n\n\n");

    return resultList;
}

/*
 *====================================================================================================
 * Comment: 
 * para   :
 *        1.aUserDataList :
 *        2.aKey          :
 *====================================================================================================
 */
function getUserDataList ( aUserDataList, aKey )
{
   /*******************************************************************************************
    * userDataToList�� ���� ������ LIst Array���� ��û�� Key�� �ش��ϴ� ���� ��ȯ
    ******************************************************************************************/
    var udl    = aUserDataList;
    var udlCnt = Length( udl );
    var udlIdx;
    var udlItem;
    var key = aKey;

    var cKEY  = 0;
    var cVAL  = 1;
    var cTYPE = 2;

    var resultVal = "";

    for ( udlIdx = 0; udlIdx < udlCnt; udlIdx++ )
    {
        udlItem = udl[ udlIdx ];

        if ( ToLower( udlItem[ cKEY ] ) == ToLower( key ) ) {
            resultVal = udlItem[ cVAL ];
            break;
        }
    }
    return resultVal;
}

/*
 *====================================================================================================
 * Comment: 
 * para   :
 *        1.aUserDataList :
 *        2.aKey          :
 *        3.aVal          :
 *====================================================================================================
 */
function setUserDataList ( aUserDataList, aKey, aVal )
{
   /*******************************************************************************************
    * userDataToList�� ���� ������ LIst Array���� ��û�� Key�� ��û�� ���� �Ҵ�
    ******************************************************************************************/
}

/*
 *====================================================================================================
 * Comment: 
 * para   :
 *        1.aDsObj :
 *        2.aFileName          :
 *====================================================================================================
 */
function loadXmlFileDataSet ( aDsObj, aFileName )
{
   /*******************************************************************************************
    * �����ͼ¿� ���� xml������ �ε��Ͽ� ����
    ******************************************************************************************/
    // xml ���� ��������
    var ds = aDsObj;
    var dsRowIdx;
    var dsRowCnt;

    var fp;
    var buf;
    var loadRowCnt;
    var startRowIdx;
    var dsRowIdx;

  //var basePaht = aBasePath;
  //var basePaht = "C:\\NRI\\testDataXml\\";
  //var basePaht = "C:\\NRI3\\testDataXml\\";
    Create( "File", "fileXmlDs" );
    fp = fileXmlDs;

    fp.FileName = aFileName;
  //fp.FileName = basePaht + aFileName + ".xml";

    fp.Open( "r" );
    buf = fp.Read();

    startRowIdx = ds.RowCount();

    ds.UpdateControl = false;
    //loadRowCnt = ds.LoadXml( buf, "false" );
    loadRowCnt = ds.LoadXml( buf, "true" );

    for ( dsRowIdx = 0; dsRowIdx < loadRowCnt; dsRowIdx++ )
        ds.SetRowType( startRowIdx + dsRowIdx, 'Insert' );

    ds.UpdateControl = true;
    fp.Close();
//trace( ds.saveXML() );
    Destroy( "fileXmlDs" );
}

/*
 *====================================================================================================
 * Comment: 
 * para   :
 *        1.aArryList :
 *        2.aEleKey   :
 *====================================================================================================
 */
function arryIndexOf( aArryList, aEleKey )
{
   /*******************************************************************************************
    * �迭�ǿ��� ��û�� Key�� ��ġ�� array index ����
    ******************************************************************************************/
    var aList    = aArryList;
    var aListCnt = Length( aList );
    var aListIdx;
    var key = aEleKey;

    for ( aListIdx = 0; aListIdx < aListCnt; aListIdx++ )
    {
        if ( aList[ aListIdx ] == key ) break;
    }
    return aListIdx;
}

/*
 *====================================================================================================
 * Comment: 
 * para   :
 *        1.aVal :
 *====================================================================================================
 */
function toLineStyleValue( aVal )
{
   /*******************************************************************************************
    * ��Ʈ �� ��Ÿ�� �� ����
    * [ "SOLID": 0[DEFAULT], "DASH": 1, "DOT": 2, "DASHDOT": 3, "DASHDOTDOT": 4  ]
    ******************************************************************************************/
    var rVal = -1;

    switch ( ToLower( aVal ) )
    {
        case "solid"     : rVal = 0; break;   // default
        case "dash"      : rVal = 1; break;
        case "dot"       : rVal = 2; break;
        case "dashdot"   : rVal = 3; break;
        case "dashdotdot": rVal = 4; break;
    }
    //trace( "  call :: toLineStyleValue( [" + aVal + "] ) :: " + rVal );
    return rVal;
}

/*
 *====================================================================================================
 * Comment: 
 * para   :
 *        1.aVal :
 *====================================================================================================
 */
function toPieBgFillModeValue ( aVal )
{
   /*******************************************************************************************
    * ���� ��Ʈ ��� ä��� ��Ÿ�� �� ����
    * [ "SOLID": 0[DEFAULT], "DASH": 1, "DOT": 2, "DASHDOT": 3, "DASHDOTDOT": 4  ]
    ******************************************************************************************/
    var rVal = -1;

    switch ( ToLower( aVal ) )
    {
        case "none"                 : rVal =  1; break;  // ����
        case "pattern"              : rVal =  2; break;  // ����
        case "gradation_horizontal" : rVal =  4; break;  // ���� ����
        case "gradation_vertical"   : rVal =  8; break;  // ���� ����
        case "gradation_rectangle"  : rVal = 16; break;  // ���� �簢
        case "gradation_ellipse"    : rVal = 32; break;  // ���� Ÿ��
    }
//trace( "  call :: toPieBgFillModeValue( [" + aVal + "] ) :: " + rVal );
    return rVal;
}

/*
 *====================================================================================================
 * Comment: 
 * para   :
 *        1.aVal :
 *====================================================================================================
 */
function toFillStyleValue( aVal )
{
   /*******************************************************************************************
    * ��Ʈ �� ��Ÿ�� �� ����
    * [ "HORIZONTAL":1, "VERTICAL":2, "FDIAGONAL":3, "BDIAGONAL":4, "CROSS":5, "DIACROSS":6, "FILL":7(def) ]
    ******************************************************************************************/
    var rVal = -1;

    switch ( ToLower( aVal ) )
    {
        case "horizontal": rVal = 1; break;
        case "vertical"  : rVal = 2; break;
        case "fdiagonal" : rVal = 3; break;
        case "bdiagonal" : rVal = 4; break;
        case "cross"     : rVal = 5; break;
        case "diacross"  : rVal = 6; break;
        case "fill"      : rVal = 7; break;
    }
//trace( "  call :: toFillStyleValue( [" + aVal + "] ) :: " + rVal );
    return rVal;
}

/*
 *====================================================================================================
 * Comment: 
 * para   :
 *        1.aVal :
 *====================================================================================================
 */
function toFontWeightValue( aVal )
{
   /*******************************************************************************************
    * ��Ʈ ��Ʈ �� ����
    * [ "NORMAL": 400, "BOLD": 700, "HEAVY": 900 ]
    ******************************************************************************************/
    var rVal = -1;

    switch ( ToLower( aVal ) )
    {
        case "normal": rVal = 400; break;
        case "bold"  : rVal = 700; break;
        case "heavy" : rVal = 900; break;
    }
//trace( "toFontWeightValue( [" + aVal + "] ) :: " + rVal );

    return rVal;
}

/*
 *====================================================================================================
 * Comment: 
 * para   :
 *        1.aVal :
 *====================================================================================================
 */
function toTimeLinePeriodValue ( aVal )
{
    // �ð迭����Ÿ or �ؽ�Ʈ����Ÿ ��뿩�� ���� (�Ϻ�/�ֺ�/����/�к�) - (0:�ؽ�Ʈ, 1:�ð迭)

   /*******************************************************************************************
    * ��Ʈ �ð迭����Ÿ �ϰ��� �� ����
    * [ "DAY":0, "WEEK":1, "MONTH":2, "MIN":3 ]
    ******************************************************************************************/
    var rVal = -1;

    switch ( ToLower( aVal ) )
    {
        case "day"   : rVal = 0; break;
        case "week"  : rVal = 1; break;
        case "month" : rVal = 2; break;
        case "min"   : rVal = 3; break;
    }
    return rVal;
}

/*
 *====================================================================================================
 * Comment: 
 * para   :
 *        1.dsObj    :
 *        2.keyColId :
 *        3.valColId :
 *        4.keyName  :
 *        5.nullVal  :
 *====================================================================================================
 */
function getAttributeVal ( dsObj, keyColId, valColId, keyName, nullVal )
{
   /*******************************************************************************************
    * key value ������ �����ͼ��� ��û�� row��°�� Ư���÷����� ����
    * ���� NULL�ΰ�� nullVal�� �����Ѵ�.
    ******************************************************************************************/
    var ds = dsObj;
    var dsRowIdx;
    var kcId = Trim( keyColId );
    var vcId = Trim( valColId );
    var kcNm = Trim( keyName  );
    var nVal = Trim( nullVal  );
    var resultVal;

    dsRowIdx  = ds.FindRow( kcId, kcNm );
    resultVal = ds.GetColumn( dsRowIdx, vcId );
    if ( resultVal == null ) resultVal = nVal;
    
    switch ( Type( resultVal ) )
    {
        case "INTEGER" :
             break;
        case "DECIMAL" :
             break;
        case "STRING"  : resultVal = Trim( resultVal );
             break;
        case "object"  :
             break;
        case "ARRAY"   :
             break;
        case "BINARY"  :
             break;
        case "CURRENCY":
             break;
        case "DATE"    :
             break;
        case "null"    :
             break;
        case "UNKOWN"  :
             break;
        default: break;
    }
    
    //if(right(trim(keyName), 12)=="FontFaceName")
    if(pos(toUpper(keyName), "FONTFACENAME") != -1)
    {
		//alert(dsObj+":::::"+keyName);
		resultVal="�ͣ� �����ë�";
		setAttributeVal(dsObj, keyColId, valColId, keyName , resultVal);
		
		return resultVal;
    }
    else
    {
		return resultVal;
    }
    
    
    //return resultVal;
}

/*
 *====================================================================================================
 * Comment: 
 * para   :
 *        1.dsObj    :
 *        2.keyColId :
 *        3.valColId :
 *        4.keyName  :
 *        5.valData  :
 *====================================================================================================
 */
function setAttributeVal( dsObj, keyColId, valColId, keyName, valData )
{
   /*******************************************************************************************
    * key value ������ �����ͼ��� ��û�� row��°�� Ư���÷����� ����
    ******************************************************************************************/
    var ds = dsObj;
    var dsRowIdx;
    var kcId = Trim( keyColId );
    var vcId = Trim( valColId );
    var kcNm = Trim( keyName  );
    var resultVal;

    dsRowIdx  = ds.FindRow( kcId, kcNm );
    ds.SetColumn( dsRowIdx, vcId, valData );
}

/*
 *====================================================================================================
 * Comment: 
 * para   :
 *        1.dsObj    :
 *        2.keyColId :
 *        3.valColId :
 *        4.keyName  :
 *        5.valData  :
 *====================================================================================================
 */
function createChartDW2 ( aChartObject, aDsChartCompSpec, aDsChartHeadSpec, aDsChartTimeLineSpec, aDsChartToolBarSpec, aDsChartSpec )
{
    var cObj = aChartObject;
    var cMgr = 0;
    var cObjHandle;

    var dsChartComp     = aDsChartCompSpec;
    var dsChartHead     = Iif( aDsChartHeadSpec     != null, aDsChartHeadSpec    , Object( dsChartComp.GetConstColumn( "headSpecDataSet"     ) ) );
    var dsChartTimeLine = Iif( aDsChartTimeLineSpec != null, aDsChartTimeLineSpec, Object( dsChartComp.GetConstColumn( "timeLineSpecDataSet" ) ) );
    var dsChartToolBar  = Iif( aDsChartToolBarSpec  != null, aDsChartToolBarSpec , Object( dsChartComp.GetConstColumn( "toolBarSpecDataSet"  ) ) );
    var dsChart         = Iif( aDsChartSpec         != null, aDsChartSpec        , Object( dsChartComp.GetConstColumn( "chartSpecDataSet"    ) ) );

    var attrItemVal;
    cMgr = initChartComp( cObj, cMgr, dsChartComp, dsChartHead, dsChartTimeLine, dsChartToolBar );

    initChartArea( cObj, cMgr, dsChartComp );

    // ��Ʈ & ��ǥ ����
    appendChart( cObj, cMgr, dsChartComp );

    // �Ӹ������� ���� ����
    attrItemVal = Iif( ToLower( getAttributeVal( dsChartComp, "attributeId", "attributeVal", "useChartHeadArea", "true" ) ) == "false", 0, 1 );
    if ( attrItemVal == 1 ) initChartHead( cObj, cMgr, dsChartHead );

    // �ð迭����  ���� ����
    attrItemVal = Iif( ToLower( getAttributeVal( dsChartComp, "attributeId", "attributeVal", "useTimeLineArea", "true" ) ) == "false", 0, 1 );
    if ( attrItemVal == 1 ) initChartTimeLine( cObj, cMgr, dsChartTimeLine );

    // ������������ ���� ����
    attrItemVal = Iif( ToLower( getAttributeVal( dsChartComp, "attributeId", "attributeVal", "useToolBarArea", "true" ) ) == "false", 0, 1 );
    if ( attrItemVal == 1 ) initChartToolBar( cObj, cMgr, dsChartToolBar );
    //---> initChartToolBar( cObj, cMgr, dsChartToolBar );

    // chart Data format Infomation ����
    initChartDataInfo ( cObj, cMgr, dsChartComp );


    // ��Ʈ Window ����
    cObjHandle = cObj.GetWindowHandle();
    cObj.CreateChartX( cMgr, cObjHandle );

    // ��Ʈ�� ������ ����
    cObj.SetSize( cMgr, cObj.Left, cObj.Top, cObj.Width, cObj.Height, true );
    //cObj.SetSize( cMgr, 0, 0, 400, 400, false );

    return cMgr;
}

function initChartComp ( aChartObject, aChartManager, aDsChartCompSpec, aDsChartHeadSpec, aDsChartTimeLineSpec, aDsChartToolBarSpec )
{
   /*******************************************************************************************
    * íƮ������Ʈ ���� �ʱ�ȭ
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;

    var dsChartComp     = aDsChartCompSpec;
    var dsChartHead     = aDsChartHeadSpec;
    var dsChartTimeLine = aDsChartTimeLineSpec;
    var dsChartToolBar  = aDsChartToolBarSpec;

    var i;
    var attrItemVal;
    var attrItemList = Array( 9 );

    attrItemList[ 0 ] = "runTimeAddIndicator"  ;
    attrItemList[ 1 ] = "runTimePropChangeSave";
    attrItemList[ 2 ] = "useAnalyzerToolBar"   ;
    attrItemList[ 3 ] = "useDataInfoWin"       ;
    attrItemList[ 4 ] = "useChartHeadArea"     ;
    attrItemList[ 5 ] = "useTimeLineArea"      ;
    attrItemList[ 6 ] = "useScrollBar"         ;
    attrItemList[ 7 ] = "useToolBarArea"       ;
    attrItemList[ 8 ] = "useAreaSplitBar"      ;

    var chartObjId = "";                    // ��Ʈ������Ʈ ID
    var attrOption = 511;

    var f_runTimeAddIndicator   =   1;      // ����� ��ǥ�߰� ����  m_bDynamicSave      0x00000001
    var f_runTimePropChangeSave =   2;      // ����� �Ӽ� ���� ���� m_bDynamicSaveLoad  0x00000002
    var f_useAnalyzerToolBar    =   4;      // �м��������� ���     m_bUseTool          0x00000004
    var f_useDataInfoWin        =   8;      // ������������ ���     m_bUseDataWin       0x00000008
    var f_useChartHeadArea      =  16;      // �Ӹ�������            m_bHeadLine         0x00000010
    var f_useTimeLineArea       =  32;      // �ð迭����            m_bTLine            0x00000020
    var f_useScrollBar          =  64;      // ��ũ�ѹ�              m_bScrollBar        0x00000040
    var f_useToolBarArea        = 128;      // ������������          m_bToolLine         0x00000080
    var f_useAreaSplitBar       = 256;      // �����и���            m_bSplitter         0x00000100

    if ( ( cMgr == null ) or ( cMgr == 0 ) ) 
        cMgr = cObj.GetChartMng(); 
    else 
        cMgr = 0;

    // ��Ʈ Object ����
    if ( cMgr <> 0 ) {
        //alert("^.^ cMgr=" + cMgr);
        cObj.DeleteChartX( cMgr );
        cMgr = 0;
    }
    cMgr = cObj.NewChartX();

    if ( cMgr == 0 ) {
        cMgr = cObj.NewChartX();
    }

    // ��Ʈ Object�Ӽ� ����
    for ( i = 0 ; i < Length( attrItemList ) ; i ++ )
    {
        attrItemVal = getAttributeVal( dsChartComp, "attributeId", "attributeVal", attrItemList[ i ], "true" );
        if ( attrItemVal == "false" )
            attrOption -= eval( "f_" + attrItemList[ i ] );
    }
    cObj.SetOption( cMgr, attrOption );

    // ��Ʈ Object ������(ID) ����
    attrItemVal = getAttributeVal( dsChartComp, "attributeId", "attributeVal", "chartObjectId", "" );
    cObj.SetCtrlName ( cMgr, "chartDW_" + attrItemVal );

    // ��� ����Ÿ ����  [0: ��üData ������ ����, ������ ����ŭ ��� ]
    attrItemVal = getAttributeVal( dsChartComp, "attributeId", "attributeVal", "displayDataCount", 0 );
    cObj.SetDisplayCount( cMgr, attrItemVal );

    // ����(���)���� ���� (0:����, 1:���)
    attrItemVal = getAttributeVal( dsChartComp, "attributeId", "attributeVal", "backGroundColor", 0 );
    cObj.SetBaseColor( cMgr, attrItemVal );

    // ����� �������� �к� ���� ����
    attrItemVal = getAttributeVal( dsChartComp, "attributeId", "attributeVal", "changeRealDataTypeMinVal", 1 );
    cObj.ChangeRealDataType( cMgr, attrItemVal );

	//alert("attrItemVal = " + attrItemVal);
    return cMgr;
}

function initChartArea ( aChartObject, aChartManager, aDsChartCompSpec )
{
   /*******************************************************************************************
    * ��Ʈ ���� ���� �� �� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;

    var dsChartComp = aDsChartCompSpec;
    var dsChartArea = Object( dsChartComp.GetConstColumn( "areaSpecDataSet" ) );;
    var dsChartAreaRowCnt= dsChartArea.RowCount;
    var dsChartAreaRowIdx;

    var areaOrder;
    var areaTop;
    var areaBottom;
    var areaTopMargin;
    var areaBtmMargin;
    var areaBkMode;
    var areaBkColor;
    var useAreaTitle;
    var areaTitle;
    var areaHandle;

    dsChartArea.Sort( "areaOrder:a", false );

    for ( dsChartAreaRowIdx = 0; dsChartAreaRowIdx < dsChartAreaRowCnt; dsChartAreaRowIdx++ )
    {
        // �����Ӽ� �߰�
        areaHandle = cObj.AddChartWnd( cMgr, areaTop, areaBottom );
        dsChartArea.SetColumn( dsChartAreaRowIdx, "areaHandle", areaHandle );

        // ���� ���Ӽ� ����
        areaTop       = dsChartArea.GetColumn( dsChartAreaRowIdx, "areaTop"       );
        areaBottom    = dsChartArea.GetColumn( dsChartAreaRowIdx, "areaBottom"    );
        areaTopMargin = dsChartArea.GetColumn( dsChartAreaRowIdx, "areaTopMargin" );
        areaBtmMargin = dsChartArea.GetColumn( dsChartAreaRowIdx, "areaBtmMargin" );
        cObj.cwSetSize( cMgr, areaHandle, areaTop, areaBottom, areaTopMargin, areaBtmMargin );

        // ���� ������ ����(nBkMode=1: TRANSPARENT, 2:OPAQUE[DEFAULT](2�϶� �÷�����))
        areaBkMode = dsChartArea.GetColumn( dsChartAreaRowIdx, "areaBkColor" );
        areaBkMode = Iif( ToLower( areaBkMode ) == "transparent", 1, areaBkMode );
        areaBkColor = "";
        if ( areaBkMode != 1 ) {
            areaBkColor = ToColorValue( areaBkMode, true );
            areaBkMode  = 2;
        }
        cObj.cwSetBkColor( cMgr, areaHandle, areaBkMode, areaBkColor );

        // ���� Ÿ��Ʋ ǥ�ÿ��μӼ� ����
        useAreaTitle  = dsChartArea.GetColumn( dsChartAreaRowIdx, "useAreaTitle"  );
        cObj.cwSetDispChartTitle( cMgr, areaHandle, useAreaTitle );
    }
}

function initChartHead ( aChartObject, aChartManager, aDsChartHeadSpec )
{
   /*******************************************************************************************
    * �Ӹ������� �� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var ds   = aDsChartHeadSpec;
    var dsRowIdx;
    var i;
    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;

    // �Ӹ��������� ���� ����
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadHeight", 20 );
    cObj.hwSetHeight( cMgr, attrItemVal );

    // �Ӹ��������� Ÿ��Ʋ ǥ�ÿ��� ����
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadArrayTitle", "true" ) ) == "false", 0, 1 );
    cObj.hwSetDispTitle( cMgr, attrItemVal );

    // ** �Լ� ȣ�� ���� ����
    cObj.AddHeadWnd( cMgr );

    // ��Ʈ �Ӹ��� Ÿ��Ʋ ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadTitle" , "" );
    if ( attrItemVal != null )
        cObj.hwSetTitle( cMgr, attrItemVal );

    // �Ӹ��������� ���� ��Ʈ�� �۲�
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadFontFaceName" , "default" );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadFontHeight"   , 10          );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.hwSetFont( cMgr, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // �Ӹ��������� ���� ��Ʈ����
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadFontColor", "black" ), true );
    cObj.hwSetForeColor( cMgr, attrItemVal );

    // �Ӹ��������� ����� ���� - nBkMode: 1�̸� TRANSPARENT, 2�� OPAQUE (DEFAULT)
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadBkColor", "white" );
    if ( ToLower( attrItemVal ) == "transparent" ) {
        attrItemVal  = 1;
    }
    else
    {
        attrItemVal2 = ToColorValue( attrItemVal, true );
        attrItemVal  = 2;
    }
    cObj.hwSetBkColor( cMgr, attrItemVal, attrItemVal2 );

    // �Ӹ��������� "�ð�����" ������ ��¿��� ����
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadArrayDisplayValue", "true" ) ) == "false", 0, 1 );
    cObj.hwSetDispValue( cMgr, attrItemVal );
}

function initChartTimeLine ( aChartObject, aChartManager, aDsChartTimeLineSpec )
{
   /*******************************************************************************************
    * �ð迭���� �� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var ds   = aDsChartTimeLineSpec;
    var dsRowIdx;
    var i;
    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;

    cObj.AddTimeWnd( cMgr );

    // �ð迭����Ÿ or �ؽ�Ʈ����Ÿ ��뿩�� ���� (�Ϻ�/�ֺ�/����/�к�) - (0:�ؽ�Ʈ, 1:�ð迭)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useTimeLineData", "false" ) ) == "false", 0, 1 );
    cObj.twSetUseTimeData( cMgr, attrItemVal );

    if ( attrItemVal == 1 ) {
        // �ð迭 �ð����� ����
        // (nType = 0: �Ϻ�, 1:�ֺ�, 2:����, 3:�к�[default])
        // (nMin = 1,3,5,10,15,20,30,60 [* nType�� 3�ΰ�� ��к����� ���� ])
        attrItemVal = toTimeLinePeriodValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLinePeriodDiv", "DAY" ) );
        if ( attrItemVal == 3 )
            attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLinePeriodMinVal", 1 ) );

        cObj.twSetTimeType( cMgr, attrItemVal, attrItemVal2 );
    }
    else {
        // �ؽ�Ʈ����Ÿ���� �ؽ�Ʈ ��� ���� ����
        attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineTextExprSpace", "1" ) );
        cObj.twSetTextInterval( cMgr, attrItemVal );

        // �ؽ�Ʈ����Ÿ���� �ؽ�Ʈ��� ���� ���� (0:����[default], 1:����)
        attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineTextExprVertical", "H" ) ) == "h", 0, 1 );
        cObj.twSetDispVert( cMgr, attrItemVal );

        // �ؽ�Ʈ����Ÿ���� �ؽ�Ʈ���Ÿ�� ���� (0:����[default], 1:����[3�ڸ�','ǥ��])
        attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineTextExprValueType", "text" ) ) == "text", 0, 1 );
        cObj.twSetDataNum( cMgr, attrItemVal );

        // �ؽ�Ʈ����Ÿ���� �ؽ�Ʈ���Ÿ���� �����϶� �Ҽ�ǥ�� �ڸ��� ���� ( 0[default] )
        attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineTextExprRealValueLen", 0 ) );
        cObj.twSetDecimal( cMgr, attrItemVal );
    }

    // �ǽð�����Ÿ ���(�к� ? ��������, �Ϻ�)
    // �ǽð�����Ÿ ��뿩�� ���� (0:�̻��[default], 1:���)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useTimeLineRealTimeData", "false" ) ) == "false", 0, 1 );
    cObj.twSetUseRealData( cMgr, attrItemVal );

    if ( attrItemVal == 1) {
        // �ǽð�����Ÿ�� �Ϻ� or �к� ó������ ���� (0:�Ϻ�, 1:�к�[default] (1�϶� ������))
        attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useTimeLineRealTimeDataDiv", "min" ) ) == "day", 0, 1 );

        if ( attrItemVal == 1 ) {
            attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineRealTimeDataDivMinVal", 1 ) );
        }
        cObj.twSetRealDataType( cMgr, attrItemVal, attrItemVal2 );
    }

    // �ð迭���� ����� ���� (nBkMode=1: TRANSPARENT, 2:OPAQUE[DEFAULT](2�϶� �÷�����))
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineBkColor", "white" );
    attrItemVal = Iif( ToLower( attrItemVal ) == "transparent", 1, attrItemVal );
    attrItemVal2 = "";

    if ( attrItemVal != 1 ) {
        attrItemVal2 = ToColorValue( attrItemVal, true );
        attrItemVal  = 2;
    }
    cObj.twSetBkColor( cMgr, attrItemVal, attrItemVal2 );

    // �ð迭���� �ؽ�Ʈ ��� ��ġ ���� (0:������(POS_ONLINE), 1:�ʵ��߾�(POS_CENTER)[DEFAULT])
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineTextSortMethod", "CENTER" ) ) == "online", 0, 1 );
    cObj.twSetTextOrder( cMgr, attrItemVal );

    // �ð迭���� ���� ���� (��������[default:20], ���ʿ���[default:0], �����ʿ���[default:0])
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineAreaSpace"      , 20 ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineAreaLeftSpace"  , 10 ) );
    attrItemVal3 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineAreaRightSpace" , 10 ) );
    cObj.twSetMargin( cMgr, attrItemVal, attrItemVal2, attrItemVal3 );

    // �ð迭���� ������ ��뿩�� ���� (0:�̻��, 1:���[default])
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useTimeLineGuideLine", "true" ) ) == "false", 0, 1 );
    cObj.twSetUseAssistLine( cMgr, attrItemVal );

    if ( attrItemVal == 1 ) {
        // �ð迭���� ������ ��Ÿ�� ���� (�� ��Ÿ��, �β�, ����)
        attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineGuideLineStyle", "SOLID" ) );
        attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineGuideLineWidth", 1       );
        attrItemVal3 = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineGuideLineColor", "white" );
        cObj.twSetAssistLine( cMgr, attrItemVal, attrItemVal2, attrItemVal3 );
    }

    // �ð迭���� ��Ʈ ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontFaceName" , "default" );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontHeight"   , 10          );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.twSetFont( cMgr, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // �ð迭���� ��Ʈ ���� ����
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontColor" , "black" ) );
    cObj.twSetForeColor( cMgr, attrItemVal );

    // �ð迭���� ���Ӽ� ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineLineStyle", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineLineWidth", 1        );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineLineColor", "silver" ) );
    cObj.twSetLine( cMgr, attrItemVal, attrItemVal2, attrItemVal3 );

    // �ð迭 ���� ���� - ( 0:����, 1:���� )
    // ����: twSetMargin���� ���߿� ȣ���ؾ���.
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineDirection", "H" ) ) == "v", 0, 1 );
    cObj.twSetDirection( cMgr, attrItemVal );
}

function initChartToolBar  ( aChartObject, aChartManager, aDsChartToolBarSpec )
{
   /*******************************************************************************************
    * ������������ �� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var ds   = aDsChartToolBarSpec;
    var dsRowIdx;
    var i;
    var attrItemList = Array( 11 );
    var attrItemVal;

/*
    var attrOption            = 2046;
  //var f_bUseAll             =   1;     // ��� ��ư ���
    var f_toolBarZoomReset    =    2;    // ����
    var f_toolBarZoomIn       =    4;    // Ȯ��
    var f_toolBarZoomOut      =    8;    // ���
    var f_toolBarNext         =   16;    // ����
    var f_toolBarPrev         =   32;    // ����
    var f_toolBarStop         =   64;    // ����
    var f_toolBarDisplayCount =  128;    // ����
    var f_toolBarTrendLine    =  256;    // �߼���
    var f_toolBarToolWin      =  512;    // �м�����
    var f_toolBarDataWin      = 1024;    // ����Ÿ������
*/
    var attrOption            = 4094;
  //var f_bUseAll             =   1;     // ��� ��ư ���
    var f_toolBarZoomReset    =    2;    // ����
    var f_toolBarZoomIn       =    4;    // Ȯ��
    var f_toolBarZoomOut      =    8;    // ���
    var f_toolBarNext         =   16;    // ����
    var f_toolBarPrev         =   32;    // ����
    var f_toolBarStop         =   64;    // ����
    var f_toolBarDisplayCount =  128;    // ����
    var f_toolBarTrendLine    =  256;    // �߼���
    var f_toolBarToolWin      =  512;    // �м�����
    var f_toolBarDataWin      = 1024;    // ����Ÿ������
    var f_toolBarCrossLine    = 2048;    // ���콺 Ȯ�뿵������ ���

    attrItemList[ 0 ] = "toolBarZoomReset"    ;
    attrItemList[ 1 ] = "toolBarZoomIn"       ;
    attrItemList[ 2 ] = "toolBarZoomOut"      ;
    attrItemList[ 3 ] = "toolBarNext"         ;
    attrItemList[ 4 ] = "toolBarPrev"         ;
    attrItemList[ 5 ] = "toolBarStop"         ;
    attrItemList[ 6 ] = "toolBarDisplayCount" ;
    attrItemList[ 7 ] = "toolBarTrendLine"    ;
    attrItemList[ 8 ] = "toolBarToolWin"      ;
    attrItemList[ 9 ] = "toolBarDataWin"      ;
    attrItemList[10 ] = "toolBarCrossLine"    ;

    // ��Ʈ Object�Ӽ� ����
    for ( i = 0 ; i < Length( attrItemList ) ; i ++ )
    {
        attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", attrItemList[ i ], "true" );
        if ( attrItemVal == "false" )
            attrOption -= eval( "f_" + attrItemList[ i ] );
    }
    cObj.AddToolWnd( cMgr, attrOption );
}

function initChartScale ( aChartObject, aChartManager, aAreaHandle, aScaleHandle, aDsChartScaleSpec )
{
   /*******************************************************************************************
    * ������ ���� �ʱ�ȭ
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var ds   = aDsChartScaleSpec;
    var areaHandle  = aAreaHandle;
    var scaleHandle = aScaleHandle;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;

    // ������ ǥ�� ����
    // __1�̸� ����, 0�̸� ���� (DEFAULT : 1)
    // __���ð�, PV Chart�� ��� H(����) Scale���
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleDirection", "V" ) ) == "h", 0, 1 );
    cObj.swSetDirection( cMgr, areaHandle, scaleHandle, attrItemVal );

    // ������ �ڵ� �ִ�/�ּҰ� ����
    // __bAuto : 1�̸� �������� �ڵ�ó��, 0�̸� ����ó�� (DEFAULT : 1)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useAutoMinMax", "TRUE" ) ) == "false", 0, 1 );
    cObj.swSetAutoMinMax( cMgr, areaHandle, scaleHandle, attrItemVal );

    // ������ ���� �ִ�/�ּҰ� ���� ( lMax: �ִ밪, lMin: �ּҰ� )
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleMaxValue", 1000 ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleMinValue",    0 ) );
    cObj.swSetMinMax( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2 );

    // ����(��, ����) [ V:�� / N:���� ] V=0,N=1
    // __nType   : 0�̸� ������ ������ŭ �������� ������, 1�̸� �Է¹��� ��(dbValue)���� �������� ������ (DEFAULT : 0).
    // __dbValue : nType�� 0�� ��� dbValue�� ƽ�� ������ �ǰ�, 1�� ��� ƽ�� ũ�Ⱑ �ȴ� (DEFAULT ƽ ���� : 4, ƽ �� : 0.0).
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleTickType", "N" ) ) == "v", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleTickTypeValue", 4 ) );

    cObj.swSetTickType( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2 );

    // ��� ����
    //  :
    // �޴��� �Լ� ���� �ʵǾ�����
    //  :

    // ������ ����
    // __nRate : ������ ���ݰ��� ���� ��
    attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleDataRate", 1 ) );
    cObj.swSetDataRate( cMgr, areaHandle, scaleHandle, attrItemVal );

    // ǥ��_���� ������ ��뿩�� �� ����
    // __bShow  : [ 0:�̻��, 1:��� ]
    // __nMargin: ����
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useLScale", "TRUE" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleLMargin", 50 ) );
    cObj.swSetLeftScale( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2 );

    // ǥ��_���� ������ ��뿩�� �� ����
    // __bShow  : [ 0:�̻��, 1:��� ]
    // __nMargin: ����
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useRScale", "TRUE" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleRMargin", 50 ) );
    cObj.swSetRightScale( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2 );

    // �Ҽ������ڸ��� ǥ�� ����
    // __nCnt  : [ 0 �Ҽ������ڸ���]
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "exprRealValueLen", 0 ) );
    cObj.swSetDecimal( cMgr, areaHandle, scaleHandle, attrItemVal );

    // ǥ��_������ ��뿩��
    // __bUse : 1�̸� ������ ��� (DEFAULT: 1)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useAssistLine", "TRUE" ) ) == "false", 0, 1 );
    cObj.swSetUseAssistLine( cMgr, areaHandle, scaleHandle, attrItemVal );

    // ǥ��_������ �� ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "assistLineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "assistLineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "assistLineColor", "white" ), true );
    cObj.swSetAssistLine( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // ǥ��_�α�����
    // __bUse : 1�̸� �������� LOG�� ǥ�� (DEFAULT : 0)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useLogScale", "FALSE" ) ) == "false", 0, 1 );
    cObj.swSetUseLog( cMgr, areaHandle, scaleHandle, attrItemVal );

    // ǥ��_���Ӽ� �� ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "scaleLineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleLineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "scaleLineColor", "white" ), true );
    cObj.swSetLine( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // ǥ��_��Ʈ ��Ÿ�� ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "scaleFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "scaleFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleFontStrikeOut", "false" ) ) == "false", 0, 1 );

    cObj.swSetFont( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // ǥ��_��Ʈ ���� ����
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "scaleFontColor", "black" ), true );
    cObj.swSetForeColor( cMgr, areaHandle, scaleHandle, attrItemVal );

    // ���ؼ�_ǥ��
    // __bDisp : 1�̸� ���ؼ� ���, 0�̸� ���� (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayBaseLine", "FALSE" ) ) == "false", 0, 1 );
    cObj.swSetDispBaseLine( cMgr, areaHandle, scaleHandle, attrItemVal );

    // ���ؼ�_�ڵ����� ����
    // __bAuto : 1�̸� ���ؼ��� ���� �ڵ�ó��, 0�̸� �Է°����� ó�� (DEFAULT : 1)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useAutoBaseLine", "TRUE" ) ) == "false", 0, 1 );
    cObj.swSetAutoBaseLine( cMgr, areaHandle, scaleHandle, attrItemVal );

    // ���ؼ�_���ؼ��� ���� ����
    // __dbValue : ���ؼ����� ����ó�� �ϴ� ��쿡 ���� �����Ѵ�.
    attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "baseLineValue", 0 ) );
    cObj.swSetBaseLineValue( cMgr, areaHandle, scaleHandle, attrItemVal );

    // ���ؼ�_���Ӽ� ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "baseLineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "baseLineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "baseLineColor", "white" ), true );
    cObj.swSetBaseLine( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2, attrItemVal3 );
}

function appendChart ( aChartObject, aChartManager, aDsChartCompSpec, aDsChartAreaSpec, aDsChartSpec )
{
   /*******************************************************************************************
    * ��Ʈ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;

    var dsChartComp  = aDsChartCompSpec;
    var dsChartArea  = Iif( aDsChartAreaSpec  != null, aDsChartAreaSpec , Object( dsChartComp.GetConstColumn( "areaSpecDataSet"  ) ) );
    var dsChartScale;
    var ds           = Iif( aDsChartSpec      != null, aDsChartSpec     , Object( dsChartComp.GetConstColumn( "chartSpecDataSet" ) ) );
    var dsRowCnt     = ds.RowCount;
    var dsRowIdx;
    var dsChartDetail;
    var dsIndicatorDetail;

    var tList;
    var tListIndex;
    var tListCnt;

    var preAreaOrder;
    var preScaleOrder;
    var preChartOrder;
    var areaOrder;
    var scaleOrder;
    var chartOrder;
    var chartType;
    var IndicatorType;
    var IndicatorIntervals;
    var chartTitleList;
    var lineStylesList;
    var lineWidthsList;
    var lineColorsList;

    var areaHandle;
    var scaleHandle;
    var chartHandle;
    var hScaleHandle = -1;

    preAreaOrder  = -1;
    preScaleOrder = -1;
    preChartOrder = -1;

    ds.Sort( "areaOrder:a,scaleOrder:a,chartOrder:a", false );

    for ( dsRowIdx = 0; dsRowIdx < dsRowCnt; dsRowIdx++ )
    {
        areaOrder          = ds.GetColumn( dsRowIdx, "areaOrder"          );
        scaleOrder         = ds.GetColumn( dsRowIdx, "scaleOrder"         );
        chartOrder         = ds.GetColumn( dsRowIdx, "chartOrder"         );
        chartType          = ds.GetColumn( dsRowIdx, "chartType"          );
        IndicatorType      = ds.GetColumn( dsRowIdx, "IndicatorType"      );
        IndicatorIntervals = Split( ds.GetColumn( dsRowIdx, "IndicatorIntervals" ), "," );

        chartTitleList     = Split( ds.GetColumn( dsRowIdx, "chartTitle" ), "," );
        lineStylesList     = Split( ds.GetColumn( dsRowIdx, "lineStyles" ), "," );
        lineWidthsList     = Split( ds.GetColumn( dsRowIdx, "lineWidths" ), "," );
        lineColorsList     = Split( ds.GetColumn( dsRowIdx, "lineColors" ), "," );

        // ��Ʈ���� ����
        if ( preAreaOrder < areaOrder ) {
            areaHandle = dsChartArea.GetColumn( dsChartArea.FindRow( "areaOrder", areaOrder ), "areaHandle" );
            preAreaOrder = areaOrder;
            preScaleOrder = -1;
            preChartOrder = -1;
        }

        // ������ ����
        if ( preScaleOrder < scaleOrder ) {
            tList = Split( ds.GetColumn( dsRowIdx, "scaleDetailSpecDataSet" ), "," );
            tListCnt = Length( tList );

            switch( tListCnt )
            {
                case 0:
                     // �� �������� ���ǵ������� ��� �⺻ ������ ����
                     scaleHandle = cObj.AddScale( cMgr, areaHandle, 0 );
                     preScaleOrder = scaleOrder;
                     dsChartScale = Object( dsChartComp.GetConstColumn( "scaleSpecDataSet" ) );
                     if ( dsChartScale != null )
                         initChartScale ( cObj, cMgr, areaHandle, scaleHandle, dsChartScale );
                     break;
                case 1:
                     scaleHandle  = cObj.AddScale( cMgr, areaHandle, 0 );
                     preScaleOrder = scaleOrder;
                     dsChartScale = Object( tList[ 0 ] );
                     if ( dsChartScale != null )
                         initChartScale ( cObj, cMgr, areaHandle, scaleHandle, dsChartScale );
                     break;
                case 2:
                     scaleHandle  = cObj.AddScale( cMgr, areaHandle, 0 );
                     hScaleHandle = cObj.AddScale( cMgr, areaHandle, 1 );
                     preScaleOrder = parseInt( scaleOrder + 1 );

                     dsChartScale = Object( tList[ 0 ] );
                     if ( dsChartScale != null )
                         initChartScale ( cObj, cMgr, areaHandle, scaleHandle, dsChartScale );

                     dsChartScale = Object( tList[ 1 ] );
                     if ( dsChartScale != null )
                         initChartScale ( cObj, cMgr, areaHandle, hScaleHandle, dsChartScale );
                     break;
            }
        }

        // ��Ʈ �߰�
        if ( preChartOrder < chartOrder ) {
            cObj.AddChart2( cMgr, areaHandle, chartOrder, scaleHandle, hScaleHandle, chartType, IndicatorType, chartTitleList[ 0 ] );
            preChartOrder = chartOrder;
        }

        /********************************************************************************************
         * ��ǥ ������ ���� ��ǥ �Ӽ� ����
         ********************************************************************************************/
        if ( IndicatorType != null ) {
            IndicatorHandle = cObj.GetIndicator( cMgr, areaHandle + chartOrder );
            switch ( ToLower( IndicatorType ) )
            {
                case "movavg" :                                                                      // MOVAVG ( �̵���ռ� )
                      // �̵���� ����
                      cObj.SetMAofMovAvg( IndicatorHandle, IndicatorIntervals[ 0 ] );
                      break;
                case "psycho":                                                                       // PSYCHO ( �ɸ���ǥ )
                	 // �ɸ��� �Ⱓ ���� �ʿ���
                     cObj.SetMAofPsycho( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "disparity":                                                                    // DISPARITY ( �̰��� )
                     // �̵���� ����
                     cObj.SetMAofDisparity( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "obvolume":                                                                     // OBV             ( On Balance Volume )
                      // �������� ����
                      break;
                case "vratio":                                                                       // VR              ( Volume Ratio )
                     // �̵���� ����
                     cObj.SetMAofVR( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "adline":                                                                       // ADL             ( Advanced Decline Line )
                      // �������� ����
                      break;
                case "adratio":                                                                      // ADR             ( Advanced Decline Ratio )
                      // �������� ����
                      break;
                case "macd":                                                                         // MACD
                     // �̵���� ���� - �ܱ� ����
                     cObj.SetSMAofMACD( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // �̵���� ���� - ��� ����
                     cObj.SetLMAofMACD( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     // �̵���� ���� - signal
                     cObj.SetSIGofMACD( IndicatorHandle, IndicatorIntervals[ 2 ] );
                     break;
                case "sonar":                                                                        // SONAR           ( SONA )
                     // �̵���� ����
                     cObj.SetMAofSONA( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "rsindex":                                                                      // RSI             ( Relative Strength Index )
                     // �̵���� ����
                     cObj.SetMAofRSI( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "ccindex":                                                                      // CCI             ( Commodity Channel Index )
                     // �̵���� ����
                     cObj.SetMAofCCI( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "lrslope":                                                                      // LRS             ( Linear Regression Slope )
                     // �̵���� ����
                     cObj.SetMAofLRS( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "adisline":                                                                     // AD              ( A/DisLine )
                      // �������� ����
                     break;
                case "rochange":                                                                     // ROC             ( Price Rate of Change )
                     // �̵���� ����
                     cObj.SetMAofROC( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     cObj.SetSignalMAofROC( IndicatorHandle, IndicatorIntervals [ 1 ]);
                     break;
                case "envolope" :                                                                    // ENVOLOPE        ( Envolope )
                     // �̵���� ����
                     cObj.SetMAofEnvolpe( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // ������
                     cObj.SetCHGofEnvolpe( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     break;
                case "maoscillator":                                                                 // MAO             ( Moving Average Oscillator - Line )
                     // �̵���� ���� - �ܱ� ����
                     cObj.SetSMAofMAO( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // �̵���� ���� - ��� ����
                     cObj.SetLMAofMAO( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     // �̵���� ����
                     cObj.SetMAofMAO( IndicatorHandle, IndicatorIntervals[ 2 ] );
                     break;
                case "stdeviation":                                                                  // STDEV           ( Standard Deviation )
                     // �̵���� ����
                     cObj.SetMAofSTDEV( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "wclose":                                                                       // WC              ( Weighted Close )
                      // �������� ����
                     break;
                case "cvolatility":                                                                  // CV              ( Chaikin's Volatility )
                     // �̵���� ����
                     cObj.SetMAofCV( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // ������
                     cObj.SetCHGofCV( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     break;
                case "mobv":                                                                         // MOBV            (  )
                     // �������� ����
                     break;
                case "bollband":                                                                     // BOLLBAND        ( Bollinger Bands )
                     // �̵���� ����
                     cObj.SetMAofBollBand( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "momentum":                                                                     // MO              ( Momentum )
                     // �̵���� ����
                     cObj.SetMAofMomentum( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "newhighlow":                                                                   // NH_NL           ( New-Hight New-Low )
                      // �������� ����
                     break;
                case "rstrength" :                                                                   // RS              ( ��밭�� )
                     // �̵���� ����
                     cObj.SetMAofRS( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "ema":                                                                          // EMA             ( Exponential Moving Average )
                     // �̵���� ����
                     cObj.SetMAofEMA( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "dmark"   :                                                                     // DMARK           ( D Mark )
                      // �������� ����
                     break;
                case "adx"     :                                                                     // ADX             ( Average Direction Movement Index )
                     // �̵���� ����
                     cObj.SetMAofADX( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "lfi":                                                                          // LFI             (  )
                     // �̵���� ����
                     cObj.SetMAofLFI( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "nco" :                                                                         // NCO             ( Net Change Oscillator )
                     // �̵���� ����
                     cObj.SetMAofNCO( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "sigma" :                                                                       // SIGMA           (  )
                     // �̵���� ����
                     cObj.SetMAofSigma( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "newpsycho":                                                                    // NEWPSYCHO       ( �Žɸ���ǥ )
                     cObj.SetMAofNewPsycho( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "sonar2"   :                                                                    // SONA2           (  )
                     // �̵���� ����
                     cObj.SetMAofSONA2( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "sonar2o" :                                                                     // SONAR2O         ( SONA2 Oscillator )
                     // �̵���� ����
                     cObj.SetMAofSONA2O( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "maostick" :                                                                    // MAOSTICK        ( Moving Average Oscillator - Stick )
                     // �̵���� ���� - �ܱ� ����
                     cObj.SetSMAofMAOS( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // �̵���� ���� - ��� ����
                     cObj.SetLMAofMAOS( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     // �̵���� ����
                     cObj.SetMAofMAOS( IndicatorHandle, IndicatorIntervals[ 2 ] );
                     break;
                case "dmindex" :                                                                     // DMI             ( Directional Movement Index )
                     // �̵���� ����
                     cObj.SetMAofDMI( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "macdoscillator":                                                               // MACDOSC         ( MACD Oscillator )
                     // �̵���� ���� - �ܱ� ����
                     cObj.SetSMAofMACDS ( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // �̵���� ���� - ��� ����
                     cObj.SetLMAofMACDS( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     // �̵���� ���� - signal
                     cObj.SetSIGofMACDS( IndicatorHandle, IndicatorIntervals[ 2 ] );
                     break;
                case "pmaostick":                                                                    // PMAOSTICK       ( Price Moving Average Oscillator - Stick )
                     // �̵���� ���� - �ܱ� ����
                     cObj.SetSMAofPMAOS( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // �̵���� ���� - ��� ����
                     cObj.SetLMAofPMAOS( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     // �̵���� ����
                     //cObj.SetMAofPMAOStickMA( IndicatorHandle, IndicatorIntervals[ 2 ] );
                     // ���� 2006/01/13
                     cObj.SetMAofPMAOS( IndicatorHandle, IndicatorIntervals[ 2 ] );
                     break;
                case "vmaostick":                                                                    // VMAOSTICK       ( Volume Moving Average Oscillator - Stick )
                     // �̵���� ���� - �ܱ� ����
                     cObj.SetSMAofVMAOS( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // �̵���� ���� - ��� ����
                     cObj.SetLMAofVMAOS( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     // �̵���� ����
                     cObj.SetMAofVMAOS( IndicatorHandle, IndicatorIntervals[ 2 ] );
                     break;
                case "stochastics":                                                                  // STOCHASTICS     (  )
                case "stochastics_dw":                                                               // STOCHASTICS_DW  (  )
                     // ���� - [FAST:0 / SLOW:1 (defalut : SLOW)]
                     cObj.SetTypeofStochastics( IndicatorHandle, Iif( ToLower( IndicatorIntervals[ 0 ] ) == "fast", 0, 1 ) );
                     // SLOW �Ⱓ
                     cObj.SetSlowofStochastics( IndicatorHandle, parseInt( IndicatorIntervals[ 1 ] ) );
                     // %K
                     cObj.SetKPRofStochastics( IndicatorHandle, parseInt( IndicatorIntervals[ 2 ] ) );
                     // %D
                     cObj.SetDPRofStochastics( IndicatorHandle, parseInt( IndicatorIntervals[ 3 ] ) );
                     break;
                case "trix":                                                                         // TRIX            (  )
                     // TRIX �̵���� ����
                     cObj.SetMAofTrix( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // �ñ׳� �̵���� ����
                     cObj.SetSignalMAofTrix( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     break;
                case "rcindex":                                                                      // RCIndex         (  )
                     // �̵���� ���� long nMA
                     cObj.SetMAofRCIndex( IndicatorHandle, parseInt( IndicatorIntervals[ 0 ] ) );
                     break;
                case "vwap" :                                                                        // VWAP            (  )
                     // �̵���� ���� long nMA
                     cObj.SetMAofVwap( IndicatorHandle, parseInt( IndicatorIntervals[ 0 ] ) );
                     break;
                case "percentr" :                                                                    // Williams's Percent R (  )
                     // �̵���� �Ⱓ
                     cObj.SetMAofPR( IndicatorHandle, parseInt( IndicatorIntervals[ 0 ] ) );
                     break;
                default :
                     break;
            }
        }
        ds.SetColumn( dsRowIdx, "scaleHandle" , scaleHandle  );
        ds.SetColumn( dsRowIdx, "hScaleHandle", hScaleHandle );

        /********************************************************************************************
         * ��Ʈ ������ ���� ��Ʈ �Ӽ� ����
         ********************************************************************************************/
        chartHandle = cObj.GetChart( cMgr, ( areaHandle + chartOrder ) );
        switch ( ToLower( chartType ) )
        {
            case "americanstick":   // �̱��Ĺ�íƮ
                 cObj.l2SetTitle2( chartHandle, chartTitleList[ 0 ] );
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 //if ( dsChartDetail != null ) initChartAmericanStick( aChartObject, aChartManager, aChartHandle, aDsChartSpec );
                 if ( dsChartDetail != null ) initChartAmericanStick( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "candlestick"  :   // �Ϻ��ĺ���Ʈ ( �α� ��Ʈ ��� ����)
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartCandleStick( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "ccw"          :   // ���ð�
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartCCW( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "eqv"          :   // EQV ( Equivolume Chart )
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartEquivolume( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "groupstick"   :   // �׷츷��
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartGroupStick( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "illmok"       :   // �ϸ����ǥ
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartIllmok( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "linechart":     // ����Ʈ
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) {
                     initChartLine1 ( cObj, cMgr, chartHandle, dsChartDetail );
                 } else {
                     if ( ( lineStylesList[ 0 ] != null ) and ( lineWidthsList[ 0 ] != null ) and ( lineColorsList[ 0 ] != null ) )
                         cObj.plSetLine( chartHandle, toLineStyleValue( lineStylesList[ 0 ] ), lineWidthsList[ 0 ], ToColorValue( lineColorsList[ 0 ], true ) );
                 }
                 break;
            case "line2chart":    // ���׷��� 2
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) {
                     initChartLine2 ( cObj, cMgr, chartHandle, dsChartDetail );
                 } else {
                     if ( ( lineStylesList[ 0 ] != null ) and ( lineWidthsList[ 0 ] != null ) and ( lineColorsList[ 0 ] != null ) )
                         cObj.l2SetLine  ( chartHandle, toLineStyleValue( lineStylesList[ 0 ] ), lineWidthsList[ 0 ], ToColorValue( lineColorsList[ 0 ], true ) );
                     if ( ( lineStylesList[ 1 ] != null ) and ( lineWidthsList[ 1 ] != null ) and ( lineColorsList[ 1 ] != null ) )
                         cObj.l2SetLine2  ( chartHandle, toLineStyleValue( lineStylesList[ 1 ] ), lineWidthsList[ 1 ], ToColorValue( lineColorsList[ 1 ], true ) );
                     if ( chartTitleList[ 0 ] != null )
                         cObj.l2SetTitle ( chartHandle, chartTitleList[ 0 ] );
                     if ( chartTitleList[ 1 ] != null )
                         cObj.l2SetTitle2( chartHandle, chartTitleList[ 1 ] );
                 }
                 break;
            case "line3chart":    // ���׷��� 3
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) {
                     initChartLine3 ( cObj, cMgr, chartHandle, dsChartDetail );
                 } else {
                     if ( ( lineStylesList[ 0 ] != null ) and ( lineWidthsList[ 0 ] != null ) and ( lineColorsList[ 0 ] != null ) )
                         cObj.l3SetLine  ( chartHandle, toLineStyleValue( lineStylesList[ 0 ] ), lineWidthsList[ 0 ], ToColorValue( lineColorsList[ 0 ], true ) );
                     if ( ( lineStylesList[ 1 ] != null ) and ( lineWidthsList[ 1 ] != null ) and ( lineColorsList[ 1 ] != null ) )
                         cObj.l3SetLine2 ( chartHandle, toLineStyleValue( lineStylesList[ 1 ] ), lineWidthsList[ 1 ], ToColorValue( lineColorsList[ 1 ], true ) );
                     if ( ( lineStylesList[ 2 ] != null ) and ( lineWidthsList[ 2 ] != null ) and ( lineColorsList[ 2 ] != null ) )
                         cObj.l3SetLine3 ( chartHandle, toLineStyleValue( lineStylesList[ 2 ] ), lineWidthsList[ 2 ], ToColorValue( lineColorsList[ 2 ], true ) );
                     if ( chartTitleList[ 0 ] != null )
                         cObj.l3SetTitle ( chartHandle, chartTitleList[ 0 ] );
                     if ( chartTitleList[ 1 ] != null )
                         cObj.l3SetTitle2( chartHandle, chartTitleList[ 1 ] );
                     if ( chartTitleList[ 2 ] != null )
                         cObj.l3SetTitle3( chartHandle, chartTitleList[ 2 ] );
                 }
                 break;
            case "mkprofile_dw" :   // Market Profile (����)
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartMarketProfile ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "parabolic"    :   // Parabolic Chart
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartParabolic ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "pnf"          :   // P&F
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartPF ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "pnv"          :   // ���ݴ뺰 �ŷ��� íƮ (Volume at Price Chart)
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartPNV ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "pv"           :   // PVCHART
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartPV ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "radarchart"   :   // ���̴� ��Ʈ
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartRadar ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "ratiostick"   :   // ��������
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartRatio ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "simplestick"  :   // ����׷���
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 cObj.ssSetColor( chartHandle, ToColorValue( lineColorsList[ 0 ], true ), ToColorValue( lineColorsList[ 0 ], true ) );
                 if ( dsChartDetail != null ) initChartSimpleStick ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "simplestickp" :   // ����׷���(���簡)
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartSimpleStickP ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "swing"        :   // Swing
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartSwing ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "threechange"  :   // �Ｑ��ȯ��
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartThreeChange ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
           case "_percentline"  :   // ����� ��Ʈ
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartPercentLine ( cObj, cMgr, chartHandle, dsChartDetail );
                 else {
                     if ( ( lineStylesList[ 0 ] != null ) and ( lineWidthsList[ 0 ] != null ) and ( lineColorsList[ 0 ] != null ) )
                         cObj.l1SetLine( chartHandle, toLineStyleValue( lineStylesList[ 0 ] ), lineWidthsList[ 0 ], ToColorValue( lineColorsList[ 0 ], true ) );
                 }
                 break;
           case "percentline"  :   // ����� ��Ʈ
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartPercentLine ( cObj, cMgr, chartHandle, dsChartDetail );
                cObj.l1SetLine( chartHandle, toLineStyleValue( lineStylesList[ 0 ] ), lineWidthsList[ 0 ], ToColorValue( lineColorsList[ 0 ], true ) );
                 break;
            case "netchart"     :   // �׹���Ʈ
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartNet ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "colorstick"   :   // ���󸷴�
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartColorStick ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "piechart"     :   // ������Ʈ
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartPie( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            default :
                 break;
        }
    }
}

function initChartAmericanStick( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * �̱��Ĺ� ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.asSetTitle( chartHandle, attrItemVal );

    // ���Ӽ� [ long lStyle, long lWidth, long lColor ]
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "lineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "lineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor", "white" ), true );
    cObj.asSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // Min, Max ǥ�� ����- ��Ʈ, Min����, Max���� [ BYTE bDisp true:1 �ִ밪/ false:0 �ּҰ�]
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "TRUE" ) ) == "false", 0, 1 );
    cObj.asSetDispMinMax( chartHandle, attrItemVal );

    // ��Ʈ ��Ÿ�� [ char* szFaceName, long lHeight, long lWeight, BYTE nItalic, BYTE nUnderline, BYTE nStrikeOut ]
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "titleFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "titleFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "titleFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "titleFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "titleFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "titleFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.asSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4,attrItemVal5, attrItemVal6 );

    // ��Ʈ ���� [ long lMax:�ִ밪�� ��� ����, long lMin:�ּҰ��� ��� ���� ]
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.asSetTextColor( chartHandle, attrItemVal, attrItemVal2 );
}

function initChartCandleStick( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * �Ϻ��ĺ� ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.csSetTitle( chartHandle, attrItemVal );

    // ��
    // - bAuto  : ���� ���� �ڵ����� �������� ���ημ�, bAuto�� 1�� ��쿡 ���� ���� �ڵ�ó�� �Ѵ� (DEFAULT :     //;
    // - nWidth : ���� ��
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "autoWidth", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "widthVal", 0 ) );
    cObj.csSetWidth( chartHandle, attrItemVal, attrItemVal2 );

    // �ִ밪, �ּҰ� ��¿��� [ true/false ]
    // - bDisp: bDisp�� true �̸� ���
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.csSetDispMinMax( chartHandle, attrItemVal );
    // ��Ʈ ��Ÿ�� [ char* szFaceName, long lHeight, long lWeight, BYTE nItalic, BYTE nUnderline, BYTE nStrikeOut ]
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "fontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "fontHeight", 10 ) );

    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "fontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "fontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "fontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "fontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.csSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );
    
    // �ִ밪, �ּҰ� ��»��� ����
    // - lMax : �ִ밪�� ��� ����
    // - lMin : �ּҰ��� ��� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.csSetTextColor2( chartHandle, attrItemVal, attrItemVal2 );

    // �� ǥ�� ����
    // - bDisp : bDisp�� 1�̸� �� ��� (DEFAULT : 0) (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayRak", "false" ) ) == "false", 0, 1 );

	//�ӽ÷μ��� 2006/01/12 csSetDispRak �� �޼ҵ�� �����û �س�����
    cObj.csSetDispRak( chartHandle, attrItemVal );
  //cObj.csSetDispLak( chartHandle, attrItemVal );

    // �� ��Ʈ
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "rakFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontStrikeOut", "false" ) ) == "false", 0, 1 );

	//�ӽ÷μ��� 2006/01/12 csSetFontRak �� �޼ҵ�� �����û �س�����
    //cObj.csSetFontRak( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );
	cObj.csSetRakFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // �� ǥ�� ����
    // - long lColor
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "rakColor", "black" ), true );
    cObj.csSetRakTextColor( chartHandle, attrItemVal );

    // ��»��� - ����ä��
    // - lColor : ��º��� ����
    // - bFill  : bFill��  1�̸� ��º��� ���� ä��  (DEFAULT : 0)
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "upTrendColor", "black" ), true );
    attrItemVal2 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "upTrendFill", "true" ) ) == "false", 0, 1 );
    cObj.csSetUpColor( chartHandle, attrItemVal, attrItemVal2 );

    // �϶�����
    // - lColor : �϶����� ����
    // - bFill  : bFill��  1�̸� �϶����� ���� ä��  (DEFAULT : 0)
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "downTrendColor", "black" ), true );
    attrItemVal2 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "downTrendFill", "true" ) ) == "false", 0, 1 );
	//�ӽ÷μ��� 2006/01/12  bFill �Ķ���� �߰� ��û �س�����
    //cObj.csSetDownColor( chartHandle, attrItemVal, attrItemVal ); //�ι�° �Ķ���͸� �����ҽ����� Ʋ����  attrItemVal2 �� ����
    //cObj.csSetDownColor( chartHandle, attrItemVal, attrItemVal2 );
    cObj.csSetDownColor( chartHandle, attrItemVal, attrItemVal2);
}

function initChartCCW ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * ���ð� ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.ccwSetTitle( chartHandle, attrItemVal );

    // ���� ��� ����
    // - bDisp : bDisp�� 1�̸� ���� ��� (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayLegend", "true" ) ) == "false", 0, 1 );
    cObj.ccwSetDispLegend( chartHandle, attrItemVal );

    // ��Ʈ ��Ÿ�� [ char* szFaceName, long lHeight, long lWeight, BYTE nItalic, BYTE nUnderline, BYTE nStrikeOut ]
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "fontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "fontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "fontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "fontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "fontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "fontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.ccwSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // ���� ��Ʈ ���� ����
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "legendColor", "silver" ), true );
    cObj.ccwSetLegendColor( chartHandle, attrItemVal );

    // �̵���ջ�� - ���ð��� �����ʹ� ������ 20�� �̵����
    // - bUse : bUse�� 1�̸�, �̵���� ��� (DEFAULT : 0)
    // - lVal : �̵���հ�
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useMoveAvg"   , "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "moveAvgVal", 0 ) );
    cObj.ccwSetMoveAvg( chartHandle, attrItemVal, attrItemVal2 );

    // ���Ӽ� [ long lStyle, long lWidth, long lColor ]
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "lineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "lineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor1", "silver" ), true );
    attrItemVal4 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor2", "silver" ), true );
    attrItemVal5 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor3", "silver" ), true );
    attrItemVal6 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor4", "silver" ), true );
    attrItemVal7 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor5", "silver" ), true );
    cObj.ccwSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6, attrItemVal7 );

    // ����/����
    // - bDisp  : bDisp�� 1�̸�, ����/���� ���� ǥ��(T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useSEPoint", "false" ) ) == "false", 0, 1 );
    cObj.ccwSetDispPoint( chartHandle, attrItemVal );

    // ����/������ ũ�⸦ �����Ѵ�.
    // - lSize : ����/������ ũ��(1~100)
    attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "SEPointSize", 0 ) );
    cObj.ccwSetPointSize( chartHandle, attrItemVal );

    // �������� ���� �� ���� ����
    // - lStyle : �������� ����["NONE:0","CIRCLE:1","RECT:2"(DEFAULT)]
    // - lColor : �������� ����
    attrItemVal  = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "startPointStyle", "RECT" ) ), "none", 0, "circle", 1, "rect", 2 );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "startPointColor", "black" ), true );
    cObj.ccwSetStartPoint( chartHandle, attrItemVal, attrItemVal2 );

    // ������ ���� �� ���� ����
    // - lStyle : ������ ����["NONE:0","CIRCLE:1","RECT:2"(DEFAULT)]
    // - lColor : ������ ����
    attrItemVal  = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "endPointStyle", "RECT" ) ), "none", 0, "circle", 1, "rect", 2 );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "endPointColor", "black" ), true );
    cObj.ccwSetEndPoint( chartHandle, attrItemVal, attrItemVal2 );
}

function initChartEquivolume( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * Equivolume ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.eqvSetTitle( chartHandle, attrItemVal );

    // ��»��� - ����ä��
    // - lColor : ��� ����
    // - bFill  : bFill��  TRUE�̸� ��º��� ���� ä�� (default : FALSE)
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "upTrendColor", "black" ), true );
    attrItemVal2 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "upDownTrendFill", "true" ) ) == "false", 0, 1 );
    cObj.eqvSetUpColor( chartHandle, attrItemVal, attrItemVal2 );

    // �϶�����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "downTrendColor", "black" ), true );
    cObj.eqvSetDownColor ( chartHandle, attrItemVal );

    // Min-Max ǥ�� ����(T/F)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.eqvSetDispMinMax( chartHandle, attrItemVal );

    // Min-Max ��Ʈ ��Ÿ�� [ char* szFaceName, long lHeight, long lWeight, BYTE nItalic, BYTE nUnderline, BYTE nStrikeOut ]
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.eqvSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // Min-Max ��Ʈ ����
    // - lMax : �ִ밪�� ��� ����
    // - lMin : �ּҰ��� ��� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.eqvSetTextColor( chartHandle, attrItemVal, attrItemVal2 );

    //------------------------------------------------------------------------------
    // �ð迭�Ӽ�
    //------------------------------------------------------------------------------
    // �ð迭���� ǥ�� ����
    // - bDisp : bDisp�� 1�̸� �ð迭 ���� ��¿���(T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayTimeLine", "false" ) ) == "false", 0, 1 );
    cObj.eqvSetDispTimeLine( chartHandle, attrItemVal );

    // �ð迭���� ��Ÿ��
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineLineStyle", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineLineWidth", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineLineColor", "silver" ) );
    cObj.eqvSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // ������ ǥ�� ����(T/F)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useTimeLineGuideLine", "TRUE" ) ) == "false", 0, 1 );
    cObj.eqvSetDispAssistLine( chartHandle, attrItemVal );

    // ������ ��Ÿ�� ���� (�� ��Ÿ��, �β�, ����)
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineGuideLineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineGuideLineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineGuideLineColor", "silver" ), true );
    cObj.eqvSetAssistLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // ���� ���� ����
    // - lBottom : �ϴ� ���� ���� (DEFAULT : 20 )
    // - lLeft   : ���� ���� ���� (DEFAULT : 0  )
    // - lRight  : ���� ���� ���� (DEFAULT : 0  )
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineMarginBottom" , 20 ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineMarginLeft"   , 0  ) );
    attrItemVal3 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineMarginRight"  , 0  ) );
    cObj.eqvSetMargin( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // �ð迭 ��Ʈ [ char* szFaceName, long lHeight, long lWeight, BYTE nItalic, BYTE nUnderline, BYTE nStrikeOut ]
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.eqvSetTimeWndFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // �ð迭���� ��Ʈ ���� ����
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontColor", "black" ), true );
    cObj.eqvSetXTextColor( chartHandle, attrItemVal );
}

function initChartGroupStick( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * �׷츷�� ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;
    var iCnt;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.gsSetTitle( chartHandle, attrItemVal );

    // ���밹��
    // - lNum : ����� ���� ����
    attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "displayStickCount", 4 ) );
    cObj.gsSetStickNum( chartHandle, attrItemVal );
    iCnt = attrItemVal;

    // ���� �ε���
    attrItemVal  = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickIndexs", 0 ), "," );
    // ���� �̸�
    attrItemVal2 = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickTitles", 0 ), "," );
    // ���� ����
    attrItemVal3 = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickColors", 0 ), "," );
    // ���� ä�� ��Ÿ��
    attrItemVal4 = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickFillStyle", 0 ), "," );

    for ( i = 0; i < iCnt; i++ )
    {
        // ����Ӽ� - �̸�, ����, ����
        // - lIdx       : ���� �ε���
        // - szName     : ���� �̸�
        // - lColor     : ���� ����
        // - lFillStyle : ���� ä�� ��Ÿ�� ( DEFAULT:FILL )
        //               (0.HORIZONTAL, 1.VERTICAL, 2.FDIAGONAL, 3.BDIAGONAL, 4.CROSS, 5.DIACROSS, 6.FILL)
        cObj.gsSetStick( chartHandle, parseInt( attrItemVal[ i ] ), attrItemVal2[ i ], ToColorValue( attrItemVal3[ i ], true ), toFillStyleValue( attrItemVal4[ i ] ) );
    }

    // ������ - �ڵ�����
    // - bAuto  : bAuto�� 1�̸� ������ �ڵ� ����
    // - lWidth : ������ ��
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "autoWidth", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "widthVal", 0 ) );
    cObj.gsSetWidth( chartHandle, attrItemVal, attrItemVal2 );

    // ���� ǥ�� ����(T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayLegend", "true" ) ) == "false", 0, 1 );
    cObj.gsSetDispLegend( chartHandle, attrItemVal );

    // ���� �۲� ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "legendFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.gsSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // �׷츷�� ǥ�� ���(2D/3D)
    // - bType : lType�� 0�̸� 2D, 1�̸� 3D (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "demension", "2D" ) ) == "2d", 0, 1 );
    cObj.gsSetDemension( chartHandle, attrItemVal );

    // 3D ���û��� - ����, ����, ����
    // - bAuto  : bAuto�� 1�̸� ����, ����, ������ �ڵ����� �����ȴ�
    // - nSlop  : ���� 3D �׸��ڿ��� ����
    // - nDepth : ����->����ʺ� ���
    // - nShad  : ����
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "use3DAuto", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "slop3D" , 20 ) );
    attrItemVal3 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "depth3D", 4  ) );
    attrItemVal4 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "shad3D" , 30 ) );
    cObj.gsSet3DStyle( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4 );

    // �������� ���� ����(T/F)
    // - bSetStart : bSetStart�� 1�̸� �׷����� �������� �����
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "alignStartPoint", "false" ) ) == "false", 0, 1 );
    cObj.gsSetStartPoint( chartHandle, attrItemVal );

    // Data�� ǥ�� ����(T/F)
    // - bDisp : bDisp�� 1�̸� �ش� ������ ���� ����Ѵ� (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayDataTitle", "false" ) ) == "false", 0, 1 );
    cObj.gsSetDispValue( chartHandle, attrItemVal );
}

function initChartIllmok( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * �ϸ����ǥ ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.imSetTitle( chartHandle, attrItemVal );

    // ��Ʈ���� ��¿��� (T/F)
    // - bDisp : bDisprk 1�̸� ��Ʈ ���� ���� ��� (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayLegend", "true" ) ) == "false", 0, 1 );
    cObj.imSetDispLegend( chartHandle, attrItemVal );

    // ���ؼ� - ����, ����, ����
    // - lStyle : ���ؼ� ��Ÿ�� (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : ���ؼ��� �� (DEFAULT :     //
    // - lColor : ���ؼ��� ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "baseLineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "baseLineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "baseLineColor", "white" ), true );
    cObj.imSetBaseLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // ��ȯ�� - ����, ����, ����
    // - lStyle : ��ȯ�� ��Ÿ�� (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : ��ȯ���� �� (DEFAULT :     //
    // - lColor : ���Ѽ��� ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "turnLineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "turnLineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "turnLineColor", "white" ), true );
    cObj.imSetTurnLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // ������(���) - ä���, ����
    // - lFillStyle : ������ ä�� ��Ÿ�� (DEFAULT : FILL)
    //                (0.HORIZONTAL, 1.VERTICAL, 2.FDIAGONAL, 3.BDIAGONAL, 4.GROSS, 5.DIAGCROSS, 6.FILL)
    // - lColor     : ������ ä�� ����

    attrItemVal  = toFillStyleValue( getAttributeVal( ds, "attributeId", "attributeVal", "yangunFillStyle", "FILL" ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "yangunColor", "black" ), true );
    cObj.imSetYangunFill( chartHandle, attrItemVal, attrItemVal2 );

    // ������(����) - ä���, ����
    // - lFillStyle : ������ ä�� ��Ÿ�� (DEFAULT : FILL)
    //                (0.HORIZONTAL, 1.VERTICAL, 2.FDIAGONAL, 3.BDIAGONAL, 4.GROSS, 5.DIAGCROSS, 6.FILL)
    // - lColor     : ������ ä�� ����
    attrItemVal  = toFillStyleValue( getAttributeVal( ds, "attributeId", "attributeVal", "umunFillStyle", "FILL" ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "umunColor", "black" ), true );
    cObj.imSetUmunFill( chartHandle, attrItemVal, attrItemVal2 );

    // ���ེ�� - ����, ����, ����
    // - lStyle : ���ེ�Ҽ� ��Ÿ�� (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : ���ེ�Ҽ��� ��
    // - lColor : ���ེ�Ҽ��� ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "backSpanLineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "backSpanLineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "backSpanLineColor", "white" ), true );
    cObj.imSetBackLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // ���ེ��1 - ����, ����, ����
    // - lStyle : ���ེ��1�� ��Ÿ�� (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : ���ེ��1���� ��
    // - lColor : ���ེ��1���� ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "foreSpanLine1Style", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "foreSpanLine1Width", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "foreSpanLine1Color", "white" ), true );
    cObj.imSetForeLine1( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // ���ེ��2 - ����, ����, ����
    // - lStyle : ���ེ��2�� ��Ÿ�� (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : ���ེ��2���� ��
    // - lColor : ���ེ��2���� ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "foreSpanLine2Style", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "foreSpanLine2Width", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "foreSpanLine2Color", "white" ), true );
    cObj.imSetForeLine2( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );
}

function initChartLine1 ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.l1SetTitle( chartHandle, attrItemVal );

    // Data�� Point ǥ�� - ����(��, �簢, ����)
    // - bDisp : bDisp�� 1�̸� data�� point�� ǥ���Ѵ� (DEFAULT : 0)
    // - lType : 0�̸� ��, 1�̸� �簢��, 2�� ����
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDataPoint", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "dataPointStyle", "NONE" ) ), "circle", 0, "rect", 1, "none", 2 );
    cObj.l1SetDispPoint( chartHandle, attrItemVal, attrItemVal2 );

    // �ִ�/�ּҰ� ��� ����(T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.l1SetDispMinMax( chartHandle, attrItemVal );

    // ����/�ְ� ��Ʈ �Ӽ�
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.l1SetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // ����/�ְ� ��Ʈ ����
    // - lMax : �ִ밪�� ��� ����
    // - lMin : �ּҰ��� ��� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.l1SetTextColor( chartHandle, attrItemVal, attrItemVal2 );

    // ����/ħü ǥ�� ���� (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayHotCold"   , "false" ) ) == "false", 0, 1 );
    cObj.l1SetDispHotCold( chartHandle, attrItemVal );

    // ���� ��谪 �� ����
    // - lValue : ���� ��谪
    // - lColor : ���� ����
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "hotVal", 100 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "hotColor", "black" ), true );
    cObj.l1SetHotValue( chartHandle, attrItemVal, attrItemVal2 );

    // ħü  ��谪 �� ����
    // - lValue : ħü ��谪
    // - lColor : ħü ����
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "coldVal", -100 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "coldColor", "black" ), true );
    cObj.l1SetColdValue( chartHandle, attrItemVal, attrItemVal2 );

    // 0�� ���� ���� (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "ignoreZeroVal", "false" ) ) == "false", 0, 1 );
    cObj.l1SetZeroValue( chartHandle, attrItemVal );

    // ���Ӽ� - ����, ����, ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "line1Style", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "line1Width", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "line1Color", "silver" ) );
    cObj.l1SetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );
}

function initChartLine2 ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * ���׷���2 ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // ��Ʈ������ ����� ù��° ���׷�����Ʈ�� ����
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title1" , "" );
    cObj.l2SetTitle( chartHandle, attrItemVal );

    // ��Ʈ������ ����� �ι�° ���׷�����Ʈ�� ����
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title2" , "" );
    cObj.l2SetTitle2( chartHandle, attrItemVal );

    // Data�� Point ǥ�� - ����(��, �簢, ����)
    // - bDisp : bDisp�� 1�̸� data�� point�� ǥ���Ѵ� (DEFAULT : 0)
    // - lType : 0�̸� ��, 1�̸� �簢��, 2�� ����
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDataPoint", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "dataPointStyle", "NONE" ) ), "circle", 0, "rect", 1, "none", 2 );
    cObj.l2SetDispPoint( chartHandle, attrItemVal, attrItemVal2 );

    // �ִ�/�ּҰ� ��� ����(T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.l2SetDispMinMax( chartHandle, attrItemVal );

    // ����/�ְ� ǥ�� - ��Ʈ
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.l2SetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // ����/�ְ� ǥ�� - ����
    // - lMax : �ִ밪�� ��� ����
    // - lMin : �ּҰ��� ��� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.l2SetTextColor( chartHandle, attrItemVal, attrItemVal2 );

    // ����/ħü ǥ�� ���� (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayHotCold", "false" ) ) == "false", 0, 1 );
    cObj.l2SetDispHotCold( chartHandle, attrItemVal );

    // ���� ��谪 �� ���� ����
    // - lValue : ���� ��谪
    // - lColor : ���� ����
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "hotVal", 100 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "hotColor", "black" ), true );
    cObj.l2SetHotValue( chartHandle, attrItemVal, attrItemVal2 );

    // ħü ��谪 �� ���� ����
    // - lValue : ħü ��谪
    // - lColor : ħü ����
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "coldVal", -100 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "coldColor", "black" ), true );
    cObj.l2SetColdValue( chartHandle, attrItemVal, attrItemVal2 );

    // 0�� ���� ���� (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "ignoreZeroVal", "false" ) ) == "false", 0, 1 );
    cObj.l2SetZeroValue( chartHandle, attrItemVal );

    // ���Ӽ�1 - ����, ����, ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "line1Style", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "line1Width", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "line1Color", "silver" ) );
    cObj.l2SetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // ���Ӽ�2 - ����, ����, ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "line2Style", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "line2Width", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "line2Color", "silver" ) );
    cObj.l2SetLine2( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );
}

function initChartLine3 ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * ���׷���3 ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // ��Ʈ������ ����� ù��° ���׷�����Ʈ�� ����
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title1" , "" );
    cObj.l3SetTitle( chartHandle, attrItemVal );

    // ��Ʈ������ ����� �ι�° ���׷�����Ʈ�� ����
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title2" , "" );
    cObj.l3SetTitle2( chartHandle, attrItemVal );

    // ��Ʈ������ ����� ����° ���׷�����Ʈ�� ����
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title3" , "" );
    cObj.l3SetTitle3( chartHandle, attrItemVal );

    // Data�� Point ǥ�� - ����(��, �簢, ����)
    // - bDisp : bDisp�� 1�̸� data�� point�� ǥ���Ѵ� (DEFAULT : 0)
    // - lType : 0�̸� ��, 1�̸� �簢��, 2�� ����
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDataPoint", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "dataPointStyle", "NONE" ) ), "circle", 0, "rect", 1, "none", 2 );
    cObj.l3SetDispPoint( chartHandle, attrItemVal, attrItemVal2 );

    // 0�� ����
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "ignoreZeroVal", "false" ) ) == "false", 0, 1 );
    cObj.l3SetZeroValue( chartHandle, attrItemVal );

    // �ִ�/�ּҰ� ��� ����(T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.l3SetDispMinMax( chartHandle, attrItemVal );

    // �ִ밪, �ּҰ��� ��Ʈ ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.l3SetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // �ִ밪, �ּ���� ���� ����
    // - lMax : �ִ밪�� ��� ����
    // - lMin : �ּҰ��� ��� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.l3SetTextColor( chartHandle, attrItemVal, attrItemVal2 );

    // // ����/ħü ǥ�� ���� (T/F)
    // attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayHotCold", "false" ) ) == "false", 0, 1 );
    // cObj.l3SetDispHotCold( chartHandle, attrItemVal );

    // // ���� ��谪 �� ���� ����
    // // - lValue : ���� ��谪
    // // - lColor : ���� ����
    // attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "hotVal", 100 ) );
    // attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "hotColor", "black" ), true );
    // cObj.l3SetHotValue( chartHandle, attrItemVal, attrItemVal2 );

    // // ħü ��谪 �� ���� ����
    // // - lValue : ���� ��谪
    // // - lColor : ���� ����
    // attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "coldVal", -100 ) );
    // attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "coldColor", "black" ), true );
    // cObj.l3SetColdValue( chartHandle, attrItemVal, attrItemVal2 );

    // ���Ӽ�1 - ����, ����, ����
    // - lStyle : ���׷���1�� ��Ÿ�� (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : ���׷���1�� ��
    // - lColor : ���׷���1�� ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "line1Style", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "line1Width", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "line1Color", "silver" ) );
    cObj.l3SetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // ���Ӽ�2 - ����, ����, ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "line2Style", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "line2Width", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "line2Color", "silver" ) );
    cObj.l3SetLine2( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // ���Ӽ�3 - ����, ����, ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "line3Style", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "line3Width", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "line3Color", "silver" ) );
    cObj.l3SetLine3( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );
}

function initChartMarketProfile ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * Market Profile(DW) ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.mpSetTitle( chartHandle, attrItemVal );

    // �ؽ�Ʈ����
    // - lColor : �ؽ�Ʈ ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "textColor", "black" ), true );
    cObj.mpSetTextColor( chartHandle, attrItemVal );

    // ���� ��� ����
    // - lColor : ���� ��� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "titleBkColor", "black" ), true );
    cObj.mpSetTitleColor( chartHandle, attrItemVal );

    // ������ ������
    // - lColor : ������ ��� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "dataBkColor", "black" ), true );
    cObj.mpSetDataColor( chartHandle, attrItemVal );

    // �ش� ������
    // - lColor : �ش� ��� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "extremeBkColor", "black" ), true );
    cObj.mpSetExtremeColor( chartHandle, attrItemVal );

    // TPO ������
    // - lColor : TOP ��� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "tpoBkColor", "black" ), true );
    cObj.mpSetTPOColor( chartHandle, attrItemVal );

    // �߽ɰ��� ������
    // - lColor : �߽ɰ��� ��� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "priceBkColor", "black" ), true );
    cObj.mpSetPriceColor( chartHandle, attrItemVal );

    // �ŵ�/�ż� ������
    // - lColor : �ŵ�/�ż� ��� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "saleBuyBkColor", "black" ), true );
    cObj.mpSetSaleBuyColor( chartHandle, attrItemVal );

    // �۲�
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "fontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "fontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "fontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "fontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "fontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "fontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.mpSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );
}

function initChartParabolic ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * Parabolic ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.prSetTitle( chartHandle, attrItemVal );

    // ��ǥ�� - ����, ����, ����
    // - lStyle : �� ��Ÿ�� (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : ���� ��
    // - lColor : ���� ����
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "lineWidth", 1 );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor", "silver" ) );
    cObj.prSetLine( chartHandle, attrItemVal, attrItemVal2);


}

function initChartPF ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * P&F ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.pnfSetTitle( chartHandle, attrItemVal );

    // O/X - ��������, ��»���, �϶�����, ������ڻ���, �϶����ڻ���
    // - lPrice        : ��������
    // - lUpColor      : ��±׷����� ����
    // - lDownColor    : �϶��׷����� ����
    // - lUpDayColor   : ������ڻ���
    // - lDownDayColor : �϶����ڻ���
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "unitPrice", 300 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "upColor"     , "black" ), true );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "downColor"   , "black" ), true );
    attrItemVal4 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "upDayColor"  , "black" ), true );
    attrItemVal5 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "downDayColor", "black" ), true );
    cObj.pnfSetOX( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5 );
}

function initChartPNV ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * ���ݴ뺰 �ŷ���(Volume at Price Chart) ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.pnvSetTitle( chartHandle, attrItemVal );

    // ���� - �β�, �β� �ڵ�����
    // - bAuto  : bAuto�� 0�̸� ������ �ڵ�����
    // - lWidth : ������ ��
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "autoWidth", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "widthVal", 0 ) );
    cObj.pnvSetWidth( chartHandle, attrItemVal, attrItemVal2 );

    // ���� - ����
    // - lColor : ����׷����� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "stickColor", "black" ), true );
    cObj.pnvSetStickColor( chartHandle, attrItemVal );

    // ���� - �ŷ��� ������ ǥ�� ����(T/F)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "possessionRate", "false" ) ) == "false", 0, 1 );
    cObj.pnvSetDispValue( chartHandle, attrItemVal );

    // ���� - �ŷ��������� ��Ʈ
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "posRateFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "posRateFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "posRateFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "posRateFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "posRateFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "posRateFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.pnvSetShareFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // �� ǥ�� ���� (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayLine", "false" ) ) == "false", 0, 1 );
    cObj.pnvSetDispLine( chartHandle, attrItemVal );

    // ���� �Ӽ� ����
    // - lStyle : �� ��Ÿ�� (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : ���� ��
    // - lColor : ���� ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "lineStyle", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "lineWidth", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor", "silver" ) );
    cObj.pnvSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // �ִ�/�ּҰ� ��� ����(T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.pnvSetDispMinMax( chartHandle, attrItemVal );

    // �ִ밪, �ּҰ��� ��Ʈ ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.pnvSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // �ִ밪, �ּҰ��� ��� ����
    // - lMax : �ִ밪�� ��� ����
    // - lMin : �ּҰ��� ��� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.pnvSetTextColor( chartHandle, attrItemVal, attrItemVal2 );
}

function initChartPV ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * PV ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title", "" );
    cObj.pvSetTitle( chartHandle, attrItemVal );

    // ���Ӽ�(����, ����, ����)
    // - lStyle            : �� ��Ÿ�� (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth            : ���� �� (DEFAULT :     //
    // - lColor1           : ��1�� ����
    // - lColor2           : ��2�� ����
    // - lColor3           : ��3�� ����
    // - lColor4           : ��4 �� ����
    // - lColor5           : ��5 �� ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "lineStyle", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "lineWidth", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor1", "silver" ) );
    attrItemVal4 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor2", "silver" ) );
    attrItemVal5 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor3", "silver" ) );
    attrItemVal6 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor4", "silver" ) );
    attrItemVal7 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor5", "silver" ) );
    cObj.pvSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6, attrItemVal7 );

    // ����/���� ����ǥ�� ���� ����
    // - bDisp : bDisp�� 1�̸�, ����/���� ���� ǥ��
    // - lSize : ����/���� ũ��
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useSEPoint", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "SEPointSize", 0 ) );
    cObj.pvSetDispPoint( chartHandle, attrItemVal, attrItemVal2 );

    // ������ ��Ÿ�� �� ���� ����
    // - lStyle : �������� ����(����, ��, �簢, DEFAULT : ����)
    // - lColor : �������� ����
    attrItemVal  = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "startPointStyle", "RECT" ) ), "none", 0, "circle", 1, "rect", 2 );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "startPointColor", "black" ), true );
    cObj.pvSetStartPoint( chartHandle, attrItemVal, attrItemVal2 );

    // ���� ��Ÿ�� �� ���� ����
    // - lStyle : ������ ����(����, ��, �簢, DEFAULT : ����)
    // - lColor : ������ ����
    attrItemVal  = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "endPointStyle", "RECT" ) ), "none", 0, "circle", 1, "rect", 2 );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "endPointColor", "black" ), true );
    cObj.pvSetEndPoint( chartHandle, attrItemVal, attrItemVal2 );

    // �̵���ջ�� ����(T/F)
    // - bUse : bUse�� 1�̸� �̵���� ��� (DEFAULT : 0)
    // - lVal : �̵����
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useMoveAvg"   , "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "moveAvgVal", 0 ) );
    cObj.pvSetMoveAvg( chartHandle, attrItemVal, attrItemVal2 );
}

function initChartRadar ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * ���̴��׷��� ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // ��� - ����
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title", "" );
    cObj.rcSetTitle( chartHandle, attrItemVal );

    // ��� - Ÿ��Ʋ ��Ʈ ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "bkTitleFontFaceName " , "default" );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "bkTitleFontHeight"   , 10          );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "bkTitleFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "bkTitleFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "bkTitleFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "bkTitleFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.rcSetBackFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // ��� - Ÿ��Ʋ ��Ʈ ����
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "bkTitleFontColor", "black" ), true );
    cObj.rcSetBackTextColor( chartHandle, attrItemVal );

    // ���� - ����/����/��ռ� ����
    // ( 0~9: ���λ���, 11: ���̻���, 12:��ռ� ���� )
    // - nCnt   : �ε���
    // - lIndex : ����ȣ
    for ( i = 1; i < 13; i++ )
    {
        attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", ( "foreLineColor" + i ), "black" ), true );
        cObj.rcSetColor( chartHandle, i, attrItemVal );
    }

    // ���� - ���� �ؽ�Ʈ ��Ʈ ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "foreTextFontFaceName " , "default" );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "foreTextFontHeight"   , 10          );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "foreTextFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "foreTextFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "foreTextFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "foreTextFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.rcSetForeFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // ���� - ���� �ؽ�Ʈ ��Ʈ ����
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "foreTextFontColor", "black" ), true );
    cObj.rcSetForeTextColor( chartHandle, attrItemVal );
}

function initChartRatio ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * �������� ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.rsSetTitle( chartHandle, attrItemVal );

    // ���������� �׸񰹼� (�ִ�: 20��)
    // - lNum : �׸񰹼�
    attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "displayStickCount", 4 ) );
    cObj.rsSetStickNum( chartHandle, attrItemVal );
    iCnt = attrItemVal;

    // ���� �ε���
    attrItemVal  = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickIndexs", 0 ), "," );
    // ���� �̸�
    attrItemVal2 = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickTitles", 0 ), "," );
    // ��� ���� ����
    attrItemVal3 = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickUpColors", 0 ), "," );
    // ���� ���� ����
    attrItemVal4 = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickDownColors", 0 ), "," );
    // ���� ä�� ��Ÿ��
    attrItemVal5 = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickFillStyles", 0 ), "," );

    for ( i = 0; i < iCnt; i++ )
    {
        // �׸�2�Ӽ� - �̸�, ����, ����
        // - lIdx       : ���� �ε���
        // - szName     : ���� �̸�
        // - lColor     : ���� ���� (��� or ���� ����)
        // - lFillStyle : ���� ä��� ��Ÿ�� (DEFAULT : FILL)
        //                (0.HORIZONTAL, 1.VERTICAL, 2.FDIAGONAL, 3.BDIAGONAL, 4.GROSS, 5.DIAGCROSS, 6.FILL)
        cObj.rsSetStick2( chartHandle, parseInt( attrItemVal[ i ] ), attrItemVal2[ i ], ToColorValue( attrItemVal3[ i ], true ), ToColorValue( attrItemVal4[ i ], true ), toFillStyleValue( attrItemVal5[ i ] ) );
    }

    // ������ - �ڵ�����
    // - bAuto  : bAuto�� FALSE�� ��쿡 nWidth�� �ǹ̰� �ִ� (default : TRUE).
    // - lWidth : ������ ��
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "autoWidth", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "widthVal", 0 ) );
    cObj.rsSetWidth( chartHandle, attrItemVal, attrItemVal2 );

    // ����ǥ�� ����(T/F)
    // - bDisp : bDisp�� 1�̸� ���� ǥ��
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayLegend", "true" ) ) == "false", 0, 1 );
    cObj.rsSetDispLegend( chartHandle, attrItemVal );

    // ���� �۲� ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "legendFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.rsSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // ǥ�����(2D Chart, 3D Chart)
    // - bType : lType�� 0�̸� 2D, 1�̸� 3D (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "demension", "2D" ) ) == "2d", 0, 1 );
    cObj.rsSetDemension( chartHandle, attrItemVal );

    // 3D ���û��� - ����, ����, ����
    // - bAuto  : bAuto�� 1�̸� ����, ����, ������ �ڵ����� �����ȴ�
    // - nSlop  : ���� 3D �׸��ڿ��� ����
    // - nDepth : ����->����ʺ� ���
    // - nShad  : ����
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "use3DAuto", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "slop3D" , 20 ) );
    attrItemVal3 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "depth3D", 4  ) );
    attrItemVal4 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "shad3D" , 30 ) );
    cObj.rsSet3DStyle( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4 );

    // ������� (����/����)
    // - bType : bType�� 0�̸� ����, 1�̸� ���ι���
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "direction", "H" ) ) == "h", 0, 1 );
    cObj.rsSetDirection( chartHandle, attrItemVal );

    // �������� ���� ����(T/F)
    // - bSetStart : bSetStart�� 1�̸� �׷����� �������� �����
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "alignStartPoint", "false" ) ) == "false", 0, 1 );
    cObj.rsSetStartPoint( chartHandle, attrItemVal );

    // ����/�� ���ػ�� ���� [ 0:����,1:�� ]
    // - bUseValueScale : (0:����,1:��)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "baseDiv", "RATE" ) ) == "rate", 0, 1 );
    cObj.rsSetValueScale( chartHandle, attrItemVal );
}

function initChartSimpleStick ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * ����׷��� ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.ssSetTitle( chartHandle, attrItemVal );

    // ǥ�����(2D Chart, 3D Chart)
    // - bType : lType�� 0�̸� 2D, 1�̸� 3D (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "demension", "2D" ) ) == "2d", 0, 1 );
    cObj.ssSetDemension( chartHandle, attrItemVal );

    // �������(����, ����)
    // - bType : bType�� 0�̸� ����, 1�̸� ���ι���
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "direction", "H" ) ) == "h", 0, 1 );
    cObj.ssSetDirection( chartHandle, attrItemVal );

    // ������ - �ڵ�����
    // - bAuto  : bAuto�� FALSE�� ��쿡 nWidth�� �ǹ̰� �ִ� (default : TRUE).
    // - lWidth : ������ ��
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "autoWidth", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "widthVal", 0 ) );
    cObj.ssSetWidth( chartHandle, attrItemVal, attrItemVal2 );

    // �����(��, ��) ���� ����
    // - lPositiveColor : positive ���� ����
    // - lNegativeColor : negative ���� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "positiveColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "negativeColor", "black" ), true );
    cObj.ssSetColor( chartHandle, attrItemVal, attrItemVal2 );

    // ����׷����� ����, ����, ������ ����
    // - bAuto  : bAuto�� 1�̸� ����, ����, ������ �ڵ����� �����ȴ�
    // - nSlop  : ���� 3D �׸��ڿ��� ����
    // - nDepth : ����->����ʺ� ���
    // - nShad  : ����
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "use3DAuto", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "slop3D" , 20 ) );
    attrItemVal3 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "depth3D", 4  ) );
    attrItemVal4 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "shad3D" , 30 ) );
    cObj.ssSet3DStyle( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4 );

    // �������� �ּҰ��� 0���� ���� ����(T/F)
    // - bZero : bZero�� 1�̸� �������� �ּҰ��� 0���� ���� (DEFAULT : 0)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleMinValuZero", "false" ) ) == "false", 0, 1 );
    cObj.ssSetScale( chartHandle, attrItemVal );

    // �������� ����
    // - bSetStart : bSetStart�� 1�̸� �׷����� �������� ����
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "alignStartPoint", "false" ) ) == "false", 0, 1 );
    cObj.ssSetStartPoint( chartHandle, attrItemVal );

    // �ŷ����� ���
    // - bDisp  : TRUE�̸� �ŷ����� ��� (DEFAULT : 0)
    // - lColor : bDisp�� TRUE�� ��쿡�� �ǹ̰� �ִ�
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayRateVal", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "rateValColor", "black" ), true );
    cObj.ssSetDispRateVal( chartHandle, attrItemVal, attrItemVal2 );

    // ��������� �������� ����
    // - bSvr : TRUE�̸� ���� ������ �������� ���� (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "dependServerStickColor", "false" ) ) == "false", 0, 1 );
    cObj.ssSetColorFromSvr( chartHandle, attrItemVal );
}

function initChartSimpleStickP ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * ����׷���(���簡) ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.spSetTitle( chartHandle, attrItemVal );

    // ǥ�����(2D Chart, 3D Chart)
    // - bType : lType�� 0�̸� 2D, 1�̸� 3D (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "demension", "2D" ) ) == "2d", 0, 1 );
    cObj.spSetDemension( chartHandle, attrItemVal );

    // �������(����, ����)
    // - bType : bType�� 0�̸� ����, 1�̸� ���ι���
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "direction", "H" ) ) == "h", 0, 1 );
    cObj.spSetDirection( chartHandle, attrItemVal );


    // ������ - �ڵ�����
    // - bAuto  : bAuto�� FALSE�� ��쿡 nWidth�� �ǹ̰� �ִ� (default : TRUE).
    // - lWidth : ������ ��
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "autoWidth", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "widthVal", 0 ) );
    cObj.spSetWidth( chartHandle, attrItemVal, attrItemVal2 );

    // �����(��, ��)
    // -lPositiveColor : positive �������
    // -lNegativeColor : negative �������
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "positiveColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "negativeColor", "black" ), true );
    cObj.spSetColor( chartHandle, attrItemVal, attrItemVal2 );

    // 3D ���û��� -3D Auto, ����, ����, ����
    // - bAuto  : bAuto�� 1�̸� ����, ����, ������ �ڵ����� �����ȴ�
    // - nSlop  : ���� 3D �׸��ڿ��� ����
    // - nDepth : ����->����ʺ� ���
    // - nShad  : ����
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "use3DAuto", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "slop3D" , 20 ) );
    attrItemVal3 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "depth3D", 4  ) );
    attrItemVal4 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "shad3D" , 30 ) );
    cObj.spSet3DStyle( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4 );

    // �������� �ּҰ��� 0���� ��������(T/F)
    // - bZero : bZero�� 1�̸� �������� �ּҰ��� 0���� ���� (DEFAULT : 0)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleMinValuZero", "false" ) ) == "false", 0, 1 );
    cObj.spSetScale( chartHandle, attrItemVal );

    // ����׷���(���簡)�� �������� ������ ���θ� ����
    // - bSetStart : bSetStart�� 1�̸� �׷����� �������� �����
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "alignStartPoint", "false" ) ) == "false", 0, 1 );
    cObj.spSetStartPoint( chartHandle, attrItemVal );

    // �ŷ����� ���
    // - bDisp  : TRUE�̸� �ŷ����� ��� (DEFAULT : 0)
    // - lColor : bDisp�� TRUE�� ��쿡�� �ǹ̰� �ִ�
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayRateVal", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "rateValColor", "black" ), true );
    cObj.spSetDispRateVal( chartHandle, attrItemVal, attrItemVal2 );

    // ��������� �������� ���� ����(T/F)
    // - bSvr : TRUE�̸� ���� ������ �������� ���� (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "dependServerStickColor", "false" ) ) == "false", 0, 1 );
    cObj.spSetColorFromSvr( chartHandle, attrItemVal );
}

function initChartSwing ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * Swing ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.scSetTitle( chartHandle, attrItemVal );

    // ������ - ��������, ��»���, �϶�����, �������, �϶�����
    // - lPricee       : ��������  (300) 0~999999999
    // - lUpColor      : ��� ����
    // - lDownColor    : �϶� ����
    // - lUpDayColor   : ������ڻ���
    // - lDownDayColor : �϶����ڻ���
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "unitPrice", 300 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "upColor"     , "black" ), true );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "downColor"   , "black" ), true );
    attrItemVal4 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "upDayColor"  , "black" ), true );
    attrItemVal5 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "downDayColor", "black" ), true );
    cObj.scSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5 );

    // �ִ�/�ּҰ� ��� ����(T/F)
    // - bDisp : bDisp�� 1�̸� �ִ밪, �ּҰ� ���
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.scSetDispMinMax( chartHandle, attrItemVal );

    // �ִ�/�ּҰ� ��Ʈ ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.scSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // �ִ�/�ּҰ� ��Ʈ ���� ����
    // - lMax : �ִ밪�� ��� ����
    // - lMin : �ּҰ��� ��� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.scSetTextColor( chartHandle, attrItemVal, attrItemVal2 );

    // �� ��� ����(T/F)
    // - bDisp : bDisp�� 1�̸� �� ��� (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayRak", "false" ) ) == "false", 0, 1 );
    cObj.scSetDispRak( chartHandle, attrItemVal );

    // ���� ��Ʈ�� ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "rakFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.scSetRakFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // ���� ��Ʈ ���� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "rakColor", "black" ), true );
    cObj.scSetRakTextColor( chartHandle, attrItemVal );
}

function initChartThreeChange ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * �Ｑ��ȯ�� ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.tcSetTitle( chartHandle, attrItemVal );

    // ���� - ��»���, �϶�����, �������, �϶�����
    // - lWidth        : ������    (1) 0~999999999
    // - lUpColor      : ��� ����
    // - lDownColor    : �϶� ����
    // - lUpDayColor   : ������ڻ���
    // - lDownDayColor : �϶����ڻ���
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "stickWidth", 1 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "upColor"     , "black" ), true );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "downColor"   , "black" ), true );
    attrItemVal4 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "upDayColor"  , "black" ), true );
    attrItemVal5 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "downDayColor", "black" ), true );
    cObj.tcSetBar( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5 );

    // �ִ�/�ּҰ� ��� ����(T/F)
    // - bDisp : bDisp�� 1�̸� �ִ밪, �ּҰ� ���
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.tcSetDispMinMax( chartHandle, attrItemVal );

    // �ִ밪, �ּҰ��� ��Ʈ�� ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.tcSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // �ִ밪, �ּҰ��� ��Ʈ ���� ����
    // - lMax : �ִ밪�� ��� ����
    // - lMin : �ּҰ��� ��� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.tcSetTextColor( chartHandle, attrItemVal, attrItemVal2 );

    // �� ��� ����(T/F)
    // - bDisp : bDisp�� 1�̸� �� ��� (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayRak", "false" ) ) == "false", 0, 1 );
    cObj.tcSetDispRak( chartHandle, attrItemVal );

    // �� ��Ʈ ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "rakFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.tcSetRakFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // �� ��Ʈ ���� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "rakColor", "black" ), true );
    cObj.tcSetRakTextColor( chartHandle, attrItemVal );
}

function initChartPercentLine ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * ����� ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.plSetTitle( chartHandle, attrItemVal );

    // Data�� Point ǥ�� ����
    // - bDisp	: Data�� Point ǥ�� ����
    // - lType	: Point ���� (0:�簢��, 1:��, 2:����)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDataPoint", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "dataPointStyle", "NONE" ) ), "circle", 0, "rect", 1, "none", 2 );
    cObj.plSetDispPoint( chartHandle, attrItemVal , attrItemVal2 );

    // �ִ밪, �ּҰ� ǥ�� ���ο���
    // - bDisp : �ִ밪, �ּҰ� ǥ�ÿ���(0�� �ƴϸ� ǥ��)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.plSetDispMinMax( chartHandle, attrItemVal );

    // �ִ밪, �ּҰ��� ��Ʈ ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.plSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // ����/�ְ� ��Ʈ ����
    // - lMax : �ִ밪�� ��� ����
    // - lMin : �ּҰ��� ��� ����
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.plSetTextColor( chartHandle, attrItemVal, attrItemVal2 );

    // ����/ħü ǥ�� ���� (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayHotCold"   , "false" ) ) == "false", 0, 1 );
    cObj.plSetDispHotCold( chartHandle, attrItemVal );

    // ���� ��谪 �� ����
    // - lValue : ���� ��谪
    // - lColor : ���� ����
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "hotVal", 100 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "hotColor", "black" ), true );
    cObj.plSetHotValue( chartHandle, attrItemVal, attrItemVal2 );

    // ħü  ��谪 �� ����
    // - lValue : ħü ��谪
    // - lColor : ħü ����
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "coldVal", -100 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "coldColor", "black" ), true );
    cObj.plSetColdValue( chartHandle, attrItemVal, attrItemVal2 );

    // 0�� ���� ���� (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "ignoreZeroVal", "false" ) ) == "false", 0, 1 );
    cObj.plSetZeroValue( chartHandle, attrItemVal );

    // ���Ӽ� - ����, ����, ����
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "line1Style", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "line1Width", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "line1Color", "silver" ) );
    cObj.plSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // ����� ���ذ� ���� (���콺 �̵��� �����Ǵ� ��ɰ� ����.)
    attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "baseIndexVal", 100 ) );
    cObj.plSetBaseIndex( chartHandle, attrItemVal );
}

function initChartNet ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * �׹���Ʈ ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.ncSetTitle( chartHandle, attrItemVal );

    // �̵���ջ�� - ���ð��� �����ʹ� ������ 20�� �̵����
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "moveAvgVal", 0 ) );
    cObj.ncSetMoveAvg( chartHandle, attrItemVal );

    // �̵���� ��Ÿ��
    // - lCalcStyle	: [0: SMA 1: EMA]
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "moveAvgStyle", "SMA" ) ) == "sma", 0, 1 );
    cObj.ncSetCalcStyle( chartHandle, attrItemVal );

    // ���Ӽ� [ long lStyle, long lWidth, long lColor ]
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "lineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "lineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor", "white" ), true );
    cObj.ncSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );
}

function initChartColorStick ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * ���󸷴� ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;
    var attrItemVal7;
    var attrItemVal8;
    var attrItemVal9;

    // Title
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title" , "" );
    cObj.clsSetTitle( chartHandle, attrItemVal );

    // �������� �ּҰ��� 0���� ���� ����(T/F)
    // - bZero : bZero�� 1�̸� �������� �ּҰ��� 0���� ���� (DEFAULT : 0)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleMinValuZero", "false" ) ) == "false", 0, 1 );
    cObj.clsSetScale( chartHandle, attrItemVal );

    // �������� ����
    // - bSetStart : bSetStart�� 1�̸� �׷����� �������� ����
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "alignStartPoint", "false" ) ) == "false", 0, 1 );
    cObj.clsSetStartPoint( chartHandle, attrItemVal );

    // ������ - �ڵ�����
    // - bAuto  : bAuto�� FALSE�� ��쿡 nWidth�� �ǹ̰� �ִ� (default : TRUE).
    // - lWidth : ������ ��
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "autoWidth", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "widthVal", 0 ) );
    cObj.clsSetWidth( chartHandle, attrItemVal, attrItemVal2 );

    // �����(��, ��)
    // -lPositiveColor : positive �������
    // -lNegativeColor : negative �������
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "positiveColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "negativeColor", "black" ), true );
    cObj.clsSetColor( chartHandle, attrItemVal, attrItemVal2 );

    // ǥ������ 0: �ְ� 1: �ŷ���
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "colorChangeMethod", "stockValue" ) ) == "stockvalue", 0, 1 );
    cObj.clsSetDispType( chartHandle, attrItemVal );

}

function initChartPie ( aChartObject, aChartManager, aChartHandle, aDsChartPieSpec )
{
   /*******************************************************************************************
    * ���� ��Ʈ �Ӽ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;
    var chartHandle = aChartHandle;

    var ds = aDsChartPieSpec;
    var dsRowIdx;
    var i;

    var attrItemVal;
    var attrItemVal2;
    var attrItemVal3;
    var attrItemVal4;
    var attrItemVal5;
    var attrItemVal6;

    // ��� ����
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "pieTitle" , "" );
    cObj.pieSetTitle( chartHandle, attrItemVal );

    // ��� Ÿ��Ʋ ��Ʈ ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "pieTitleFontFaceName " , "default" );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "pieTitleFontHeight"    , 10          );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieTitleFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieTitleFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieTitleFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieTitleFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.pieSetBackFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // ��� Ÿ��Ʋ ��Ʈ ���� ����
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieTitleFontColor", "black" ), true );
    cObj.pieSetTitleColor( chartHandle, attrItemVal );

    // ��� ���� ä��� ����
    // - lFillType    : (��ä�� :1, ���� :2, ����(HORZ):4, ����(VERT);8, ����(RECT):16, ����(Ellips):32
    // - lBackPattern : �����϶� ���� (0.HORIZONTAL, 1.VERTICAL, 2.FDIAGONAL, 3.BDIAGONAL, 4.CROSS, 5.DIACROSS, 6.FILL)
    // - lColorStart  : ���ۻ�
    // - lColorEnd    : ����
    attrItemVal  = toPieBgFillModeValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieBgFillMode" , "NONE" ) );
    attrItemVal2 = toFillStyleValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieBgFillStyle", "FILL" ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieBgStartColor", "black" ) );
    attrItemVal4 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieBgEndColor"  , "black" ) );
    cObj.pieSetBackStyle( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4 );

    // ���� �׷��� ǥ�� ���(2D, 3D)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieDemension", "2D" ) ) == "2d", 0, 1 );
    cObj.pieSetDemension( chartHandle, attrItemVal );

    // ���� ��� ��ǥ�� ǥ�� ���� ����
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieDispCircle", "FALSE" ) ) == "false", 0, 1 );
    cObj.pieSetDispCircle( chartHandle, attrItemVal );

    // ���� ��� �� ���̺�
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "pieCircleLabel", "" );
    cObj.pieSetCircleLabel( chartHandle, attrItemVal );

    // ���� ���̺� ǥ�� ���� (Line/Reck/none)
    attrItemVal  = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelType", "LINE" ) ), "line", 0, "rect", 1, "none", 2 );
    cObj.pieSetLabelType( chartHandle, attrItemVal );

	// ���� ���� ���̺� ǥ�� ����[ true/false ]
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayRateValue", "false" ) ) == "false", 0, 1 );
	cObj.pieSetDispValue( chartHandle, attrItemVal);

    // ���� ��Ʈ ����
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelFontFaceName " , "default" );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelFontHeight"    , 10          );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.pieSetForeFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // ���� ��Ʈ ���� ����
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelFontColor", "black" ), true );
    cObj.pieSetLabelColor( chartHandle, attrItemVal );

    // ���� Pie Color (nCnt:0~34)
    for ( i = 0; i < 35; i++ )
    {
        attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", ( "piePieceColor" + i ), "black" ), true );
        cObj.pieSetPieColor( chartHandle, i, attrItemVal );
    }
}

function initChartDataInfo ( aChartObject, aChartManager, aDsChartCompSpec, aDsChartAreaSpec, aDsChartSpec )
{
   /*******************************************************************************************
    * ��Ʈ ������ ���� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = aChartManager;

    var cObj = aChartObject;
    var cMgr = aChartManager;

    var dsChartComp  = aDsChartCompSpec;
    var dsChartArea  = Iif( aDsChartAreaSpec != null, aDsChartAreaSpec , Object( dsChartComp.GetConstColumn( "areaSpecDataSet"  ) ) );
    var ds           = Iif( aDsChartSpec     != null, aDsChartSpec     , Object( dsChartComp.GetConstColumn( "chartSpecDataSet" ) ) );
    var dsRowIdx;
    var dsRowCnt = ds.RowCount;

    var srcDs     = Object( ds.GetConstColumn( "sourceDataSet" ) );
    var srcDsName = srcDs.Id;
    var srcUseFulColList    = Split( ds.GetConstColumn( "sourceUseFullColumns" ), "," );
    var srcUseFulColListCnt = Length( srcUseFulColList );
    var srcUseFulColListIdx = 0;

    var colName;
    var colSize;
    var colSizeInfo     = "";
    var colTitleInfo    = "";
    var useColFullOrderInfo = "";

    var areaHandle;
    var scaleHandle;
    var hScaleHandle;
    var areaOrder;
    var scaleOrder;
    var chartOrder;

    var srcUseColList;
    var srcUseColListIdx;
    var srcUseColListCnt;

    var colOrder;
    var useColOrderInfo;

    // ��ü Data  ���� ����
    for ( srcUseFulColListIdx = 0; srcUseFulColListIdx < srcUseFulColListCnt; srcUseFulColListIdx++ )
    {
        colName = srcUseFulColList[ srcUseFulColListIdx ];
        colSize = srcDs.GetColSize( colName );
        colSizeInfo  += colSize + ",";
        colTitleInfo += colName + ",";
        useColFullOrderInfo += srcUseFulColListIdx + ",";
    }

    // chart Full Columns Data Format ����
    cObj.SetDataInfoEx( cMgr, srcDsName, colSizeInfo, colTitleInfo );

    ds.Sort( "areaOrder:a,scaleOrder:a,chartOrder:a", false );

    // chart�� Data column ���� ����
    for ( dsRowIdx = 0; dsRowIdx < dsRowCnt; dsRowIdx++ )
    {
        areaOrder    = ds.GetColumn( dsRowIdx, "areaOrder"        );
        areaHandle   = dsChartArea.GetColumn( dsChartArea.FindRow( "areaOrder", areaOrder ), "areaHandle" );

        scaleOrder   = ds.GetColumn( dsRowIdx, "scaleOrder"       );
        scaleHandle  = ds.GetColumn( dsRowIdx, "scaleHandle"      );
        hScaleHandle = ds.GetColumn( dsRowIdx, "hScaleHandle"     );

        chartOrder       = ds.GetColumn( dsRowIdx, "chartOrder"       );
        srcUseColList    = Split( ds.GetColumn( dsRowIdx, "sourceUseColumns" ), "," );
        srcUseColListCnt = Length( srcUseColList );

        colOrder = -1;
        useColOrderInfo = "";
        for ( srcUseColListIdx = 0; srcUseColListIdx < srcUseColListCnt; srcUseColListIdx++ )
        {
            colOrder = arryIndexOf( srcUseFulColList, srcUseColList[ srcUseColListIdx ] );
            useColOrderInfo += colOrder + ",";
        }
        // chart Column Data Format ����
        cObj.SetDataChartInfo( cMgr, (areaHandle + chartOrder), srcDsName, useColOrderInfo );

        // chart Column Feed Data Format ���� ( �̻�� )
        //   :
    }
    cObj.SetDataChartInfo( cMgr, 0, srcDsName, useColFullOrderInfo );
}

function _assignChartData ( aChartObject, aDsChartCompSpec, aDsChartSpec )
{
   /*******************************************************************************************
    * ��Ʈ �����Ͱ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = cObj.GetChartMng();

    var dsChartComp = aDsChartCompSpec;
    var ds          = Iif( aDsChartSpec != null, aDsChartSpec, Object( dsChartComp.GetConstColumn( "chartSpecDataSet" ) ) );
    var srcDs       = Object( ds.GetConstColumn( "sourceDataSet" ) );
    var srcDsName   = srcDs.Id;
    var srcDsRowCnt = srcDs.RowCount;
    var srcDsRowIdx;

    var srcOrderColumnList = Split( ds.GetConstColumn( "orderColumns" ), "," );
    var srcSortInfo;

    var srcUseFulColList    = Split( ds.GetConstColumn( "sourceUseFullColumns" ), "," );
    var srcUseFulColListCnt = Length( srcUseFulColList );
    var srcUseFulColListIdx;

    var srcUseFulColSizeList = "";
    var colSizeInfo = "";

    var rData;
    var colName;
    var colVal;
  //var colSeparate = 128;  // 0x80
    var colSeparate = " ";  // 0x20

    var tmpFieldSize;
    var tmpRealSize;

    var mSTART             = 3;
    var mCONTINUE          = 4;
    var mEND               = 5;
    var mEND_without_START = 2;  // ���� �����Ϳ� �ű� ���ڵ� �߰� ���
    var mState;
    var mReal = 0;

    var debugStr;
    var d_debugStr = "";
    var d_rData = "";
    
/*
    alert(
        "============== chart sourceDataSet ============== " + "\n" +
        srcDs.saveXML()
    );
alert("srcDs=[" + srcDs + "]");
*/

    if ( ( srcDs == null ) || ( srcDsRowCnt < 1 ) ) return;

    // recordData ���� ���� ����
    for ( srcUseFulColListIdx = 0; srcUseFulColListIdx < srcUseFulColListCnt; srcUseFulColListIdx++ ) {
        colName = srcUseFulColList[ srcUseFulColListIdx ];
        colSize = srcDs.GetColSize( colName );
        colSizeInfo += Iif( colSizeInfo  == "", colSize, "," + colSize );
    }
    srcUseFulColSizeList = Split( colSizeInfo, "," );

    // source DataSet ���� ����
    srcSortInfo = srcOrderColumnList[ 0 ] + ":a";

    for( i = 1; i < Length( srcOrderColumnList ); i++ )
        srcSortInfo = "," + srcOrderColumnList[ i ] + ":a";

    // ������ ���� ������� ó���� ��� ������.
    //srcDs.Sort( srcSortInfo, false );

    // ��Ʈ �ִ� ���ڵ� 1000�� ���ѿ� ���� �ӽ� ó��
    if ( srcDsRowCnt > cAvailableDataCount ) srcDsRowCnt = cAvailableDataCount;
    //trace( "    ## chart record count: [" + srcDsRowCnt + "]" );

    // recordData ���
    for ( srcDsRowIdx = 0; srcDsRowIdx < srcDsRowCnt; srcDsRowIdx++ ) 
    {
        rData = "";
        debugStr = "";
        for ( srcUseFulColListIdx = 0; srcUseFulColListIdx < srcUseFulColListCnt; srcUseFulColListIdx++ ) 
        {
            colName = srcUseFulColList[ srcUseFulColListIdx ];
            colVal  = srcDs.GetColumn( srcDsRowIdx, colName );
            tmpFieldSize = parseInt( srcUseFulColSizeList[ srcUseFulColListIdx ] );

            // 2����Ʈ ���������� ���� ����
            tmpRealSize = Iif( isEmChar( colVal ), parseInt( Truncate( tmpFieldSize / 2 ) ), tmpFieldSize );
            colVal = Mid( colVal, 0, tmpRealSize );
            
            // �÷� ���� ��ŭ ���� ä���
            colVal += Rpad( "", " ", tmpFieldSize - Lengthb( colVal ) );
            rData  += colVal + colSeparate;

            //debugStr += "colName     [" + colName      + "]\n" +
            //            "colVal      [" + colVal       + "]\n" +
            //            "tmpFieldSize[" + tmpFieldSize + "]\n" +
            //            "realSize[" + Lengthb(colVal) + "]\n";
        }
        if ( srcDsRowCnt == 1 ) {
            mState = mEND_without_START;
        } else if ( srcDsRowIdx == 0 ) {
            mState = mSTART;
        } else if ( srcDsRowIdx < ( srcDsRowCnt - 1 ) ) {
            mState = mCONTINUE;
        } else if ( srcDsRowIdx == ( srcDsRowCnt - 1 ) ) {
            mState = mEND;
        }
        //alert(debugStr);
        //alert( "srcDsRowIdx = " + srcDsRowIdx + ",   mState=" + mState );
        //d_debugStr += debugStr + "\n";
        //d_rData += "rData[" + srcDsRowIdx + "]=<" + rData + ">\n";
        cObj.SetData2( cMgr, rData, mState, srcDsName, mReal );
    }
    //alert(d_rData + d_debugStr);
    //alert(d_rData);
}

function _appendChartData ( aChartObject, aDsChartCompSpec )
{
   /*******************************************************************************************
    * ��Ʈ ������ �߰�
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = cObj.GetChartMng();

    var dsChartComp = aDsChartCompSpec;
    var ds          = Object( dsChartComp.GetConstColumn( "chartSpecDataSet" ) );
    var srcDs       = Object( ds.GetConstColumn( "sourceDataSet" ) );
    var srcDsName   = srcDs.Id;
    var srcDsRowCnt = srcDs.RowCount;
    var srcDsRowIdx;

    var srcOrderColumnList = Split( ds.GetConstColumn( "orderColumns" ), "," );
    var srcSortInfo;

    var srcUseFulColList    = Split( ds.GetConstColumn( "sourceUseFullColumns" ), "," );
    var srcUseFulColListCnt = Length( srcUseFulColList );
    var srcUseFulColListIdx;

    var srcUseFulColSizeList = "";
    var colSizeInfo = "";

    var rData;
    var colName;
    var colVal;
  //var colSeparate = 128;  // 0x80
    var colSeparate = " ";  // 0x20

    var tmpFieldSize;
    var tmpRealSize;

    var mSTART             = 3;
    var mCONTINUE          = 4;
    var mEND               = 5;
    var mEND_without_START = 2;       // ���� �����Ϳ� �ű� ���ڵ� �߰� ���
    var mState = mEND_without_START;
    var mReal  = 1;

    var debugStr;
    var d_debugStr = "";
    var d_rData = "";
    
    if ( ( srcDs == null ) || ( srcDsRowCnt < 1 ) ) return;

    // recordData ���� ���� ����
    for ( srcUseFulColListIdx = 0; srcUseFulColListIdx < srcUseFulColListCnt; srcUseFulColListIdx++ ) {
        colName = srcUseFulColList[ srcUseFulColListIdx ];
        colSize = srcDs.GetColSize( colName );
        colSizeInfo += Iif( colSizeInfo  == "", colSize, "," + colSize );
    }
    srcUseFulColSizeList = Split( colSizeInfo, "," );

    // source DataSet ���� ����
    srcSortInfo = srcOrderColumnList[ 0 ] + ":a";

    for( i = 1; i < Length( srcOrderColumnList ); i++ )
        srcSortInfo = "," + srcOrderColumnList[ i ] + ":a";

    srcDs.Sort( srcSortInfo, false );

    // ������ recordData ���
    srcDsRowIdx = srcDsRowCnt - 1;
    rData = "";
    debugStr = "";
    for ( srcUseFulColListIdx = 0; srcUseFulColListIdx < srcUseFulColListCnt; srcUseFulColListIdx++ ) 
    {
        colName = srcUseFulColList[ srcUseFulColListIdx ];
        colVal  = srcDs.GetColumn( srcDsRowIdx, colName );
        tmpFieldSize = parseInt( srcUseFulColSizeList[ srcUseFulColListIdx ] );

        // 2����Ʈ ���������� ���� ����
        tmpRealSize = Iif( isEmChar( colVal ), parseInt( Truncate( tmpFieldSize / 2 ) ), tmpFieldSize );
        colVal = Mid( colVal, 0, tmpRealSize );
        
        // �÷� ���� ��ŭ ���� ä���
        colVal += Rpad( "", " ", tmpFieldSize - Lengthb( colVal ) );
        rData  += colVal + colSeparate;
    }
    cObj.SetData2( cMgr, rData, mState, srcDsName, mReal );
}

function assignChartData ( aChartObject, aDsChartCompSpec, aDsChartSpec )
{
   /*******************************************************************************************
    * ��Ʈ �����Ͱ� ����
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = cObj.GetChartMng();

    var dsChartComp = aDsChartCompSpec;
    var ds          = Iif( aDsChartSpec != null, aDsChartSpec, Object( dsChartComp.GetConstColumn( "chartSpecDataSet" ) ) );
    var srcDs       = Object( ds.GetConstColumn( "sourceDataSet" ) );
    var srcDsRowCnt = srcDs.RowCount;

    var srcOrderColumn = ds.GetConstColumn( "orderColumns" );
    var srcUseFulCol   = ds.GetConstColumn( "sourceUseFullColumns" );

    if ( srcDsRowCnt > cAvailableDataCount ) srcDsRowCnt = cAvailableDataCount;

    //cObj.AssignData( srcOrderColumn, srcUseFulCol , srcDs, 0, srcDsRowCnt );
    //cObj.AssignData( srcOrderColumn, srcUseFulCol , srcDs );
    
    //trace("222222222222222222222222222222222222222222222222222222222222222222222");
	//trace(srcDs.SaveXML());
//if (rateChartDeb)  alert("------ begin -------");    
    cObj.AssignData( "", srcUseFulCol , srcDs );
//if (rateChartDeb)  alert("------ end -------");    
    
    //alert("srcDs.rowCount=" + srcDs.rowCount + "  code:" + cObj.AssignData( srcOrderColumn, srcUseFulCol , srcDs, 0, srcDsRowCnt ));
}

function appendChartData ( aChartObject, aDsChartCompSpec )
{
   /*******************************************************************************************
    * ��Ʈ ������ �߰�
    ******************************************************************************************/
    var cObj = aChartObject;
    var cMgr = cObj.GetChartMng();

    var dsChartComp = aDsChartCompSpec;
    var ds          = Object( dsChartComp.GetConstColumn( "chartSpecDataSet" ) );
    var srcDs       = Object( ds.GetConstColumn( "sourceDataSet" ) );

    var srcUseFulCol   = ds.GetConstColumn( "sourceUseFullColumns" );
    var srcOrderColumn = ds.GetConstColumn( "orderColumns" );
    
    //cObj.appendData( srcOrderColumn, srcUseFulCol , srcDs );
    cObj.appendData( "", srcUseFulCol , srcDs );
}

