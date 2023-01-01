//New Script File


function fn_uisu_add(arg_isucd, nRow)
{
	var cRow = gds_uisu_cd.FindRow("ISU_CD", arg_isucd);
	if( cRow == -1 )
	{
		cRow = gds_uisu_cd.addRow();
		gds_isu_cd.copyToRow(nRow, "gds_uisu_cd", cRow);
	}
}