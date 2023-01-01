function DrawLine(line_no, start_x, start_y, end_x, end_y, attr)
{
	var		line_kind;
	var		prop;
	var		comp_id;
	
	if( start_x < end_x )
	{
		if( start_y < end_y )
			line_kind = "LDiagonal";
		else if( start_y == end_y )
			line_kind = "Horizon";		
		else
			line_kind = "RDiagonal";	
	}		
	else if( start_x == end_x )
	{
		line_kind = "Vertical";
	}
	else
	{
		if( start_y < end_y ) 
			line_kind = "RDiagonal";
		else if( start_y == end_y )
			line_kind = "Horizon";		
		else
			line_kind = "LDiagonal";	
	}

	prop = "Left=" + Quote(start_x) + " " + 
			"Top=" + Quote(start_y) + " " + 
			"Right=" + Quote(end_x) + " " + 
			"Bottom=" + Quote(end_y) + " " + 
			"Type=line " +  
			"LineKind=" + Quote(line_kind) + " " +
			attr; 
	if( start_x == end_x )
		prop += "Width=" + Quote(1);	
	if( start_y == end_y )
		prop += "Height=" +Quote(1);
		
	comp_id = "dy_line_" + line_no;
	
	return Create("Shape", comp_id, prop);
}

function DelLine( line_no )
{
	var 	comp_id;
	
	comp_id = "dy_line_" + line_no;
	Destroy(comp_id);
}

function DrawBox( box_no, left, top, right, bottom, attr)
{
	var		prop;
	var		comp_id;
	
	comp_id = "dy_box_" + box_no;
	prop = "Left=" + Quote(left) + " " + 
			"Top=" + Quote(top) + " " + 
			"Right=" + Quote(right) + " " + 
			"Bottom=" + Quote(bottom) + " " + 
			"Type=Rectangle " +  " " + 
			attr; 
	return Create("Shape", comp_id, prop);		
}

// DrawBox의 right, bottom대신에 width, height를 쓰는 경우
function DrawBoxA( box_no, left, top, width, height, attr)
{
	var		right, bottom;
	
	right = left+width;
	bottom = top+height;
	return DrawBox(box_no, left, top, right, bottom, attr);
}

function DelBox( box_no )
{
	var 	rt;
	var 	comp_id;
	
	comp_id = "dy_box_" + box_no;
	Destroy(comp_id);	
}

function DrawEllipse( ellipse_no, center_x, center_y, radius_x, radius_y, attr )
{
	var		left, top, width, height;
	var		comp_id;
	
	left = center_x - radius_x;
	top = center_y - radius_y;
	width = radius_x*2;
	height = radius_y*2;
	prop = "Left=" + Quote(left) + " " + 
			"Top=" + Quote(top) + " " + 
			"Width=" + Quote(width) + " " + 
			"Height=" + Quote(height) + " " + 
			"Type=Ellipse " +  " " + 
			attr; 

	comp_id = "dy_ellipse_" + ellipse_no;
				
	return Create("Shape", comp_id, prop);		
}

function DelEllipse( ellipse_no )
{
	var 	rt;
	var 	comp_id;
	
	comp_id = "dy_ellipse_" + ellipse_no;
	Destroy(comp_id);	
}

function DrawCircle( circle_no, center_x, center_y, radius, attr )
{
	var		comp_id;
	
	comp_id = "dy_circle_" + circle_no;
	return DrawEllipse( comp_id, center_x, center_y, radius, radius, attr );
}

function DelCircle( circle_no )
{
	var 	rt;
	var 	comp_id;
	
	comp_id = "dy_ellipse_" + "dy_circle_" + circle_no;
	Destroy(comp_id);	
}

function DrawTable( table_no, left, top, right, bottom, cell_x_num, cell_y_num, attr )
{
	var		cell_width, cell_height;
	var		x, y;
	var		line_no = 0;
	var		start_x=0, start_y=0, end_x=0, end_y=0;
	var		comp_id;

	cell_width = Round(Abs(right-left)/cell_x_num);
	cell_height = Round(Abs(bottom-top)/cell_y_num);
	comp_id = "dy_table_" + table_no; 
	DrawBox(comp_id, left, top, right, bottom, attr);
	for( x = 1 ; x < cell_x_num ; x++ )
	{
		start_x = left + x*cell_width;
		start_y = top;
		end_x = left + x*cell_width;
		end_y = bottom;
		comp_id = "dy_table_" + table_no + "_" + line_no;
		DrawLine(comp_id, start_x, start_y, end_x, end_y, attr );
		line_no++;
	}
	for( y = 1 ; y < cell_y_num ; y++ )
	{
		start_x = left;
		start_y = top+y*cell_height;
		end_x = right;
		end_y = top+y*cell_height;
		comp_id = "dy_table_" + table_no + "_" + line_no;			
		DrawLine(comp_id, start_x, start_y, end_x, end_y, attr );		
		line_no++;
	}
	return 0;
}

function DrawTableA( table_no, left, top, width, height, cell_x_num, cell_y_num, attr )
{
	var		right, bottom;
	
	right = left+width;
	bottom = top+height;

	return DrawTable( table_no, left, top, right, bottom, cell_x_num, cell_y_num, attr );
}

function DelTable( table_no, cell_x_num, cell_y_num )
{
	var 	rt;
	var 	comp_id;
	var		line_num, line_no;
	
	comp_id = "dy_box_" + "dy_table_" + table_no; 
	Destroy(comp_id);	
	
	line_num = (cell_x_num-1) + (cell_y_num-1);
	for( line_no = 0 ; line_no < line_num ; line_no++ )
	{
		comp_id = "dy_line_" + "dy_table_" + table_no + "_" + line_no;
		Destroy(comp_id);	
	}
}
