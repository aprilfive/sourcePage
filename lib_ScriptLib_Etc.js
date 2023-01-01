
// Script Library
function MakeJspTemplate(Dataset_obj)
{
	var	template;
	var	col_no;

	template = "<%\n";	
	template +=  "//// INPUT : Service모듈을 사용치 않을 경우\n";
	for( col_no = 0 ; col_no < Dataset_obj.ColCount() ; col_no++ )
	{
		template += "String " + 
					Dataset_obj.GetColID(col_no) + 
					"= request.getParameter(" + 
					Quote(Dataset_obj.GetColID(col_no)) + ");" + "\t" +
					"if( " + Dataset_obj.GetColID(col_no) + " == null )\t" + Dataset_obj.GetColID(col_no) + " = " + Quote("") + ";\n";
	}
	template += "// Add Your Coding\n\n";
	template += "%>\n"; 
	template += "\n";
	
	template += "<%\n";
	template += "//// INPUT : Service모듈을 사용할 경우\n"; 	
	template += "MiXmlData xml = new MiXmlData();\n";
	template += "xml.getData(request);\n";
	template += "DataSet " + Dataset_obj.id + " = xml.getDataSet(" + Quote(Dataset_obj.id) + ");\n";
	template += "\n";
	template += "int row_no;\n";
	template += "String row_type;\n";
	for( col_no = 0 ; col_no < Dataset_obj.ColCount() ; col_no++ )
	{
		template += "String " + Dataset_obj.GetColID(col_no) + " = " + Quote("") + ";\n";
	}	
	for( col_no = 0 ; col_no < Dataset_obj.ColCount() ; col_no++ )
	{
		template += "String " + Dataset_obj.GetColID(col_no) + "_org = " + "null" + ";\n";
	}	
	template += "\n";
	template += "for(row_no = 0 ; row_no < " + Dataset_obj.id + ".getRowCount();" + "row_no++)\n";
	template += "{\n";
	template += "\trow_type = " + Dataset_obj.id + ".getRowStatus(row_no);\n";
	for( col_no = 0 ; col_no < Dataset_obj.ColCount() ; col_no++ )
	{
		template += "\t" + 
					Dataset_obj.GetColID(col_no) + " = " +
					Dataset_obj.id + ".getValueStr(row_no," + Quote(Dataset_obj.GetColID(col_no)) + ");\t" +
					"if( " + Dataset_obj.GetColID(col_no) + " == null )" + "\t" + Dataset_obj.GetColID(col_no) + " = " + Quote("") + ";\n";
	}
	template += "\tif( row_type.equals(" + Quote("update") + ") == true )\n";
	template += "\t{\n";
	for( col_no = 0 ; col_no < Dataset_obj.ColCount() ; col_no++ )
	{
		template += "\t\t" + 
					Dataset_obj.GetColID(col_no) + "_org = " +
					Dataset_obj.id + ".getOrgValueStr(row_no," + Quote(Dataset_obj.GetColID(col_no)) + ");\t" +
					"if( " + Dataset_obj.GetColID(col_no) + "_org == null )" + "\t" + Dataset_obj.GetColID(col_no) + "_org = " + Quote("") + ";\n";
	}
	template += "\t}\n";
	template += "\n";
	template += "\t// Add Your Coding\n\n";
	template += "}\n";
	template += "%>\n";
	
	template += "\n";
	template += "//// OUTPUT : Service모듈을 사용치 않는경우\n"; 
	template += "<?xml version=" + Quote("1.0") + " encoding=" + Quote("euc-kr") + "?>\n";
	template += "<root>\n";
    template += "\t<params>\n";
    template += "\t\t<param id=" + Quote("ErrorCode") + ">// Add Your Coding</param>\n";
    template += "\t\t<param id=" + Quote("ErrorMsg") + ">// Add Your Coding</param>\n";
    template += "\t\t<param id=" + Quote("cache") + ">// Add Your Coding</param>\n";
	template += "\t</params>\n";
    template += "\t<dataset id=" + Quote(Dataset_obj.id) + ">\n";
    for( col_no = 0 ; col_no < Dataset_obj.ColCount() ; col_no++ )
    {
    	template += "\t\t<colinfo id=" + Quote(Dataset_obj.GetColID(col_no)) + " size=255" + " type=string" + "/>\n";
    }
    template += "\n";
    template += "\t\t// Add Your Coding( record count별로 변수값셋팅 )\n";
	template += "\t\t<record>\n";
    for( col_no = 0 ; col_no < Dataset_obj.ColCount() ; col_no++ )
    {
    	template += "\t\t\t" + "<" + Dataset_obj.GetColID(col_no) + ">" + "// Add Your Coding(변수값)" + "</" + Dataset_obj.GetColID(col_no) + ">\n";
    }
    template += "\t\t</record>\n";
	template += "\t</dataset>\n";
	template += "</root>\n";	

	template += "\n";
	template += "<%\n";
	template += "//// OUTPUT : Service모듈을 사용하는경우\n"; 
	template += "var row_no\n";
	template += "MiXmlData xml = new MiXmlData();\n";
	template += "DataSet " + Dataset_obj.id + " = createDataSet(" + Quote(Dataset_obj.id) + ");\n";
    for( col_no = 0 ; col_no < Dataset_obj.ColCount() ; col_no++ )
    {
		template += Dataset_obj.id + ".addColumn(" + Quote(Dataset_obj.GetColID) + ", string, 255 );\n"; 
	}
	template += "// Add Your Coding(record count별로 변수값셋팅 )\n";
	template += "\trow_no = " + Dataset_obj.id + ".addRow();\n";
    for( col_no = 0 ; col_no < Dataset_obj.ColCount() ; col_no++ )
    {
		template += "\t" + Dataset_obj.id + ".setColumnStr(" + Quote(Dataset_obj.GetColID(col_no)) + ", " + Dataset_obj.GetColID(col_no) + ");\n";
	}
	template += Dataset_obj.id + ".Write();\n";
	template += "%>\n";
		
	return template;	
}



