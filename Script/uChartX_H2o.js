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
    * FORM(DIV,TAB)의 UserData 프로퍼티의 스트링 인자(data)를 LIst Array 로 변환하여 반환
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
  //alert("▶userDataToList____listObj=" + outPutList + "\n\n\n");

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
    * userDataToList에 의해 생성된 LIst Array에서 요청한 Key에 해당하는 값을 반환
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
    * userDataToList에 의해 생성된 LIst Array에서 요청한 Key에 요청한 값을 할당
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
    * 데이터셋에 로컬 xml파일을 로딩하여 적용
    ******************************************************************************************/
    // xml 파일 가져오기
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
    * 배열의에서 요청한 Key가 위치한 array index 리턴
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
    * 차트 선 스타일 값 리턴
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
    * 파이 차트 배경 채우기 스타일 값 리턴
    * [ "SOLID": 0[DEFAULT], "DASH": 1, "DOT": 2, "DASHDOT": 3, "DASHDOTDOT": 4  ]
    ******************************************************************************************/
    var rVal = -1;

    switch ( ToLower( aVal ) )
    {
        case "none"                 : rVal =  1; break;  // 없음
        case "pattern"              : rVal =  2; break;  // 무늬
        case "gradation_horizontal" : rVal =  4; break;  // 점층 수평
        case "gradation_vertical"   : rVal =  8; break;  // 점층 수직
        case "gradation_rectangle"  : rVal = 16; break;  // 점층 사각
        case "gradation_ellipse"    : rVal = 32; break;  // 점층 타원
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
    * 차트 선 스타일 값 리턴
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
    * 차트 폰트 값 리턴
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
    // 시계열데이타 or 텍스트데이타 사용여부 설정 (일봉/주봉/월봉/분봉) - (0:텍스트, 1:시계열)

   /*******************************************************************************************
    * 차트 시계열데이타 일간격 값 리턴
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
    * key value 형태의 데이터셋의 요청한 row번째의 특정컬럼값을 리턴
    * 값이 NULL인경우 nullVal을 리턴한다.
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
		resultVal="ＭＳ ゴシック";
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
    * key value 형태의 데이터셋의 요청한 row번째의 특정컬럼값을 설정
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

    // 차트 & 지표 생성
    appendChart( cObj, cMgr, dsChartComp );

    // 머리말영역 세부 설정
    attrItemVal = Iif( ToLower( getAttributeVal( dsChartComp, "attributeId", "attributeVal", "useChartHeadArea", "true" ) ) == "false", 0, 1 );
    if ( attrItemVal == 1 ) initChartHead( cObj, cMgr, dsChartHead );

    // 시계열영역  세부 설정
    attrItemVal = Iif( ToLower( getAttributeVal( dsChartComp, "attributeId", "attributeVal", "useTimeLineArea", "true" ) ) == "false", 0, 1 );
    if ( attrItemVal == 1 ) initChartTimeLine( cObj, cMgr, dsChartTimeLine );

    // 도구모음영역 세부 설정
    attrItemVal = Iif( ToLower( getAttributeVal( dsChartComp, "attributeId", "attributeVal", "useToolBarArea", "true" ) ) == "false", 0, 1 );
    if ( attrItemVal == 1 ) initChartToolBar( cObj, cMgr, dsChartToolBar );
    //---> initChartToolBar( cObj, cMgr, dsChartToolBar );

    // chart Data format Infomation 설정
    initChartDataInfo ( cObj, cMgr, dsChartComp );


    // 차트 Window 생성
    cObjHandle = cObj.GetWindowHandle();
    cObj.CreateChartX( cMgr, cObjHandle );

    // 컨트롤 사이즈 조정
    cObj.SetSize( cMgr, cObj.Left, cObj.Top, cObj.Width, cObj.Height, true );
    //cObj.SetSize( cMgr, 0, 0, 400, 400, false );

    return cMgr;
}

function initChartComp ( aChartObject, aChartManager, aDsChartCompSpec, aDsChartHeadSpec, aDsChartTimeLineSpec, aDsChartToolBarSpec )
{
   /*******************************************************************************************
    * 챠트컴포넌트 설정 초기화
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

    var chartObjId = "";                    // 차트컴포넌트 ID
    var attrOption = 511;

    var f_runTimeAddIndicator   =   1;      // 실행시 지표추가 가능  m_bDynamicSave      0x00000001
    var f_runTimePropChangeSave =   2;      // 실행시 속성 변경 저장 m_bDynamicSaveLoad  0x00000002
    var f_useAnalyzerToolBar    =   4;      // 분석도구모음 사용     m_bUseTool          0x00000004
    var f_useDataInfoWin        =   8;      // 데이터윈도우 사용     m_bUseDataWin       0x00000008
    var f_useChartHeadArea      =  16;      // 머리말영역            m_bHeadLine         0x00000010
    var f_useTimeLineArea       =  32;      // 시계열영역            m_bTLine            0x00000020
    var f_useScrollBar          =  64;      // 스크롤바              m_bScrollBar        0x00000040
    var f_useToolBarArea        = 128;      // 도구모음영역          m_bToolLine         0x00000080
    var f_useAreaSplitBar       = 256;      // 영역분리자            m_bSplitter         0x00000100

    if ( ( cMgr == null ) or ( cMgr == 0 ) ) 
        cMgr = cObj.GetChartMng(); 
    else 
        cMgr = 0;

    // 차트 Object 생성
    if ( cMgr <> 0 ) {
        //alert("^.^ cMgr=" + cMgr);
        cObj.DeleteChartX( cMgr );
        cMgr = 0;
    }
    cMgr = cObj.NewChartX();

    if ( cMgr == 0 ) {
        cMgr = cObj.NewChartX();
    }

    // 차트 Object속성 설정
    for ( i = 0 ; i < Length( attrItemList ) ; i ++ )
    {
        attrItemVal = getAttributeVal( dsChartComp, "attributeId", "attributeVal", attrItemList[ i ], "true" );
        if ( attrItemVal == "false" )
            attrOption -= eval( "f_" + attrItemList[ i ] );
    }
    cObj.SetOption( cMgr, attrOption );

    // 차트 Object 고유명(ID) 설정
    attrItemVal = getAttributeVal( dsChartComp, "attributeId", "attributeVal", "chartObjectId", "" );
    cObj.SetCtrlName ( cMgr, "chartDW_" + attrItemVal );

    // 출력 데이타 갯수  [0: 전체Data 갯수와 동일, 지정된 값만큼 출력 ]
    attrItemVal = getAttributeVal( dsChartComp, "attributeId", "attributeVal", "displayDataCount", 0 );
    cObj.SetDisplayCount( cMgr, attrItemVal );

    // 기조(배경)색상 설정 (0:검정, 1:흰색)
    attrItemVal = getAttributeVal( dsChartComp, "attributeId", "attributeVal", "backGroundColor", 0 );
    cObj.SetBaseColor( cMgr, attrItemVal );

    // 실행시 동적으로 분봉 간격 변경
    attrItemVal = getAttributeVal( dsChartComp, "attributeId", "attributeVal", "changeRealDataTypeMinVal", 1 );
    cObj.ChangeRealDataType( cMgr, attrItemVal );

	//alert("attrItemVal = " + attrItemVal);
    return cMgr;
}

function initChartArea ( aChartObject, aChartManager, aDsChartCompSpec )
{
   /*******************************************************************************************
    * 차트 영역 생성 및 상세 설정
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
        // 영역속성 추가
        areaHandle = cObj.AddChartWnd( cMgr, areaTop, areaBottom );
        dsChartArea.SetColumn( dsChartAreaRowIdx, "areaHandle", areaHandle );

        // 영역 경계속성 설정
        areaTop       = dsChartArea.GetColumn( dsChartAreaRowIdx, "areaTop"       );
        areaBottom    = dsChartArea.GetColumn( dsChartAreaRowIdx, "areaBottom"    );
        areaTopMargin = dsChartArea.GetColumn( dsChartAreaRowIdx, "areaTopMargin" );
        areaBtmMargin = dsChartArea.GetColumn( dsChartAreaRowIdx, "areaBtmMargin" );
        cObj.cwSetSize( cMgr, areaHandle, areaTop, areaBottom, areaTopMargin, areaBtmMargin );

        // 영역 경계배경색 설정(nBkMode=1: TRANSPARENT, 2:OPAQUE[DEFAULT](2일때 컬러지정))
        areaBkMode = dsChartArea.GetColumn( dsChartAreaRowIdx, "areaBkColor" );
        areaBkMode = Iif( ToLower( areaBkMode ) == "transparent", 1, areaBkMode );
        areaBkColor = "";
        if ( areaBkMode != 1 ) {
            areaBkColor = ToColorValue( areaBkMode, true );
            areaBkMode  = 2;
        }
        cObj.cwSetBkColor( cMgr, areaHandle, areaBkMode, areaBkColor );

        // 영역 타이틀 표시여부속성 설정
        useAreaTitle  = dsChartArea.GetColumn( dsChartAreaRowIdx, "useAreaTitle"  );
        cObj.cwSetDispChartTitle( cMgr, areaHandle, useAreaTitle );
    }
}

function initChartHead ( aChartObject, aChartManager, aDsChartHeadSpec )
{
   /*******************************************************************************************
    * 머리말영역 상세 설정
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

    // 머리말영역의 높이 설정
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadHeight", 20 );
    cObj.hwSetHeight( cMgr, attrItemVal );

    // 머리말영역에 타이틀 표시여부 설정
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadArrayTitle", "true" ) ) == "false", 0, 1 );
    cObj.hwSetDispTitle( cMgr, attrItemVal );

    // ** 함수 호출 순서 주의
    cObj.AddHeadWnd( cMgr );

    // 차트 머릿말 타이틀 설정
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadTitle" , "" );
    if ( attrItemVal != null )
        cObj.hwSetTitle( cMgr, attrItemVal );

    // 머리말영역에 사용될 폰트의 글꼴
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadFontFaceName" , "default" );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadFontHeight"   , 10          );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.hwSetFont( cMgr, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // 머리말영역에 사용될 폰트색상
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadFontColor", "black" ), true );
    cObj.hwSetForeColor( cMgr, attrItemVal );

    // 머리말영역의 배경모드 설정 - nBkMode: 1이면 TRANSPARENT, 2면 OPAQUE (DEFAULT)
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

    // 머리말영역에 "시고저종" 데이터 출력여부 설정
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "chartHeadArrayDisplayValue", "true" ) ) == "false", 0, 1 );
    cObj.hwSetDispValue( cMgr, attrItemVal );
}

function initChartTimeLine ( aChartObject, aChartManager, aDsChartTimeLineSpec )
{
   /*******************************************************************************************
    * 시계열영역 상세 설정
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

    // 시계열데이타 or 텍스트데이타 사용여부 설정 (일봉/주봉/월봉/분봉) - (0:텍스트, 1:시계열)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useTimeLineData", "false" ) ) == "false", 0, 1 );
    cObj.twSetUseTimeData( cMgr, attrItemVal );

    if ( attrItemVal == 1 ) {
        // 시계열 시간형식 설정
        // (nType = 0: 일봉, 1:주봉, 2:월봉, 3:분봉[default])
        // (nMin = 1,3,5,10,15,20,30,60 [* nType이 3인경우 몇분봉인지 지정 ])
        attrItemVal = toTimeLinePeriodValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLinePeriodDiv", "DAY" ) );
        if ( attrItemVal == 3 )
            attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLinePeriodMinVal", 1 ) );

        cObj.twSetTimeType( cMgr, attrItemVal, attrItemVal2 );
    }
    else {
        // 텍스트데이타사용시 텍스트 출력 간격 설정
        attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineTextExprSpace", "1" ) );
        cObj.twSetTextInterval( cMgr, attrItemVal );

        // 텍스트데이타사용시 텍스트출력 방향 설정 (0:가로[default], 1:세로)
        attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineTextExprVertical", "H" ) ) == "h", 0, 1 );
        cObj.twSetDispVert( cMgr, attrItemVal );

        // 텍스트데이타사용시 텍스트출력타입 설정 (0:문자[default], 1:숫자[3자리','표시])
        attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineTextExprValueType", "text" ) ) == "text", 0, 1 );
        cObj.twSetDataNum( cMgr, attrItemVal );

        // 텍스트데이타사용시 텍스트출력타입이 숫자일때 소수표현 자리수 설정 ( 0[default] )
        attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineTextExprRealValueLen", 0 ) );
        cObj.twSetDecimal( cMgr, attrItemVal );
    }

    // 실시간데이타 사용(분봉 ? 누적간격, 일봉)
    // 실시간데이타 사용여부 설정 (0:미사용[default], 1:사용)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useTimeLineRealTimeData", "false" ) ) == "false", 0, 1 );
    cObj.twSetUseRealData( cMgr, attrItemVal );

    if ( attrItemVal == 1) {
        // 실시간데이타의 일봉 or 분봉 처리여부 설정 (0:일봉, 1:분봉[default] (1일때 분지정))
        attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useTimeLineRealTimeDataDiv", "min" ) ) == "day", 0, 1 );

        if ( attrItemVal == 1 ) {
            attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineRealTimeDataDivMinVal", 1 ) );
        }
        cObj.twSetRealDataType( cMgr, attrItemVal, attrItemVal2 );
    }

    // 시계열영역 배경모드 설정 (nBkMode=1: TRANSPARENT, 2:OPAQUE[DEFAULT](2일때 컬러지정))
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineBkColor", "white" );
    attrItemVal = Iif( ToLower( attrItemVal ) == "transparent", 1, attrItemVal );
    attrItemVal2 = "";

    if ( attrItemVal != 1 ) {
        attrItemVal2 = ToColorValue( attrItemVal, true );
        attrItemVal  = 2;
    }
    cObj.twSetBkColor( cMgr, attrItemVal, attrItemVal2 );

    // 시계열영역 텍스트 출력 위치 설정 (0:눈금위(POS_ONLINE), 1:필드중앙(POS_CENTER)[DEFAULT])
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineTextSortMethod", "CENTER" ) ) == "online", 0, 1 );
    cObj.twSetTextOrder( cMgr, attrItemVal );

    // 시계열영역 여백 설정 (영역높이[default:20], 왼쪽여백[default:0], 오른쪽여백[default:0])
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineAreaSpace"      , 20 ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineAreaLeftSpace"  , 10 ) );
    attrItemVal3 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineAreaRightSpace" , 10 ) );
    cObj.twSetMargin( cMgr, attrItemVal, attrItemVal2, attrItemVal3 );

    // 시계열영역 보조선 사용여부 설정 (0:미사용, 1:사용[default])
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useTimeLineGuideLine", "true" ) ) == "false", 0, 1 );
    cObj.twSetUseAssistLine( cMgr, attrItemVal );

    if ( attrItemVal == 1 ) {
        // 시계열영역 보조선 스타일 설정 (선 스타일, 두께, 색상)
        attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineGuideLineStyle", "SOLID" ) );
        attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineGuideLineWidth", 1       );
        attrItemVal3 = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineGuideLineColor", "white" );
        cObj.twSetAssistLine( cMgr, attrItemVal, attrItemVal2, attrItemVal3 );
    }

    // 시계열영역 폰트 설정
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontFaceName" , "default" );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontHeight"   , 10          );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.twSetFont( cMgr, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // 시계열영역 폰트 색상 설정
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontColor" , "black" ) );
    cObj.twSetForeColor( cMgr, attrItemVal );

    // 시계열영역 선속성 설정
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineLineStyle", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineLineWidth", 1        );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineLineColor", "silver" ) );
    cObj.twSetLine( cMgr, attrItemVal, attrItemVal2, attrItemVal3 );

    // 시계열 방향 설정 - ( 0:세로, 1:가로 )
    // 주의: twSetMargin보후 나중에 호출해야함.
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineDirection", "H" ) ) == "v", 0, 1 );
    cObj.twSetDirection( cMgr, attrItemVal );
}

function initChartToolBar  ( aChartObject, aChartManager, aDsChartToolBarSpec )
{
   /*******************************************************************************************
    * 도구모음영역 상세 설정
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
  //var f_bUseAll             =   1;     // 모든 버튼 사용
    var f_toolBarZoomReset    =    2;    // 리셋
    var f_toolBarZoomIn       =    4;    // 확대
    var f_toolBarZoomOut      =    8;    // 축소
    var f_toolBarNext         =   16;    // 다음
    var f_toolBarPrev         =   32;    // 이전
    var f_toolBarStop         =   64;    // 멈춤
    var f_toolBarDisplayCount =  128;    // 갯수
    var f_toolBarTrendLine    =  256;    // 추세선
    var f_toolBarToolWin      =  512;    // 분석툴바
    var f_toolBarDataWin      = 1024;    // 데이타윈도우
*/
    var attrOption            = 4094;
  //var f_bUseAll             =   1;     // 모든 버튼 사용
    var f_toolBarZoomReset    =    2;    // 리셋
    var f_toolBarZoomIn       =    4;    // 확대
    var f_toolBarZoomOut      =    8;    // 축소
    var f_toolBarNext         =   16;    // 다음
    var f_toolBarPrev         =   32;    // 이전
    var f_toolBarStop         =   64;    // 멈춤
    var f_toolBarDisplayCount =  128;    // 갯수
    var f_toolBarTrendLine    =  256;    // 추세선
    var f_toolBarToolWin      =  512;    // 분석툴바
    var f_toolBarDataWin      = 1024;    // 데이타윈도우
    var f_toolBarCrossLine    = 2048;    // 마우스 확대영역선택 모드

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

    // 차트 Object속성 설정
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
    * 스케일 설정 초기화
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

    // 스케일 표현 방향
    // __1이면 세로, 0이면 가로 (DEFAULT : 1)
    // __역시계곡선, PV Chart의 경우 H(가로) Scale사용
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleDirection", "V" ) ) == "h", 0, 1 );
    cObj.swSetDirection( cMgr, areaHandle, scaleHandle, attrItemVal );

    // 스케일 자동 최대/최소값 설정
    // __bAuto : 1이면 스케일이 자동처리, 0이면 수동처리 (DEFAULT : 1)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useAutoMinMax", "TRUE" ) ) == "false", 0, 1 );
    cObj.swSetAutoMinMax( cMgr, areaHandle, scaleHandle, attrItemVal );

    // 스케일 수동 최대/최소값 설정 ( lMax: 최대값, lMin: 최소값 )
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleMaxValue", 1000 ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleMinValue",    0 ) );
    cObj.swSetMinMax( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2 );

    // 눈금(값, 개수) [ V:값 / N:개수 ] V=0,N=1
    // __nType   : 0이면 눈금의 개수만큼 스케일을 나누고, 1이면 입력받은 값(dbValue)으로 스케일을 나눈다 (DEFAULT : 0).
    // __dbValue : nType이 0인 경우 dbValue는 틱의 개수가 되고, 1인 경우 틱의 크기가 된다 (DEFAULT 틱 개수 : 4, 틱 값 : 0.0).
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleTickType", "N" ) ) == "v", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleTickTypeValue", 4 ) );

    cObj.swSetTickType( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2 );

    // 출력 단위
    //  :
    // 메뉴얼에 함수 정의 않되어있음
    //  :

    // 데이터 배율
    // __nRate : 스케일 눈금값을 나눌 값
    attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleDataRate", 1 ) );
    cObj.swSetDataRate( cMgr, areaHandle, scaleHandle, attrItemVal );

    // 표현_좌측 스케일 사용여부 및 여백
    // __bShow  : [ 0:미사용, 1:사용 ]
    // __nMargin: 여백
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useLScale", "TRUE" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleLMargin", 50 ) );
    cObj.swSetLeftScale( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2 );

    // 표현_우측 스케일 사용여부 및 여백
    // __bShow  : [ 0:미사용, 1:사용 ]
    // __nMargin: 여백
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useRScale", "TRUE" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleRMargin", 50 ) );
    cObj.swSetRightScale( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2 );

    // 소수이하자리수 표현 설정
    // __nCnt  : [ 0 소수이하자리수]
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "exprRealValueLen", 0 ) );
    cObj.swSetDecimal( cMgr, areaHandle, scaleHandle, attrItemVal );

    // 표현_보조선 사용여부
    // __bUse : 1이면 보조선 사용 (DEFAULT: 1)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useAssistLine", "TRUE" ) ) == "false", 0, 1 );
    cObj.swSetUseAssistLine( cMgr, areaHandle, scaleHandle, attrItemVal );

    // 표현_보조선 상세 설정
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "assistLineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "assistLineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "assistLineColor", "white" ), true );
    cObj.swSetAssistLine( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // 표현_로그적용
    // __bUse : 1이면 스케일을 LOG로 표현 (DEFAULT : 0)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useLogScale", "FALSE" ) ) == "false", 0, 1 );
    cObj.swSetUseLog( cMgr, areaHandle, scaleHandle, attrItemVal );

    // 표현_선속성 상세 설정
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "scaleLineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleLineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "scaleLineColor", "white" ), true );
    cObj.swSetLine( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // 표현_폰트 스타일 설정
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "scaleFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "scaleFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "scaleFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleFontStrikeOut", "false" ) ) == "false", 0, 1 );

    cObj.swSetFont( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // 표현_폰트 색상 설정
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "scaleFontColor", "black" ), true );
    cObj.swSetForeColor( cMgr, areaHandle, scaleHandle, attrItemVal );

    // 기준선_표현
    // __bDisp : 1이면 기준선 출력, 0이면 숨김 (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayBaseLine", "FALSE" ) ) == "false", 0, 1 );
    cObj.swSetDispBaseLine( cMgr, areaHandle, scaleHandle, attrItemVal );

    // 기준선_자동설정 여부
    // __bAuto : 1이면 기준선의 값이 자동처리, 0이면 입력값으로 처리 (DEFAULT : 1)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useAutoBaseLine", "TRUE" ) ) == "false", 0, 1 );
    cObj.swSetAutoBaseLine( cMgr, areaHandle, scaleHandle, attrItemVal );

    // 기준선_기준선값 수동 설정
    // __dbValue : 기준선값을 수동처리 하는 경우에 값을 설정한다.
    attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "baseLineValue", 0 ) );
    cObj.swSetBaseLineValue( cMgr, areaHandle, scaleHandle, attrItemVal );

    // 기준선_선속성 설정
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "baseLineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "baseLineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "baseLineColor", "white" ), true );
    cObj.swSetBaseLine( cMgr, areaHandle, scaleHandle, attrItemVal, attrItemVal2, attrItemVal3 );
}

function appendChart ( aChartObject, aChartManager, aDsChartCompSpec, aDsChartAreaSpec, aDsChartSpec )
{
   /*******************************************************************************************
    * 차트생성
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

        // 차트영역 생성
        if ( preAreaOrder < areaOrder ) {
            areaHandle = dsChartArea.GetColumn( dsChartArea.FindRow( "areaOrder", areaOrder ), "areaHandle" );
            preAreaOrder = areaOrder;
            preScaleOrder = -1;
            preChartOrder = -1;
        }

        // 스케일 생성
        if ( preScaleOrder < scaleOrder ) {
            tList = Split( ds.GetColumn( dsRowIdx, "scaleDetailSpecDataSet" ), "," );
            tListCnt = Length( tList );

            switch( tListCnt )
            {
                case 0:
                     // 상세 스케일이 정의되지않은 경우 기본 스케일 적용
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

        // 차트 추가
        if ( preChartOrder < chartOrder ) {
            cObj.AddChart2( cMgr, areaHandle, chartOrder, scaleHandle, hScaleHandle, chartType, IndicatorType, chartTitleList[ 0 ] );
            preChartOrder = chartOrder;
        }

        /********************************************************************************************
         * 지표 종류에 따른 지표 속성 설정
         ********************************************************************************************/
        if ( IndicatorType != null ) {
            IndicatorHandle = cObj.GetIndicator( cMgr, areaHandle + chartOrder );
            switch ( ToLower( IndicatorType ) )
            {
                case "movavg" :                                                                      // MOVAVG ( 이동평균선 )
                      // 이동평균 간격
                      cObj.SetMAofMovAvg( IndicatorHandle, IndicatorIntervals[ 0 ] );
                      break;
                case "psycho":                                                                       // PSYCHO ( 심리지표 )
                	 // 심리도 기간 설정 필요함
                     cObj.SetMAofPsycho( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "disparity":                                                                    // DISPARITY ( 이격율 )
                     // 이동평균 간격
                     cObj.SetMAofDisparity( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "obvolume":                                                                     // OBV             ( On Balance Volume )
                      // 설정인자 없음
                      break;
                case "vratio":                                                                       // VR              ( Volume Ratio )
                     // 이동평균 간격
                     cObj.SetMAofVR( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "adline":                                                                       // ADL             ( Advanced Decline Line )
                      // 설정인자 없음
                      break;
                case "adratio":                                                                      // ADR             ( Advanced Decline Ratio )
                      // 설정인자 없음
                      break;
                case "macd":                                                                         // MACD
                     // 이동평균 간격 - 단기 간격
                     cObj.SetSMAofMACD( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // 이동평균 간격 - 장기 간격
                     cObj.SetLMAofMACD( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     // 이동평균 간격 - signal
                     cObj.SetSIGofMACD( IndicatorHandle, IndicatorIntervals[ 2 ] );
                     break;
                case "sonar":                                                                        // SONAR           ( SONA )
                     // 이동평균 간격
                     cObj.SetMAofSONA( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "rsindex":                                                                      // RSI             ( Relative Strength Index )
                     // 이동평균 간격
                     cObj.SetMAofRSI( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "ccindex":                                                                      // CCI             ( Commodity Channel Index )
                     // 이동평균 간격
                     cObj.SetMAofCCI( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "lrslope":                                                                      // LRS             ( Linear Regression Slope )
                     // 이동평균 간격
                     cObj.SetMAofLRS( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "adisline":                                                                     // AD              ( A/DisLine )
                      // 설정인자 없음
                     break;
                case "rochange":                                                                     // ROC             ( Price Rate of Change )
                     // 이동평균 간격
                     cObj.SetMAofROC( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     cObj.SetSignalMAofROC( IndicatorHandle, IndicatorIntervals [ 1 ]);
                     break;
                case "envolope" :                                                                    // ENVOLOPE        ( Envolope )
                     // 이동평균 간격
                     cObj.SetMAofEnvolpe( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // 변경일
                     cObj.SetCHGofEnvolpe( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     break;
                case "maoscillator":                                                                 // MAO             ( Moving Average Oscillator - Line )
                     // 이동평균 간격 - 단기 간격
                     cObj.SetSMAofMAO( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // 이동평균 간격 - 장기 간격
                     cObj.SetLMAofMAO( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     // 이동평균 간격
                     cObj.SetMAofMAO( IndicatorHandle, IndicatorIntervals[ 2 ] );
                     break;
                case "stdeviation":                                                                  // STDEV           ( Standard Deviation )
                     // 이동평균 간격
                     cObj.SetMAofSTDEV( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "wclose":                                                                       // WC              ( Weighted Close )
                      // 설정인자 없음
                     break;
                case "cvolatility":                                                                  // CV              ( Chaikin's Volatility )
                     // 이동평균 간격
                     cObj.SetMAofCV( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // 변경일
                     cObj.SetCHGofCV( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     break;
                case "mobv":                                                                         // MOBV            (  )
                     // 설정인자 없음
                     break;
                case "bollband":                                                                     // BOLLBAND        ( Bollinger Bands )
                     // 이동평균 간격
                     cObj.SetMAofBollBand( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "momentum":                                                                     // MO              ( Momentum )
                     // 이동평균 간격
                     cObj.SetMAofMomentum( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "newhighlow":                                                                   // NH_NL           ( New-Hight New-Low )
                      // 설정인자 없음
                     break;
                case "rstrength" :                                                                   // RS              ( 상대강도 )
                     // 이동평균 간격
                     cObj.SetMAofRS( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "ema":                                                                          // EMA             ( Exponential Moving Average )
                     // 이동평균 간격
                     cObj.SetMAofEMA( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "dmark"   :                                                                     // DMARK           ( D Mark )
                      // 설정인자 없음
                     break;
                case "adx"     :                                                                     // ADX             ( Average Direction Movement Index )
                     // 이동평균 간격
                     cObj.SetMAofADX( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "lfi":                                                                          // LFI             (  )
                     // 이동평균 간격
                     cObj.SetMAofLFI( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "nco" :                                                                         // NCO             ( Net Change Oscillator )
                     // 이동평균 간격
                     cObj.SetMAofNCO( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "sigma" :                                                                       // SIGMA           (  )
                     // 이동평균 간격
                     cObj.SetMAofSigma( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "newpsycho":                                                                    // NEWPSYCHO       ( 신심리지표 )
                     cObj.SetMAofNewPsycho( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "sonar2"   :                                                                    // SONA2           (  )
                     // 이동평균 간격
                     cObj.SetMAofSONA2( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "sonar2o" :                                                                     // SONAR2O         ( SONA2 Oscillator )
                     // 이동평균 간격
                     cObj.SetMAofSONA2O( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "maostick" :                                                                    // MAOSTICK        ( Moving Average Oscillator - Stick )
                     // 이동평균 간격 - 단기 간격
                     cObj.SetSMAofMAOS( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // 이동평균 간격 - 장기 간격
                     cObj.SetLMAofMAOS( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     // 이동평균 간격
                     cObj.SetMAofMAOS( IndicatorHandle, IndicatorIntervals[ 2 ] );
                     break;
                case "dmindex" :                                                                     // DMI             ( Directional Movement Index )
                     // 이동평균 간격
                     cObj.SetMAofDMI( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     break;
                case "macdoscillator":                                                               // MACDOSC         ( MACD Oscillator )
                     // 이동평균 간격 - 단기 간격
                     cObj.SetSMAofMACDS ( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // 이동평균 간격 - 장기 간격
                     cObj.SetLMAofMACDS( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     // 이동평균 간격 - signal
                     cObj.SetSIGofMACDS( IndicatorHandle, IndicatorIntervals[ 2 ] );
                     break;
                case "pmaostick":                                                                    // PMAOSTICK       ( Price Moving Average Oscillator - Stick )
                     // 이동평균 간격 - 단기 간격
                     cObj.SetSMAofPMAOS( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // 이동평균 간격 - 장기 간격
                     cObj.SetLMAofPMAOS( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     // 이동평균 간격
                     //cObj.SetMAofPMAOStickMA( IndicatorHandle, IndicatorIntervals[ 2 ] );
                     // 수정 2006/01/13
                     cObj.SetMAofPMAOS( IndicatorHandle, IndicatorIntervals[ 2 ] );
                     break;
                case "vmaostick":                                                                    // VMAOSTICK       ( Volume Moving Average Oscillator - Stick )
                     // 이동평균 간격 - 단기 간격
                     cObj.SetSMAofVMAOS( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // 이동평균 간격 - 장기 간격
                     cObj.SetLMAofVMAOS( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     // 이동평균 간격
                     cObj.SetMAofVMAOS( IndicatorHandle, IndicatorIntervals[ 2 ] );
                     break;
                case "stochastics":                                                                  // STOCHASTICS     (  )
                case "stochastics_dw":                                                               // STOCHASTICS_DW  (  )
                     // 유형 - [FAST:0 / SLOW:1 (defalut : SLOW)]
                     cObj.SetTypeofStochastics( IndicatorHandle, Iif( ToLower( IndicatorIntervals[ 0 ] ) == "fast", 0, 1 ) );
                     // SLOW 기간
                     cObj.SetSlowofStochastics( IndicatorHandle, parseInt( IndicatorIntervals[ 1 ] ) );
                     // %K
                     cObj.SetKPRofStochastics( IndicatorHandle, parseInt( IndicatorIntervals[ 2 ] ) );
                     // %D
                     cObj.SetDPRofStochastics( IndicatorHandle, parseInt( IndicatorIntervals[ 3 ] ) );
                     break;
                case "trix":                                                                         // TRIX            (  )
                     // TRIX 이동평균 간격
                     cObj.SetMAofTrix( IndicatorHandle, IndicatorIntervals[ 0 ] );
                     // 시그널 이동평균 간격
                     cObj.SetSignalMAofTrix( IndicatorHandle, IndicatorIntervals[ 1 ] );
                     break;
                case "rcindex":                                                                      // RCIndex         (  )
                     // 이동평균 간격 long nMA
                     cObj.SetMAofRCIndex( IndicatorHandle, parseInt( IndicatorIntervals[ 0 ] ) );
                     break;
                case "vwap" :                                                                        // VWAP            (  )
                     // 이동평균 간격 long nMA
                     cObj.SetMAofVwap( IndicatorHandle, parseInt( IndicatorIntervals[ 0 ] ) );
                     break;
                case "percentr" :                                                                    // Williams's Percent R (  )
                     // 이동평균 기간
                     cObj.SetMAofPR( IndicatorHandle, parseInt( IndicatorIntervals[ 0 ] ) );
                     break;
                default :
                     break;
            }
        }
        ds.SetColumn( dsRowIdx, "scaleHandle" , scaleHandle  );
        ds.SetColumn( dsRowIdx, "hScaleHandle", hScaleHandle );

        /********************************************************************************************
         * 차트 종류에 따른 차트 속성 설정
         ********************************************************************************************/
        chartHandle = cObj.GetChart( cMgr, ( areaHandle + chartOrder ) );
        switch ( ToLower( chartType ) )
        {
            case "americanstick":   // 미국식바챠트
                 cObj.l2SetTitle2( chartHandle, chartTitleList[ 0 ] );
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 //if ( dsChartDetail != null ) initChartAmericanStick( aChartObject, aChartManager, aChartHandle, aDsChartSpec );
                 if ( dsChartDetail != null ) initChartAmericanStick( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "candlestick"  :   // 일본식봉차트 ( 로그 차트 기능 포함)
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartCandleStick( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "ccw"          :   // 역시계곡선
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartCCW( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "eqv"          :   // EQV ( Equivolume Chart )
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartEquivolume( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "groupstick"   :   // 그룹막대
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartGroupStick( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "illmok"       :   // 일목균형표
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartIllmok( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "linechart":     // 선차트
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) {
                     initChartLine1 ( cObj, cMgr, chartHandle, dsChartDetail );
                 } else {
                     if ( ( lineStylesList[ 0 ] != null ) and ( lineWidthsList[ 0 ] != null ) and ( lineColorsList[ 0 ] != null ) )
                         cObj.plSetLine( chartHandle, toLineStyleValue( lineStylesList[ 0 ] ), lineWidthsList[ 0 ], ToColorValue( lineColorsList[ 0 ], true ) );
                 }
                 break;
            case "line2chart":    // 선그래프 2
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
            case "line3chart":    // 선그래프 3
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
            case "mkprofile_dw" :   // Market Profile (동원)
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
            case "pnv"          :   // 가격대별 거래량 챠트 (Volume at Price Chart)
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartPNV ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "pv"           :   // PVCHART
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartPV ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "radarchart"   :   // 레이더 차트
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartRadar ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "ratiostick"   :   // 비율막대
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartRatio ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "simplestick"  :   // 막대그래프
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 cObj.ssSetColor( chartHandle, ToColorValue( lineColorsList[ 0 ], true ), ToColorValue( lineColorsList[ 0 ], true ) );
                 if ( dsChartDetail != null ) initChartSimpleStick ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "simplestickp" :   // 막대그래프(현재가)
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartSimpleStickP ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "swing"        :   // Swing
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartSwing ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "threechange"  :   // 삼선전환도
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartThreeChange ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
           case "_percentline"  :   // 백분율 차트
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartPercentLine ( cObj, cMgr, chartHandle, dsChartDetail );
                 else {
                     if ( ( lineStylesList[ 0 ] != null ) and ( lineWidthsList[ 0 ] != null ) and ( lineColorsList[ 0 ] != null ) )
                         cObj.l1SetLine( chartHandle, toLineStyleValue( lineStylesList[ 0 ] ), lineWidthsList[ 0 ], ToColorValue( lineColorsList[ 0 ], true ) );
                 }
                 break;
           case "percentline"  :   // 백분율 차트
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartPercentLine ( cObj, cMgr, chartHandle, dsChartDetail );
                cObj.l1SetLine( chartHandle, toLineStyleValue( lineStylesList[ 0 ] ), lineWidthsList[ 0 ], ToColorValue( lineColorsList[ 0 ], true ) );
                 break;
            case "netchart"     :   // 그물차트
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartNet ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "colorstick"   :   // 색상막대
                 dsChartDetail = Object( ds.GetColumn( dsRowIdx, "chartDetailSpecDataSet" ) );
                 if ( dsChartDetail != null ) initChartColorStick ( cObj, cMgr, chartHandle, dsChartDetail );
                 break;
            case "piechart"     :   // 파이차트
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
    * 미국식바 차트 속성 설정
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

    // 선속성 [ long lStyle, long lWidth, long lColor ]
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "lineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "lineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor", "white" ), true );
    cObj.asSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // Min, Max 표시 여부- 폰트, Min색상, Max색상 [ BYTE bDisp true:1 최대값/ false:0 최소값]
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "TRUE" ) ) == "false", 0, 1 );
    cObj.asSetDispMinMax( chartHandle, attrItemVal );

    // 폰트 스타일 [ char* szFaceName, long lHeight, long lWeight, BYTE nItalic, BYTE nUnderline, BYTE nStrikeOut ]
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "titleFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "titleFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "titleFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "titleFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "titleFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "titleFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.asSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4,attrItemVal5, attrItemVal6 );

    // 폰트 색상 [ long lMax:최대값의 출력 색상, long lMin:최소값의 출력 색상 ]
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.asSetTextColor( chartHandle, attrItemVal, attrItemVal2 );
}

function initChartCandleStick( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * 일본식봉 차트 속성 설정
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

    // 폭
    // - bAuto  : 봉의 폭을 자동으로 결정할지 여부로서, bAuto가 1인 경우에 봉의 폭을 자동처리 한다 (DEFAULT :     //;
    // - nWidth : 봉의 폭
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "autoWidth", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "widthVal", 0 ) );
    cObj.csSetWidth( chartHandle, attrItemVal, attrItemVal2 );

    // 최대값, 최소값 출력여부 [ true/false ]
    // - bDisp: bDisp가 true 이면 출력
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.csSetDispMinMax( chartHandle, attrItemVal );
    // 폰트 스타일 [ char* szFaceName, long lHeight, long lWeight, BYTE nItalic, BYTE nUnderline, BYTE nStrikeOut ]
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "fontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "fontHeight", 10 ) );

    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "fontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "fontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "fontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "fontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.csSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );
    
    // 최대값, 최소값 출력색상 설정
    // - lMax : 최대값의 출력 색상
    // - lMin : 최소값의 출력 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.csSetTextColor2( chartHandle, attrItemVal, attrItemVal2 );

    // 락 표시 여부
    // - bDisp : bDisp가 1이면 락 출력 (DEFAULT : 0) (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayRak", "false" ) ) == "false", 0, 1 );

	//임시로수정 2006/01/12 csSetDispRak 로 메소드명 변경신청 해놓았음
    cObj.csSetDispRak( chartHandle, attrItemVal );
  //cObj.csSetDispLak( chartHandle, attrItemVal );

    // 락 폰트
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "rakFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontStrikeOut", "false" ) ) == "false", 0, 1 );

	//임시로수정 2006/01/12 csSetFontRak 로 메소드명 변경신청 해놓았음
    //cObj.csSetFontRak( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );
	cObj.csSetRakFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // 락 표시 색상
    // - long lColor
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "rakColor", "black" ), true );
    cObj.csSetRakTextColor( chartHandle, attrItemVal );

    // 상승색상 - 내부채움
    // - lColor : 상승봉의 색상
    // - bFill  : bFill이  1이면 상승봉의 내부 채움  (DEFAULT : 0)
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "upTrendColor", "black" ), true );
    attrItemVal2 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "upTrendFill", "true" ) ) == "false", 0, 1 );
    cObj.csSetUpColor( chartHandle, attrItemVal, attrItemVal2 );

    // 하락색상
    // - lColor : 하락봉의 색상
    // - bFill  : bFill이  1이면 하락봉의 내부 채움  (DEFAULT : 0)
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "downTrendColor", "black" ), true );
    attrItemVal2 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "downTrendFill", "true" ) ) == "false", 0, 1 );
	//임시로수정 2006/01/12  bFill 파라미터 추가 요청 해놓았음
    //cObj.csSetDownColor( chartHandle, attrItemVal, attrItemVal ); //두번째 파라미터명도 원본소스에서 틀렸음  attrItemVal2 가 맞음
    //cObj.csSetDownColor( chartHandle, attrItemVal, attrItemVal2 );
    cObj.csSetDownColor( chartHandle, attrItemVal, attrItemVal2);
}

function initChartCCW ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * 역시계곡선 차트 속성 설정
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

    // 범례 사용 여부
    // - bDisp : bDisp가 1이면 범례 사용 (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayLegend", "true" ) ) == "false", 0, 1 );
    cObj.ccwSetDispLegend( chartHandle, attrItemVal );

    // 폰트 스타일 [ char* szFaceName, long lHeight, long lWeight, BYTE nItalic, BYTE nUnderline, BYTE nStrikeOut ]
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "fontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "fontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "fontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "fontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "fontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "fontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.ccwSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // 락의 폰트 색상 설정
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "legendColor", "silver" ), true );
    cObj.ccwSetLegendColor( chartHandle, attrItemVal );

    // 이동평균사용 - 역시계곡선의 데이터는 종가의 20일 이동평균
    // - bUse : bUse가 1이면, 이동평균 사용 (DEFAULT : 0)
    // - lVal : 이동평균값
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useMoveAvg"   , "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "moveAvgVal", 0 ) );
    cObj.ccwSetMoveAvg( chartHandle, attrItemVal, attrItemVal2 );

    // 선속성 [ long lStyle, long lWidth, long lColor ]
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "lineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "lineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor1", "silver" ), true );
    attrItemVal4 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor2", "silver" ), true );
    attrItemVal5 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor3", "silver" ), true );
    attrItemVal6 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor4", "silver" ), true );
    attrItemVal7 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor5", "silver" ), true );
    cObj.ccwSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6, attrItemVal7 );

    // 시작/끝점
    // - bDisp  : bDisp가 1이면, 시작/끝점 문자 표시(T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useSEPoint", "false" ) ) == "false", 0, 1 );
    cObj.ccwSetDispPoint( chartHandle, attrItemVal );

    // 시작/끝점의 크기를 결정한다.
    // - lSize : 시작/끝점의 크기(1~100)
    attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "SEPointSize", 0 ) );
    cObj.ccwSetPointSize( chartHandle, attrItemVal );

    // 시작점의 형태 및 색상 설정
    // - lStyle : 시작점의 형태["NONE:0","CIRCLE:1","RECT:2"(DEFAULT)]
    // - lColor : 시작점의 색상
    attrItemVal  = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "startPointStyle", "RECT" ) ), "none", 0, "circle", 1, "rect", 2 );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "startPointColor", "black" ), true );
    cObj.ccwSetStartPoint( chartHandle, attrItemVal, attrItemVal2 );

    // 끝점의 형태 및 색상 설정
    // - lStyle : 끝점의 형태["NONE:0","CIRCLE:1","RECT:2"(DEFAULT)]
    // - lColor : 끝점의 색상
    attrItemVal  = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "endPointStyle", "RECT" ) ), "none", 0, "circle", 1, "rect", 2 );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "endPointColor", "black" ), true );
    cObj.ccwSetEndPoint( chartHandle, attrItemVal, attrItemVal2 );
}

function initChartEquivolume( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * Equivolume 차트 속성 설정
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

    // 상승색상 - 내부채움
    // - lColor : 상승 색상
    // - bFill  : bFill가  TRUE이면 상승봉의 내부 채움 (default : FALSE)
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "upTrendColor", "black" ), true );
    attrItemVal2 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "upDownTrendFill", "true" ) ) == "false", 0, 1 );
    cObj.eqvSetUpColor( chartHandle, attrItemVal, attrItemVal2 );

    // 하락색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "downTrendColor", "black" ), true );
    cObj.eqvSetDownColor ( chartHandle, attrItemVal );

    // Min-Max 표시 여부(T/F)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.eqvSetDispMinMax( chartHandle, attrItemVal );

    // Min-Max 폰트 스타일 [ char* szFaceName, long lHeight, long lWeight, BYTE nItalic, BYTE nUnderline, BYTE nStrikeOut ]
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.eqvSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // Min-Max 폰트 색상
    // - lMax : 최대값의 출력 색상
    // - lMin : 최소값의 출력 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.eqvSetTextColor( chartHandle, attrItemVal, attrItemVal2 );

    //------------------------------------------------------------------------------
    // 시계열속성
    //------------------------------------------------------------------------------
    // 시계열라인 표시 여부
    // - bDisp : bDisp가 1이면 시계열 라인 출력여부(T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayTimeLine", "false" ) ) == "false", 0, 1 );
    cObj.eqvSetDispTimeLine( chartHandle, attrItemVal );

    // 시계열라인 스타일
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineLineStyle", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineLineWidth", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineLineColor", "silver" ) );
    cObj.eqvSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // 보조선 표시 여부(T/F)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useTimeLineGuideLine", "TRUE" ) ) == "false", 0, 1 );
    cObj.eqvSetDispAssistLine( chartHandle, attrItemVal );

    // 보조선 스타일 설정 (선 스타일, 두께, 색상)
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineGuideLineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineGuideLineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineGuideLineColor", "silver" ), true );
    cObj.eqvSetAssistLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // 영역 여백 띄우기
    // - lBottom : 하단 영역 마진 (DEFAULT : 20 )
    // - lLeft   : 좌측 영역 마진 (DEFAULT : 0  )
    // - lRight  : 우측 영역 마진 (DEFAULT : 0  )
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineMarginBottom" , 20 ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineMarginLeft"   , 0  ) );
    attrItemVal3 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineMarginRight"  , 0  ) );
    cObj.eqvSetMargin( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // 시계열 폰트 [ char* szFaceName, long lHeight, long lWeight, BYTE nItalic, BYTE nUnderline, BYTE nStrikeOut ]
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.eqvSetTimeWndFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // 시계열라인 폰트 색상 설정
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "timeLineFontColor", "black" ), true );
    cObj.eqvSetXTextColor( chartHandle, attrItemVal );
}

function initChartGroupStick( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * 그룹막대 차트 속성 설정
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

    // 막대갯수
    // - lNum : 출력할 막대 개수
    attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "displayStickCount", 4 ) );
    cObj.gsSetStickNum( chartHandle, attrItemVal );
    iCnt = attrItemVal;

    // 막대 인덱스
    attrItemVal  = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickIndexs", 0 ), "," );
    // 막대 이름
    attrItemVal2 = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickTitles", 0 ), "," );
    // 막대 색상
    attrItemVal3 = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickColors", 0 ), "," );
    // 막대 채움 스타일
    attrItemVal4 = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickFillStyle", 0 ), "," );

    for ( i = 0; i < iCnt; i++ )
    {
        // 막대속성 - 이름, 색상, 패턴
        // - lIdx       : 막대 인덱스
        // - szName     : 막대 이름
        // - lColor     : 막대 색상
        // - lFillStyle : 막대 채움 스타일 ( DEFAULT:FILL )
        //               (0.HORIZONTAL, 1.VERTICAL, 2.FDIAGONAL, 3.BDIAGONAL, 4.CROSS, 5.DIACROSS, 6.FILL)
        cObj.gsSetStick( chartHandle, parseInt( attrItemVal[ i ] ), attrItemVal2[ i ], ToColorValue( attrItemVal3[ i ], true ), toFillStyleValue( attrItemVal4[ i ] ) );
    }

    // 막대폭 - 자동조절
    // - bAuto  : bAuto가 1이면 막대폭 자동 조절
    // - lWidth : 막대의 폭
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "autoWidth", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "widthVal", 0 ) );
    cObj.gsSetWidth( chartHandle, attrItemVal, attrItemVal2 );

    // 범례 표시 여부(T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayLegend", "true" ) ) == "false", 0, 1 );
    cObj.gsSetDispLegend( chartHandle, attrItemVal );

    // 범례 글꼴 설정
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "legendFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.gsSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // 그룹막대 표현 방식(2D/3D)
    // - bType : lType이 0이면 2D, 1이면 3D (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "demension", "2D" ) ) == "2d", 0, 1 );
    cObj.gsSetDemension( chartHandle, attrItemVal );

    // 3D 선택사항 - 기울기, 깊이, 음영
    // - bAuto  : bAuto가 1이면 기울기, 깊이, 음영이 자동으로 조절된다
    // - nSlop  : 막대 3D 그림자와의 각도
    // - nDepth : 깊이->몸통너비 대비
    // - nShad  : 음영
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "use3DAuto", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "slop3D" , 20 ) );
    attrItemVal3 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "depth3D", 4  ) );
    attrItemVal4 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "shad3D" , 30 ) );
    cObj.gsSet3DStyle( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4 );

    // 시작점에 맞춤 여부(T/F)
    // - bSetStart : bSetStart가 1이면 그래프를 시작점에 맞춘다
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "alignStartPoint", "false" ) ) == "false", 0, 1 );
    cObj.gsSetStartPoint( chartHandle, attrItemVal );

    // Data값 표현 여부(T/F)
    // - bDisp : bDisp가 1이면 해당 막대의 값을 출력한다 (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayDataTitle", "false" ) ) == "false", 0, 1 );
    cObj.gsSetDispValue( chartHandle, attrItemVal );
}

function initChartIllmok( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * 일목균형표 차트 속성 설정
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

    // 차트제목 출력여부 (T/F)
    // - bDisp : bDisprk 1이면 차트 제목에 범례 출력 (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayLegend", "true" ) ) == "false", 0, 1 );
    cObj.imSetDispLegend( chartHandle, attrItemVal );

    // 기준선 - 종류, 굵기, 색상
    // - lStyle : 기준선 스타일 (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : 기준선의 폭 (DEFAULT :     //
    // - lColor : 기준선의 색상
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "baseLineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "baseLineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "baseLineColor", "white" ), true );
    cObj.imSetBaseLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // 전환선 - 종류, 굵기, 색상
    // - lStyle : 전환선 스타일 (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : 전환선의 폭 (DEFAULT :     //
    // - lColor : 전한선의 색상
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "turnLineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "turnLineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "turnLineColor", "white" ), true );
    cObj.imSetTurnLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // 구름대(양운) - 채우기, 색상
    // - lFillStyle : 구름대 채움 스타일 (DEFAULT : FILL)
    //                (0.HORIZONTAL, 1.VERTICAL, 2.FDIAGONAL, 3.BDIAGONAL, 4.GROSS, 5.DIAGCROSS, 6.FILL)
    // - lColor     : 구름대 채움 색상

    attrItemVal  = toFillStyleValue( getAttributeVal( ds, "attributeId", "attributeVal", "yangunFillStyle", "FILL" ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "yangunColor", "black" ), true );
    cObj.imSetYangunFill( chartHandle, attrItemVal, attrItemVal2 );

    // 구름대(음운) - 채우기, 색상
    // - lFillStyle : 구름대 채움 스타일 (DEFAULT : FILL)
    //                (0.HORIZONTAL, 1.VERTICAL, 2.FDIAGONAL, 3.BDIAGONAL, 4.GROSS, 5.DIAGCROSS, 6.FILL)
    // - lColor     : 구름대 채움 색상
    attrItemVal  = toFillStyleValue( getAttributeVal( ds, "attributeId", "attributeVal", "umunFillStyle", "FILL" ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "umunColor", "black" ), true );
    cObj.imSetUmunFill( chartHandle, attrItemVal, attrItemVal2 );

    // 후행스팬 - 종류, 굵기, 색상
    // - lStyle : 후행스팬선 스타일 (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : 후행스팬선의 폭
    // - lColor : 후행스팬선의 색상
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "backSpanLineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "backSpanLineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "backSpanLineColor", "white" ), true );
    cObj.imSetBackLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // 선행스팬1 - 종류, 굵기, 색상
    // - lStyle : 선행스팬1선 스타일 (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : 선행스팬1선의 폭
    // - lColor : 선행스팬1선의 색상
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "foreSpanLine1Style", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "foreSpanLine1Width", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "foreSpanLine1Color", "white" ), true );
    cObj.imSetForeLine1( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // 선행스팬2 - 종류, 굵기, 색상
    // - lStyle : 선행스팬2선 스타일 (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : 선행스팬2선의 폭
    // - lColor : 선행스팬2선의 색상
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "foreSpanLine2Style", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "foreSpanLine2Width", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "foreSpanLine2Color", "white" ), true );
    cObj.imSetForeLine2( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );
}

function initChartLine1 ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * 차트 속성 설정
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

    // Data에 Point 표시 - 종류(원, 사각, 없음)
    // - bDisp : bDisp가 1이면 data에 point를 표시한다 (DEFAULT : 0)
    // - lType : 0이면 원, 1이면 사각형, 2면 없음
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDataPoint", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "dataPointStyle", "NONE" ) ), "circle", 0, "rect", 1, "none", 2 );
    cObj.l1SetDispPoint( chartHandle, attrItemVal, attrItemVal2 );

    // 최대/최소값 출력 여부(T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.l1SetDispMinMax( chartHandle, attrItemVal );

    // 최저/최고 폰트 속성
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.l1SetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // 최저/최고 폰트 색상
    // - lMax : 최대값의 출력 색상
    // - lMin : 최소값의 출력 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.l1SetTextColor( chartHandle, attrItemVal, attrItemVal2 );

    // 과열/침체 표시 여부 (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayHotCold"   , "false" ) ) == "false", 0, 1 );
    cObj.l1SetDispHotCold( chartHandle, attrItemVal );

    // 과열 경계값 및 색상
    // - lValue : 과열 경계값
    // - lColor : 과열 색상
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "hotVal", 100 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "hotColor", "black" ), true );
    cObj.l1SetHotValue( chartHandle, attrItemVal, attrItemVal2 );

    // 침체  경계값 및 색상
    // - lValue : 침체 경계값
    // - lColor : 침체 색상
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "coldVal", -100 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "coldColor", "black" ), true );
    cObj.l1SetColdValue( chartHandle, attrItemVal, attrItemVal2 );

    // 0값 무시 여부 (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "ignoreZeroVal", "false" ) ) == "false", 0, 1 );
    cObj.l1SetZeroValue( chartHandle, attrItemVal );

    // 선속성 - 형태, 굵기, 색상
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "line1Style", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "line1Width", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "line1Color", "silver" ) );
    cObj.l1SetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );
}

function initChartLine2 ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * 선그래프2 차트 속성 설정
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

    // 차트영역에 출력할 첫번째 선그래프차트의 제목
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title1" , "" );
    cObj.l2SetTitle( chartHandle, attrItemVal );

    // 차트영역에 출력할 두번째 선그래프차트의 제목
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title2" , "" );
    cObj.l2SetTitle2( chartHandle, attrItemVal );

    // Data에 Point 표시 - 종류(원, 사각, 없음)
    // - bDisp : bDisp가 1이면 data에 point를 표시한다 (DEFAULT : 0)
    // - lType : 0이면 원, 1이면 사각형, 2면 없음
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDataPoint", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "dataPointStyle", "NONE" ) ), "circle", 0, "rect", 1, "none", 2 );
    cObj.l2SetDispPoint( chartHandle, attrItemVal, attrItemVal2 );

    // 최대/최소값 출력 여부(T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.l2SetDispMinMax( chartHandle, attrItemVal );

    // 최저/최고 표시 - 폰트
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.l2SetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // 최저/최고 표시 - 색상
    // - lMax : 최대값의 출력 색상
    // - lMin : 최소값의 출력 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.l2SetTextColor( chartHandle, attrItemVal, attrItemVal2 );

    // 과열/침체 표시 여부 (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayHotCold", "false" ) ) == "false", 0, 1 );
    cObj.l2SetDispHotCold( chartHandle, attrItemVal );

    // 과열 경계값 및 색상 설정
    // - lValue : 과열 경계값
    // - lColor : 과열 색상
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "hotVal", 100 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "hotColor", "black" ), true );
    cObj.l2SetHotValue( chartHandle, attrItemVal, attrItemVal2 );

    // 침체 경계값 및 색상 설정
    // - lValue : 침체 경계값
    // - lColor : 침체 색상
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "coldVal", -100 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "coldColor", "black" ), true );
    cObj.l2SetColdValue( chartHandle, attrItemVal, attrItemVal2 );

    // 0값 무시 여부 (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "ignoreZeroVal", "false" ) ) == "false", 0, 1 );
    cObj.l2SetZeroValue( chartHandle, attrItemVal );

    // 선속성1 - 형태, 굵기, 색상
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "line1Style", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "line1Width", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "line1Color", "silver" ) );
    cObj.l2SetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // 선속성2 - 형태, 굵기, 색상
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "line2Style", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "line2Width", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "line2Color", "silver" ) );
    cObj.l2SetLine2( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );
}

function initChartLine3 ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * 선그래프3 차트 속성 설정
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

    // 차트영역에 출력할 첫번째 선그래프차트의 제목
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title1" , "" );
    cObj.l3SetTitle( chartHandle, attrItemVal );

    // 차트영역에 출력할 두번째 선그래프차트의 제목
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title2" , "" );
    cObj.l3SetTitle2( chartHandle, attrItemVal );

    // 차트영역에 출력할 세번째 선그래프차트의 제목
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title3" , "" );
    cObj.l3SetTitle3( chartHandle, attrItemVal );

    // Data에 Point 표시 - 종류(원, 사각, 없음)
    // - bDisp : bDisp가 1이면 data에 point를 표시한다 (DEFAULT : 0)
    // - lType : 0이면 원, 1이면 사각형, 2면 없음
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDataPoint", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "dataPointStyle", "NONE" ) ), "circle", 0, "rect", 1, "none", 2 );
    cObj.l3SetDispPoint( chartHandle, attrItemVal, attrItemVal2 );

    // 0값 무시
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "ignoreZeroVal", "false" ) ) == "false", 0, 1 );
    cObj.l3SetZeroValue( chartHandle, attrItemVal );

    // 최대/최소값 출력 여부(T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.l3SetDispMinMax( chartHandle, attrItemVal );

    // 최대값, 최소값의 폰트 설정
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.l3SetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // 최대값, 최소출력 색상 설정
    // - lMax : 최대값의 출력 색상
    // - lMin : 최소값의 출력 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.l3SetTextColor( chartHandle, attrItemVal, attrItemVal2 );

    // // 과열/침체 표시 여부 (T/F)
    // attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayHotCold", "false" ) ) == "false", 0, 1 );
    // cObj.l3SetDispHotCold( chartHandle, attrItemVal );

    // // 과열 경계값 및 색상 설정
    // // - lValue : 과열 경계값
    // // - lColor : 과열 색상
    // attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "hotVal", 100 ) );
    // attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "hotColor", "black" ), true );
    // cObj.l3SetHotValue( chartHandle, attrItemVal, attrItemVal2 );

    // // 침체 경계값 및 색상 설정
    // // - lValue : 과열 경계값
    // // - lColor : 과열 색상
    // attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "coldVal", -100 ) );
    // attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "coldColor", "black" ), true );
    // cObj.l3SetColdValue( chartHandle, attrItemVal, attrItemVal2 );

    // 선속성1 - 형태, 굵기, 색상
    // - lStyle : 선그래프1의 스타일 (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : 선그래프1의 폭
    // - lColor : 선그래프1의 색상
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "line1Style", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "line1Width", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "line1Color", "silver" ) );
    cObj.l3SetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // 선속성2 - 형태, 굵기, 색상
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "line2Style", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "line2Width", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "line2Color", "silver" ) );
    cObj.l3SetLine2( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // 선속성3 - 형태, 굵기, 색상
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "line3Style", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "line3Width", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "line3Color", "silver" ) );
    cObj.l3SetLine3( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );
}

function initChartMarketProfile ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * Market Profile(DW) 차트 속성 설정
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

    // 텍스트색상
    // - lColor : 텍스트 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "textColor", "black" ), true );
    cObj.mpSetTextColor( chartHandle, attrItemVal );

    // 제목 배경 색상
    // - lColor : 제목 배경 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "titleBkColor", "black" ), true );
    cObj.mpSetTitleColor( chartHandle, attrItemVal );

    // 데이터 배경색상
    // - lColor : 데이터 배경 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "dataBkColor", "black" ), true );
    cObj.mpSetDataColor( chartHandle, attrItemVal );

    // 극단 배경색상
    // - lColor : 극단 배경 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "extremeBkColor", "black" ), true );
    cObj.mpSetExtremeColor( chartHandle, attrItemVal );

    // TPO 배경색상
    // - lColor : TOP 배경 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "tpoBkColor", "black" ), true );
    cObj.mpSetTPOColor( chartHandle, attrItemVal );

    // 중심가격 배경색상
    // - lColor : 중심가격 배경 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "priceBkColor", "black" ), true );
    cObj.mpSetPriceColor( chartHandle, attrItemVal );

    // 매도/매수 배경색상
    // - lColor : 매도/매수 배경 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "saleBuyBkColor", "black" ), true );
    cObj.mpSetSaleBuyColor( chartHandle, attrItemVal );

    // 글꼴
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
    * Parabolic 차트 속성 설정
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

    // 선표시 - 형태, 굵기, 색상
    // - lStyle : 선 스타일 (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : 선의 폭
    // - lColor : 선의 색상
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "lineWidth", 1 );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor", "silver" ) );
    cObj.prSetLine( chartHandle, attrItemVal, attrItemVal2);


}

function initChartPF ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * P&F 차트 속성 설정
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

    // O/X - 단위가격, 상승색상, 하락색상, 상승일자색상, 하락일자색상
    // - lPrice        : 단위가격
    // - lUpColor      : 상승그래프의 색상
    // - lDownColor    : 하락그래프의 색상
    // - lUpDayColor   : 상승일자색상
    // - lDownDayColor : 하락일자색상
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
    * 가격대별 거래량(Volume at Price Chart) 차트 속성 설정
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

    // 막대 - 두께, 두께 자동조절
    // - bAuto  : bAuto가 0이면 막대폭 자동조절
    // - lWidth : 막대의 폭
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "autoWidth", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "widthVal", 0 ) );
    cObj.pnvSetWidth( chartHandle, attrItemVal, attrItemVal2 );

    // 막대 - 색상
    // - lColor : 막대그래프의 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "stickColor", "black" ), true );
    cObj.pnvSetStickColor( chartHandle, attrItemVal );

    // 막대 - 거래량 점유율 표시 여부(T/F)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "possessionRate", "false" ) ) == "false", 0, 1 );
    cObj.pnvSetDispValue( chartHandle, attrItemVal );

    // 막대 - 거래량점유율 폰트
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "posRateFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "posRateFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "posRateFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "posRateFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "posRateFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "posRateFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.pnvSetShareFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // 선 표시 여부 (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayLine", "false" ) ) == "false", 0, 1 );
    cObj.pnvSetDispLine( chartHandle, attrItemVal );

    // 선의 속성 설정
    // - lStyle : 선 스타일 (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth : 선의 폭
    // - lColor : 선의 색상
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "lineStyle", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "lineWidth", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor", "silver" ) );
    cObj.pnvSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // 최대/최소값 출력 여부(T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.pnvSetDispMinMax( chartHandle, attrItemVal );

    // 최대값, 최소값의 폰트 설정
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.pnvSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // 최대값, 최소값의 출력 색상
    // - lMax : 최대값의 출력 색상
    // - lMin : 최소값의 출력 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.pnvSetTextColor( chartHandle, attrItemVal, attrItemVal2 );
}

function initChartPV ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * PV 차트 속성 설정
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

    // 선속성(형태, 굵기, 색상)
    // - lStyle            : 선 스타일 (0.SOLID, 1.DASH, 2.DOT, 3.DASHDOT, 4.DASHDOTDOT, DEFAULT : SOLID)
    // - lWidth            : 선의 폭 (DEFAULT :     //
    // - lColor1           : 선1의 색상
    // - lColor2           : 선2의 색상
    // - lColor3           : 선3의 색상
    // - lColor4           : 선4 의 색상
    // - lColor5           : 선5 의 색상
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "lineStyle", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "lineWidth", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor1", "silver" ) );
    attrItemVal4 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor2", "silver" ) );
    attrItemVal5 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor3", "silver" ) );
    attrItemVal6 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor4", "silver" ) );
    attrItemVal7 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor5", "silver" ) );
    cObj.pvSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6, attrItemVal7 );

    // 시작/끝점 문자표시 여부 설정
    // - bDisp : bDisp가 1이면, 시작/끝점 문자 표시
    // - lSize : 시작/끝점 크기
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useSEPoint", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "SEPointSize", 0 ) );
    cObj.pvSetDispPoint( chartHandle, attrItemVal, attrItemVal2 );

    // 시작점 스타일 및 색상 설정
    // - lStyle : 시작점의 형태(없음, 원, 사각, DEFAULT : 없음)
    // - lColor : 시작점의 색상
    attrItemVal  = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "startPointStyle", "RECT" ) ), "none", 0, "circle", 1, "rect", 2 );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "startPointColor", "black" ), true );
    cObj.pvSetStartPoint( chartHandle, attrItemVal, attrItemVal2 );

    // 끝점 스타일 및 색상 설정
    // - lStyle : 끝점의 형태(없음, 원, 사각, DEFAULT : 없음)
    // - lColor : 끝점의 색상
    attrItemVal  = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "endPointStyle", "RECT" ) ), "none", 0, "circle", 1, "rect", 2 );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "endPointColor", "black" ), true );
    cObj.pvSetEndPoint( chartHandle, attrItemVal, attrItemVal2 );

    // 이동평균사용 여부(T/F)
    // - bUse : bUse가 1이면 이동평균 사용 (DEFAULT : 0)
    // - lVal : 이동평균
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useMoveAvg"   , "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "moveAvgVal", 0 ) );
    cObj.pvSetMoveAvg( chartHandle, attrItemVal, attrItemVal2 );
}

function initChartRadar ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * 레이더그래프 차트 속성 설정
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

    // 배경 - 제목
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "title", "" );
    cObj.rcSetTitle( chartHandle, attrItemVal );

    // 배경 - 타이틀 폰트 변경
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "bkTitleFontFaceName " , "default" );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "bkTitleFontHeight"   , 10          );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "bkTitleFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "bkTitleFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "bkTitleFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "bkTitleFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.rcSetBackFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // 배경 - 타이틀 폰트 색상
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "bkTitleFontColor", "black" ), true );
    cObj.rcSetBackTextColor( chartHandle, attrItemVal );

    // 전경 - 라인/파이/평균선 색상
    // ( 0~9: 라인색상, 11: 파이색상, 12:평균선 색상 )
    // - nCnt   : 인덱스
    // - lIndex : 색번호
    for ( i = 1; i < 13; i++ )
    {
        attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", ( "foreLineColor" + i ), "black" ), true );
        cObj.rcSetColor( chartHandle, i, attrItemVal );
    }

    // 전경 - 정보 텍스트 폰트 변경
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "foreTextFontFaceName " , "default" );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "foreTextFontHeight"   , 10          );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "foreTextFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "foreTextFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "foreTextFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "foreTextFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.rcSetForeFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // 전경 - 정보 텍스트 폰트 색상
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "foreTextFontColor", "black" ), true );
    cObj.rcSetForeTextColor( chartHandle, attrItemVal );
}

function initChartRatio ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * 비율막대 차트 속성 설정
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

    // 비율막대의 항목갯수 (최대: 20개)
    // - lNum : 항목갯수
    attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "displayStickCount", 4 ) );
    cObj.rsSetStickNum( chartHandle, attrItemVal );
    iCnt = attrItemVal;

    // 막대 인덱스
    attrItemVal  = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickIndexs", 0 ), "," );
    // 막대 이름
    attrItemVal2 = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickTitles", 0 ), "," );
    // 양수 막대 색상
    attrItemVal3 = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickUpColors", 0 ), "," );
    // 음수 막대 색상
    attrItemVal4 = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickDownColors", 0 ), "," );
    // 막대 채움 스타일
    attrItemVal5 = Split( getAttributeVal( ds, "attributeId", "attributeVal", "stickFillStyles", 0 ), "," );

    for ( i = 0; i < iCnt; i++ )
    {
        // 항목2속성 - 이름, 색상, 패턴
        // - lIdx       : 막대 인덱스
        // - szName     : 막대 이름
        // - lColor     : 막대 색상 (양수 or 음수 색상)
        // - lFillStyle : 막대 채우기 스타일 (DEFAULT : FILL)
        //                (0.HORIZONTAL, 1.VERTICAL, 2.FDIAGONAL, 3.BDIAGONAL, 4.GROSS, 5.DIAGCROSS, 6.FILL)
        cObj.rsSetStick2( chartHandle, parseInt( attrItemVal[ i ] ), attrItemVal2[ i ], ToColorValue( attrItemVal3[ i ], true ), ToColorValue( attrItemVal4[ i ], true ), toFillStyleValue( attrItemVal5[ i ] ) );
    }

    // 막대폭 - 자동조절
    // - bAuto  : bAuto가 FALSE인 경우에 nWidth가 의미가 있다 (default : TRUE).
    // - lWidth : 막대의 폭
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "autoWidth", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "widthVal", 0 ) );
    cObj.rsSetWidth( chartHandle, attrItemVal, attrItemVal2 );

    // 범례표시 여부(T/F)
    // - bDisp : bDisp가 1이면 범례 표시
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayLegend", "true" ) ) == "false", 0, 1 );
    cObj.rsSetDispLegend( chartHandle, attrItemVal );

    // 범례 글꼴 설정
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "legendFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "legendFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.rsSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // 표현방식(2D Chart, 3D Chart)
    // - bType : lType이 0이면 2D, 1이면 3D (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "demension", "2D" ) ) == "2d", 0, 1 );
    cObj.rsSetDemension( chartHandle, attrItemVal );

    // 3D 선택사항 - 기울기, 깊이, 음영
    // - bAuto  : bAuto가 1이면 기울기, 깊이, 음영이 자동으로 조절된다
    // - nSlop  : 막대 3D 그림자와의 각도
    // - nDepth : 깊이->몸통너비 대비
    // - nShad  : 음영
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "use3DAuto", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "slop3D" , 20 ) );
    attrItemVal3 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "depth3D", 4  ) );
    attrItemVal4 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "shad3D" , 30 ) );
    cObj.rsSet3DStyle( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4 );

    // 진행방향 (가로/세로)
    // - bType : bType이 0이면 가로, 1이면 세로방향
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "direction", "H" ) ) == "h", 0, 1 );
    cObj.rsSetDirection( chartHandle, attrItemVal );

    // 시작점에 맞춤 여부(T/F)
    // - bSetStart : bSetStart가 1이면 그래프를 시작점에 맞춘다
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "alignStartPoint", "false" ) ) == "false", 0, 1 );
    cObj.rsSetStartPoint( chartHandle, attrItemVal );

    // 비율/값 기준사용 여부 [ 0:비율,1:값 ]
    // - bUseValueScale : (0:비율,1:값)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "baseDiv", "RATE" ) ) == "rate", 0, 1 );
    cObj.rsSetValueScale( chartHandle, attrItemVal );
}

function initChartSimpleStick ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * 막대그래프 차트 속성 설정
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

    // 표현방식(2D Chart, 3D Chart)
    // - bType : lType이 0이면 2D, 1이면 3D (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "demension", "2D" ) ) == "2d", 0, 1 );
    cObj.ssSetDemension( chartHandle, attrItemVal );

    // 진행방향(가로, 세로)
    // - bType : bType이 0이면 가로, 1이면 세로방향
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "direction", "H" ) ) == "h", 0, 1 );
    cObj.ssSetDirection( chartHandle, attrItemVal );

    // 막대폭 - 자동조절
    // - bAuto  : bAuto가 FALSE인 경우에 nWidth가 의미가 있다 (default : TRUE).
    // - lWidth : 막대의 폭
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "autoWidth", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "widthVal", 0 ) );
    cObj.ssSetWidth( chartHandle, attrItemVal, attrItemVal2 );

    // 막대색(양, 음) 색상 설정
    // - lPositiveColor : positive 막대 색상
    // - lNegativeColor : negative 막대 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "positiveColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "negativeColor", "black" ), true );
    cObj.ssSetColor( chartHandle, attrItemVal, attrItemVal2 );

    // 막대그래프의 기울기, 깊이, 음영을 설정
    // - bAuto  : bAuto가 1이면 기울기, 깊이, 음영이 자동으로 조절된다
    // - nSlop  : 막대 3D 그림자와의 각도
    // - nDepth : 깊이->몸통너비 대비
    // - nShad  : 음영
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "use3DAuto", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "slop3D" , 20 ) );
    attrItemVal3 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "depth3D", 4  ) );
    attrItemVal4 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "shad3D" , 30 ) );
    cObj.ssSet3DStyle( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4 );

    // 스케일의 최소값을 0으로 설정 여부(T/F)
    // - bZero : bZero가 1이면 스케일의 최소값을 0으로 설정 (DEFAULT : 0)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleMinValuZero", "false" ) ) == "false", 0, 1 );
    cObj.ssSetScale( chartHandle, attrItemVal );

    // 시작점에 맞춤
    // - bSetStart : bSetStart가 1이면 그래프를 시작점에 맞춤
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "alignStartPoint", "false" ) ) == "false", 0, 1 );
    cObj.ssSetStartPoint( chartHandle, attrItemVal );

    // 거래비중 출력
    // - bDisp  : TRUE이면 거래비중 출력 (DEFAULT : 0)
    // - lColor : bDisp가 TRUE인 경우에만 의미가 있다
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayRateVal", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "rateValColor", "black" ), true );
    cObj.ssSetDispRateVal( chartHandle, attrItemVal, attrItemVal2 );

    // 막대색상을 서버에서 결정
    // - bSvr : TRUE이면 막대 색상을 서버에서 결정 (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "dependServerStickColor", "false" ) ) == "false", 0, 1 );
    cObj.ssSetColorFromSvr( chartHandle, attrItemVal );
}

function initChartSimpleStickP ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * 막대그래프(현재가) 차트 속성 설정
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

    // 표현방식(2D Chart, 3D Chart)
    // - bType : lType이 0이면 2D, 1이면 3D (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "demension", "2D" ) ) == "2d", 0, 1 );
    cObj.spSetDemension( chartHandle, attrItemVal );

    // 진행방향(가로, 세로)
    // - bType : bType이 0이면 가로, 1이면 세로방향
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "direction", "H" ) ) == "h", 0, 1 );
    cObj.spSetDirection( chartHandle, attrItemVal );


    // 막대폭 - 자동조절
    // - bAuto  : bAuto가 FALSE인 경우에 nWidth가 의미가 있다 (default : TRUE).
    // - lWidth : 막대의 폭
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "autoWidth", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "widthVal", 0 ) );
    cObj.spSetWidth( chartHandle, attrItemVal, attrItemVal2 );

    // 막대색(양, 음)
    // -lPositiveColor : positive 막대색상
    // -lNegativeColor : negative 막대색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "positiveColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "negativeColor", "black" ), true );
    cObj.spSetColor( chartHandle, attrItemVal, attrItemVal2 );

    // 3D 선택사항 -3D Auto, 기울기, 깊이, 음영
    // - bAuto  : bAuto가 1이면 기울기, 깊이, 음영이 자동으로 조절된다
    // - nSlop  : 막대 3D 그림자와의 각도
    // - nDepth : 깊이->몸통너비 대비
    // - nShad  : 음영
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "use3DAuto", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "slop3D" , 20 ) );
    attrItemVal3 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "depth3D", 4  ) );
    attrItemVal4 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "shad3D" , 30 ) );
    cObj.spSet3DStyle( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4 );

    // 스케일의 최소값을 0으로 설정여부(T/F)
    // - bZero : bZero가 1이면 스케일의 최소값을 0으로 설정 (DEFAULT : 0)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleMinValuZero", "false" ) ) == "false", 0, 1 );
    cObj.spSetScale( chartHandle, attrItemVal );

    // 막대그래프(현재가)를 시작점에 맞출지 여부를 설정
    // - bSetStart : bSetStart가 1이면 그래프를 시작점에 맞춘다
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "alignStartPoint", "false" ) ) == "false", 0, 1 );
    cObj.spSetStartPoint( chartHandle, attrItemVal );

    // 거래비중 출력
    // - bDisp  : TRUE이면 거래비중 출력 (DEFAULT : 0)
    // - lColor : bDisp가 TRUE인 경우에만 의미가 있다
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayRateVal", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "rateValColor", "black" ), true );
    cObj.spSetDispRateVal( chartHandle, attrItemVal, attrItemVal2 );

    // 막대색상을 서버기준 설정 여부(T/F)
    // - bSvr : TRUE이면 막대 색상을 서버에서 결정 (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "dependServerStickColor", "false" ) ) == "false", 0, 1 );
    cObj.spSetColorFromSvr( chartHandle, attrItemVal );
}

function initChartSwing ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * Swing 차트 속성 설정
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

    // 선색상 - 단위가격, 상승색상, 하락색상, 상승일자, 하락일자
    // - lPricee       : 단위가격  (300) 0~999999999
    // - lUpColor      : 상승 색상
    // - lDownColor    : 하락 색상
    // - lUpDayColor   : 상승일자색상
    // - lDownDayColor : 하락일자색상
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "unitPrice", 300 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "upColor"     , "black" ), true );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "downColor"   , "black" ), true );
    attrItemVal4 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "upDayColor"  , "black" ), true );
    attrItemVal5 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "downDayColor", "black" ), true );
    cObj.scSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5 );

    // 최대/최소값 출력 여부(T/F)
    // - bDisp : bDisp가 1이면 최대값, 최소값 출력
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.scSetDispMinMax( chartHandle, attrItemVal );

    // 최대/최소값 폰트 설정
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.scSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // 최대/최소값 폰트 색상 설정
    // - lMax : 최대값의 출력 색상
    // - lMin : 최소값의 출력 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.scSetTextColor( chartHandle, attrItemVal, attrItemVal2 );

    // 락 출력 여부(T/F)
    // - bDisp : bDisp가 1이면 락 출력 (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayRak", "false" ) ) == "false", 0, 1 );
    cObj.scSetDispRak( chartHandle, attrItemVal );

    // 락의 폰트를 설정
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "rakFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.scSetRakFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // 락의 폰트 색상 설정
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "rakColor", "black" ), true );
    cObj.scSetRakTextColor( chartHandle, attrItemVal );
}

function initChartThreeChange ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * 삼선전환도 차트 속성 설정
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

    // 막대 - 상승색상, 하락색상, 상승일자, 하락일자
    // - lWidth        : 막대폭    (1) 0~999999999
    // - lUpColor      : 상승 색상
    // - lDownColor    : 하락 색상
    // - lUpDayColor   : 상승일자색상
    // - lDownDayColor : 하락일자색상
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "stickWidth", 1 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "upColor"     , "black" ), true );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "downColor"   , "black" ), true );
    attrItemVal4 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "upDayColor"  , "black" ), true );
    attrItemVal5 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "downDayColor", "black" ), true );
    cObj.tcSetBar( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5 );

    // 최대/최소값 출력 여부(T/F)
    // - bDisp : bDisp가 1이면 최대값, 최소값 출력
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.tcSetDispMinMax( chartHandle, attrItemVal );

    // 최대값, 최소값의 폰트를 설정
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.tcSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // 최대값, 최소값의 폰트 색상 설정
    // - lMax : 최대값의 출력 색상
    // - lMin : 최소값의 출력 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.tcSetTextColor( chartHandle, attrItemVal, attrItemVal2 );

    // 락 출력 여부(T/F)
    // - bDisp : bDisp가 1이면 락 출력 (DEFAULT : 0)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayRak", "false" ) ) == "false", 0, 1 );
    cObj.tcSetDispRak( chartHandle, attrItemVal );

    // 락 폰트 설정
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "rakFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "rakFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.tcSetRakFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // 락 폰트 색상 설정
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "rakColor", "black" ), true );
    cObj.tcSetRakTextColor( chartHandle, attrItemVal );
}

function initChartPercentLine ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * 백분율 차트 속성 설정
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

    // Data에 Point 표시 여부
    // - bDisp	: Data에 Point 표시 여부
    // - lType	: Point 종류 (0:사각형, 1:원, 2:없음)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDataPoint", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "dataPointStyle", "NONE" ) ), "circle", 0, "rect", 1, "none", 2 );
    cObj.plSetDispPoint( chartHandle, attrItemVal , attrItemVal2 );

    // 최대값, 최소값 표시 여부여부
    // - bDisp : 최대값, 최소값 표시여부(0이 아니면 표시)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "useDisplayMinMax", "true" ) ) == "false", 0, 1 );
    cObj.plSetDispMinMax( chartHandle, attrItemVal );

    // 최대값, 최소값의 폰트 설정
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontFaceName" , "default" );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontHeight", 10 ) );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "minMaxFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.plSetFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3,attrItemVal4, attrItemVal5, attrItemVal6 );

    // 최저/최고 폰트 색상
    // - lMax : 최대값의 출력 색상
    // - lMin : 최소값의 출력 색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "maxColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "minColor", "black" ), true );
    cObj.plSetTextColor( chartHandle, attrItemVal, attrItemVal2 );

    // 과열/침체 표시 여부 (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayHotCold"   , "false" ) ) == "false", 0, 1 );
    cObj.plSetDispHotCold( chartHandle, attrItemVal );

    // 과열 경계값 및 색상
    // - lValue : 과열 경계값
    // - lColor : 과열 색상
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "hotVal", 100 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "hotColor", "black" ), true );
    cObj.plSetHotValue( chartHandle, attrItemVal, attrItemVal2 );

    // 침체  경계값 및 색상
    // - lValue : 침체 경계값
    // - lColor : 침체 색상
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "coldVal", -100 ) );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "coldColor", "black" ), true );
    cObj.plSetColdValue( chartHandle, attrItemVal, attrItemVal2 );

    // 0값 무시 여부 (T/F)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "ignoreZeroVal", "false" ) ) == "false", 0, 1 );
    cObj.plSetZeroValue( chartHandle, attrItemVal );

    // 선속성 - 형태, 굵기, 색상
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "line1Style", "SOLID" ) );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "line1Width", 1 );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "line1Color", "silver" ) );
    cObj.plSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );

    // 백분율 기준값 설정 (마우스 이동시 설정되는 기능과 같음.)
    attrItemVal = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "baseIndexVal", 100 ) );
    cObj.plSetBaseIndex( chartHandle, attrItemVal );
}

function initChartNet ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * 그물차트 차트 속성 설정
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

    // 이동평균사용 - 역시계곡선의 데이터는 종가의 20일 이동평균
    attrItemVal  = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "moveAvgVal", 0 ) );
    cObj.ncSetMoveAvg( chartHandle, attrItemVal );

    // 이동평균 스타일
    // - lCalcStyle	: [0: SMA 1: EMA]
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "moveAvgStyle", "SMA" ) ) == "sma", 0, 1 );
    cObj.ncSetCalcStyle( chartHandle, attrItemVal );

    // 선속성 [ long lStyle, long lWidth, long lColor ]
    attrItemVal  = toLineStyleValue ( getAttributeVal( ds, "attributeId", "attributeVal", "lineStyle", "SOLID" ) );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "lineWidth", 1 ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "lineColor", "white" ), true );
    cObj.ncSetLine( chartHandle, attrItemVal, attrItemVal2, attrItemVal3 );
}

function initChartColorStick ( aChartObject, aChartManager, aChartHandle, aDsChartSpec )
{
   /*******************************************************************************************
    * 색상막대 차트 속성 설정
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

    // 스케일의 최소값을 0으로 설정 여부(T/F)
    // - bZero : bZero가 1이면 스케일의 최소값을 0으로 설정 (DEFAULT : 0)
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "scaleMinValuZero", "false" ) ) == "false", 0, 1 );
    cObj.clsSetScale( chartHandle, attrItemVal );

    // 시작점에 맞춤
    // - bSetStart : bSetStart가 1이면 그래프를 시작점에 맞춤
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "alignStartPoint", "false" ) ) == "false", 0, 1 );
    cObj.clsSetStartPoint( chartHandle, attrItemVal );

    // 막대폭 - 자동조절
    // - bAuto  : bAuto가 FALSE인 경우에 nWidth가 의미가 있다 (default : TRUE).
    // - lWidth : 막대의 폭
    attrItemVal  = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "autoWidth", "false" ) ) == "false", 0, 1 );
    attrItemVal2 = parseInt( getAttributeVal( ds, "attributeId", "attributeVal", "widthVal", 0 ) );
    cObj.clsSetWidth( chartHandle, attrItemVal, attrItemVal2 );

    // 막대색(양, 음)
    // -lPositiveColor : positive 막대색상
    // -lNegativeColor : negative 막대색상
    attrItemVal  = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "positiveColor", "black" ), true );
    attrItemVal2 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "negativeColor", "black" ), true );
    cObj.clsSetColor( chartHandle, attrItemVal, attrItemVal2 );

    // 표현형태 0: 주가 1: 거래량
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "colorChangeMethod", "stockValue" ) ) == "stockvalue", 0, 1 );
    cObj.clsSetDispType( chartHandle, attrItemVal );

}

function initChartPie ( aChartObject, aChartManager, aChartHandle, aDsChartPieSpec )
{
   /*******************************************************************************************
    * 파이 차트 속성 설정
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

    // 배경 제목
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "pieTitle" , "" );
    cObj.pieSetTitle( chartHandle, attrItemVal );

    // 배경 타이틀 폰트 설정
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "pieTitleFontFaceName " , "default" );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "pieTitleFontHeight"    , 10          );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieTitleFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieTitleFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieTitleFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieTitleFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.pieSetBackFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // 배경 타이틀 폰트 색상 설정
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieTitleFontColor", "black" ), true );
    cObj.pieSetTitleColor( chartHandle, attrItemVal );

    // 배경 색상 채우기 설정
    // - lFillType    : (안채움 :1, 무늬 :2, 점층(HORZ):4, 점층(VERT);8, 점층(RECT):16, 점층(Ellips):32
    // - lBackPattern : 무늬일때 패턴 (0.HORIZONTAL, 1.VERTICAL, 2.FDIAGONAL, 3.BDIAGONAL, 4.CROSS, 5.DIACROSS, 6.FILL)
    // - lColorStart  : 시작색
    // - lColorEnd    : 끝색
    attrItemVal  = toPieBgFillModeValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieBgFillMode" , "NONE" ) );
    attrItemVal2 = toFillStyleValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieBgFillStyle", "FILL" ) );
    attrItemVal3 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieBgStartColor", "black" ) );
    attrItemVal4 = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieBgEndColor"  , "black" ) );
    cObj.pieSetBackStyle( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4 );

    // 전경 그래프 표현 방식(2D, 3D)
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieDemension", "2D" ) ) == "2d", 0, 1 );
    cObj.pieSetDemension( chartHandle, attrItemVal );

    // 전경 가운데 원표시 표현 여부 설정
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieDispCircle", "FALSE" ) ) == "false", 0, 1 );
    cObj.pieSetDispCircle( chartHandle, attrItemVal );

    // 전경 가운데 원 레이블
    attrItemVal = getAttributeVal( ds, "attributeId", "attributeVal", "pieCircleLabel", "" );
    cObj.pieSetCircleLabel( chartHandle, attrItemVal );

    // 전경 레이블 표시 형식 (Line/Reck/none)
    attrItemVal  = Decode( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelType", "LINE" ) ), "line", 0, "rect", 1, "none", 2 );
    cObj.pieSetLabelType( chartHandle, attrItemVal );

	// 파이 비율 레이블 표시 여부[ true/false ]
    attrItemVal = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "displayRateValue", "false" ) ) == "false", 0, 1 );
	cObj.pieSetDispValue( chartHandle, attrItemVal);

    // 전경 폰트 설정
    attrItemVal  = getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelFontFaceName " , "default" );
    attrItemVal2 = getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelFontHeight"    , 10          );
    attrItemVal3 = toFontWeightValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelFontWeight", "NORMAL" ) );
    attrItemVal4 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelFontItalic"   , "false" ) ) == "false", 0, 1 );
    attrItemVal5 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelFontUnderLine", "false" ) ) == "false", 0, 1 );
    attrItemVal6 = Iif( ToLower( getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelFontStrikeOut", "false" ) ) == "false", 0, 1 );
    cObj.pieSetForeFont( chartHandle, attrItemVal, attrItemVal2, attrItemVal3, attrItemVal4, attrItemVal5, attrItemVal6 );

    // 전경 폰트 색상 설정
    attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", "pieLabelFontColor", "black" ), true );
    cObj.pieSetLabelColor( chartHandle, attrItemVal );

    // 전경 Pie Color (nCnt:0~34)
    for ( i = 0; i < 35; i++ )
    {
        attrItemVal = ToColorValue( getAttributeVal( ds, "attributeId", "attributeVal", ( "piePieceColor" + i ), "black" ), true );
        cObj.pieSetPieColor( chartHandle, i, attrItemVal );
    }
}

function initChartDataInfo ( aChartObject, aChartManager, aDsChartCompSpec, aDsChartAreaSpec, aDsChartSpec )
{
   /*******************************************************************************************
    * 차트 데이터 정보 설정
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

    // 전체 Data  정보 설정
    for ( srcUseFulColListIdx = 0; srcUseFulColListIdx < srcUseFulColListCnt; srcUseFulColListIdx++ )
    {
        colName = srcUseFulColList[ srcUseFulColListIdx ];
        colSize = srcDs.GetColSize( colName );
        colSizeInfo  += colSize + ",";
        colTitleInfo += colName + ",";
        useColFullOrderInfo += srcUseFulColListIdx + ",";
    }

    // chart Full Columns Data Format 설정
    cObj.SetDataInfoEx( cMgr, srcDsName, colSizeInfo, colTitleInfo );

    ds.Sort( "areaOrder:a,scaleOrder:a,chartOrder:a", false );

    // chart별 Data column 정보 설정
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
        // chart Column Data Format 설정
        cObj.SetDataChartInfo( cMgr, (areaHandle + chartOrder), srcDsName, useColOrderInfo );

        // chart Column Feed Data Format 설정 ( 미사용 )
        //   :
    }
    cObj.SetDataChartInfo( cMgr, 0, srcDsName, useColFullOrderInfo );
}

function _assignChartData ( aChartObject, aDsChartCompSpec, aDsChartSpec )
{
   /*******************************************************************************************
    * 차트 데이터값 설정
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
    var mEND_without_START = 2;  // 기존 데이터에 신규 레코드 추가 모드
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

    // recordData 추출 정보 생성
    for ( srcUseFulColListIdx = 0; srcUseFulColListIdx < srcUseFulColListCnt; srcUseFulColListIdx++ ) {
        colName = srcUseFulColList[ srcUseFulColListIdx ];
        colSize = srcDs.GetColSize( colName );
        colSizeInfo += Iif( colSizeInfo  == "", colSize, "," + colSize );
    }
    srcUseFulColSizeList = Split( colSizeInfo, "," );

    // source DataSet 순서 정렬
    srcSortInfo = srcOrderColumnList[ 0 ] + ":a";

    for( i = 1; i < Length( srcOrderColumnList ); i++ )
        srcSortInfo = "," + srcOrderColumnList[ i ] + ":a";

    // 데이터 생성 순서대로 처리할 경우 사용않음.
    //srcDs.Sort( srcSortInfo, false );

    // 차트 최대 레코드 1000개 제한에 따른 임시 처리
    if ( srcDsRowCnt > cAvailableDataCount ) srcDsRowCnt = cAvailableDataCount;
    //trace( "    ## chart record count: [" + srcDsRowCnt + "]" );

    // recordData 등록
    for ( srcDsRowIdx = 0; srcDsRowIdx < srcDsRowCnt; srcDsRowIdx++ ) 
    {
        rData = "";
        debugStr = "";
        for ( srcUseFulColListIdx = 0; srcUseFulColListIdx < srcUseFulColListCnt; srcUseFulColListIdx++ ) 
        {
            colName = srcUseFulColList[ srcUseFulColListIdx ];
            colVal  = srcDs.GetColumn( srcDsRowIdx, colName );
            tmpFieldSize = parseInt( srcUseFulColSizeList[ srcUseFulColListIdx ] );

            // 2바이트 문제에대한 길이 적용
            tmpRealSize = Iif( isEmChar( colVal ), parseInt( Truncate( tmpFieldSize / 2 ) ), tmpFieldSize );
            colVal = Mid( colVal, 0, tmpRealSize );
            
            // 컬럼 길이 만큼 공백 채우기
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
    * 차트 데이터 추가
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
    var mEND_without_START = 2;       // 기존 데이터에 신규 레코드 추가 모드
    var mState = mEND_without_START;
    var mReal  = 1;

    var debugStr;
    var d_debugStr = "";
    var d_rData = "";
    
    if ( ( srcDs == null ) || ( srcDsRowCnt < 1 ) ) return;

    // recordData 추출 정보 생성
    for ( srcUseFulColListIdx = 0; srcUseFulColListIdx < srcUseFulColListCnt; srcUseFulColListIdx++ ) {
        colName = srcUseFulColList[ srcUseFulColListIdx ];
        colSize = srcDs.GetColSize( colName );
        colSizeInfo += Iif( colSizeInfo  == "", colSize, "," + colSize );
    }
    srcUseFulColSizeList = Split( colSizeInfo, "," );

    // source DataSet 순서 정렬
    srcSortInfo = srcOrderColumnList[ 0 ] + ":a";

    for( i = 1; i < Length( srcOrderColumnList ); i++ )
        srcSortInfo = "," + srcOrderColumnList[ i ] + ":a";

    srcDs.Sort( srcSortInfo, false );

    // 마지막 recordData 등록
    srcDsRowIdx = srcDsRowCnt - 1;
    rData = "";
    debugStr = "";
    for ( srcUseFulColListIdx = 0; srcUseFulColListIdx < srcUseFulColListCnt; srcUseFulColListIdx++ ) 
    {
        colName = srcUseFulColList[ srcUseFulColListIdx ];
        colVal  = srcDs.GetColumn( srcDsRowIdx, colName );
        tmpFieldSize = parseInt( srcUseFulColSizeList[ srcUseFulColListIdx ] );

        // 2바이트 문제에대한 길이 적용
        tmpRealSize = Iif( isEmChar( colVal ), parseInt( Truncate( tmpFieldSize / 2 ) ), tmpFieldSize );
        colVal = Mid( colVal, 0, tmpRealSize );
        
        // 컬럼 길이 만큼 공백 채우기
        colVal += Rpad( "", " ", tmpFieldSize - Lengthb( colVal ) );
        rData  += colVal + colSeparate;
    }
    cObj.SetData2( cMgr, rData, mState, srcDsName, mReal );
}

function assignChartData ( aChartObject, aDsChartCompSpec, aDsChartSpec )
{
   /*******************************************************************************************
    * 차트 데이터값 설정
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
    * 차트 데이터 추가
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

