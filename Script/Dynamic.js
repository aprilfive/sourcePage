//#include "Lib::lib_String.js"
/***************************************************************
 *  : Object Centerǥ  Լ
 * arg :
			obj : Object
 * return : 
			Object Center(arr[0] = center x, arr[1] = center y)
****************************************************************/
function Get_Object_center(obj)
{
	var arr=array(2);
	arr[0] = obj.Left + Round(obj.Width/2, 0);
	arr[1] = obj.Top + Round(obj.Height/2, 0);
	
	return arr;
}

/***************************************************************
 *  : Object left, top, width, heightǥ  Լ
 * arg :
			obj : Object
 * return : 
			Object Rect(arr[0] = Left, arr[1] = Top, arr[2] = Width, arr[3] = Height
****************************************************************/
function Get_Object_rect(obj)
{
	var arr = array(4);
	arr[0] = obj.Left;
	arr[1] = obj.Top;
	arr[2] = obj.Width;
	arr[3] = obj.Height;
	
	return arr;
}

/***************************************************************
 *  : Dynamic  Լ
 * arg :
			obj : Object
			gbn : 
						- rigth-left = ʿ  ̱
						- left-right = ʿ  ̱
						- top-bottom =  Ʒ ̱
						- bottom-top = Ʒ  ̱
						- end-end    =   ̱
						- top-spread =  Ʒ ġ
						- bottom-spread = Ʒ  ġ
						- left-spread = ʿ  ġ
						- right-spread = ʿ  ġ
						- center-spread = ߾ӿ  ġ
						- bkcolor-fadein =  fadein ȿ
						- bkcolor-fadeout =  fadeout ȿ
						- bkcolor-blink =   ȿ
						- color-fadein = ڻ fadein ȿ
						- color-fadeout = ڻ fadeout ȿ
						- color-blink = ڻ  ȿ
			time_id : timer id
			time_uint : timer (milisec)
			init_pos : ʱ ġ
						- rigth-left = obj.left
						- left-right = obj.left
						- top-bottom = obj.top
						- bottom-top = obj.top
						- end-end    = array[0] : obj.left, array[1] = obj.top
						- top-spread = obj.height
						- bottom-spread = obj.height
						- left-spread = obj.width
						- right-spread = obj.width
						- center-spread = array[0] : obj.Width, array[1] = obj.Height
						- bkcolor = obj.bkcolor
						- color = obj.color
						- blink = obj.color
			
 * return : 
			
****************************************************************/
function Dynamic_Start(obj, gbn, time_id, time_unit, init_pos )
{
	// init_pos : obj.Left
	if( gbn == "right-left" )
	{
		obj.Left = init_pos;
	}
	// init_pos : obj.Left
	else if( gbn == "left-right" )
	{
		obj.Left = init_pos;
	}
	// init_pos : obj.Top
	else if( gbn == "top-bottom" )
	{
		obj.Top = init_pos;
	}
	// init_pos : obj.Top
	else if( gbn == "bottom-top" )
	{
		obj.Top = init_pos;
	}
	// init_pos : array(2) = (Left, Top)	
	else if( gbn == "end-end" )
	{
		obj.Left = init_pos[0];
		obj.Top = init_pos[1];
	}
	// init_pos : obj.Height
	else if( gbn == "top-spread" )
	{
		obj.Height = init_pos;
	}
	// init_pos : obj.Height
	else if( gbn == "bottom-spread" )
	{
		obj.Height = init_pos;
	}
	// init_pos : obj.Width
	else if( gbn == "left-spread" )
	{
		obj.Width = init_pos;
	}
	// init_pos : obj.Width
	else if( gbn == "right-spread" )
	{
		obj.Width = init_pos;
	}	
	// init_pos : array(2)=(Width, Height)
	else if( gbn == "center-spread" )
	{
		obj.Width = init_pos[0];
		obj.Height = init_pos[1];
	}
	// init_pos : #rrggbb
	else if( gbn == "color-fadein" ||
					 gbn == "color-fadeout" ||
					 gbn == "color-blink" )
	{
		obj.Color = init_pos;
	}
	// init_pos : #rrggbb
	else if( gbn == "bkcolor-fadein" ||
					 gbn == "bkcolor-fadeout" ||
					 gbn == "bkcolor-blink" )
	{
		obj.BkColor = init_pos;	
	}
	
	SetTimer(time_id, time_unit);	
}

/***************************************************************
 *  : Dynamic  Լ
 * arg :
			obj : Object
			gbn : 
						- rigth-left = ʿ  ̱
						- left-right = ʿ  ̱
						- top-bottom =  Ʒ ̱
						- bottom-top = Ʒ  ̱
						- end-end    =   ̱
						- top-spread =  Ʒ ġ
						- bottom-spread = Ʒ  ġ
						- left-spread = ʿ  ġ
						- right-spread = ʿ  ġ
						- center-spread = ߾ӿ  ġ
						- bkcolor-fadein =  fadein ȿ
						- bkcolor-fadeout =  fadeout ȿ
						- bkcolor-blink =   ȿ
						- color-fadein = ڻ fadein ȿ
						- color-fadeout = ڻ fadeout ȿ
						- color-blink = ڻ  ȿ
			time_id : timer id
			move_unit :  
						- end-end = array[0] : x  , array[1] : y  
						- center-spread (ʹ⸸)= array[0] : x  , array[1] : y  
						-   
			end_pos :  ġ
						- rigth-left = obj.left
						- left-right = obj.left
						- top-bottom = obj.top
						- bottom-top = obj.top
						- end-end    = array[0] : obj.left, array[1] = obj.top
						- top-spread = obj.height
						- bottom-spread = obj.height
						- left-spread = obj.width
						- right-spread = obj.width
						- center-spread = Array(Left, Top, Width, Height)
						- bkcolor-fadein = obj.bkcolor
						- bkcolor-fadeout = obj.bkcolor
						- bkcolor-blink = obj.bkcolor
						- color-fadein = obj.color
						- color-fadeout = obj.color
						- color-blink = obj.color
			cur_pos : ġ
						- bkcolor-fadein = obj.bkcolor
						- bkcolor-fadeout = obj.bkcolor
						- bkcolor-blink = obj.bkcolor
						- color-fadein = obj.color
						- color-fadeout = obj.color
						- color-blink = obj.color
						-  ʿ
			init_pos : ġ
						- bkcolor-blink = obj.bkcolor			
						- color-blink = obj.color
						-  ʿ
 * return : 
			true = , false =  
  ǻ :
    ݵ Form OnTimer Event  
****************************************************************/
function Dynamic(obj, gbn, time_id, move_unit, end_pos, cur_pos, init_pos )
{
	var i;
	
	// end_pos : obj.Left
	if( gbn == "right-left" )
	{
		obj.Left -= move_unit;
		if( obj.Left <= end_pos )
		{

			obj.Left = end_pos;
			KillTimer(time_id);
			return true;
		}
	}
	// end_pos : obj.Left
	else if( gbn == "left-right" )
	{
		obj.Left += move_unit;
		if( obj.Left >= end_pos )
		{
			obj.Left = end_pos;
			KillTimer(time_id);
			return true;
		}
	}
	// end_pos : obj.Top
	else if( gbn == "top-bottom" )
	{
		obj.Top += move_unit;
		if( obj.Top >= end_pos )
		{
			obj.Top = end_pos;
			KillTimer(time_id);
			return true;
		}
	}
	// end_pos : obj.Top
	else if( gbn == "bottom-top" )
	{
		obj.Top -= move_unit;
		if( obj.Top <= end_pos )
		{
			obj.Top = end_pos;
			KillTimer(time_id);
			return true;
		}
	}
	// end_pos : array(Left, Top)
	// move_unit = array[0] : x  , array[1] : y  
	else if( gbn == "end-end" )
	{
		var move_unit_x, move_unit_y;
		var finish_x=false, finish_y=false;
		move_unit_x = move_unit[0];
		move_unit_y = move_unit[1];
		obj.Left += move_unit_x;
		if( obj.Left >= end_pos[0] )
		{
			obj.Left = end_pos[0];
			finish_x = true;
		}
		obj.Top += move_unit_y;
		if( obj.Top >= end_pos[1] )
		{
			obj.Top = end_pos[1];
			finish_y = true;
		}
		if( finish_x == true && finish_y == true )
		{
			KillTimer(time_id);
			return true;
		}
	}
	// end_pos : obj.Height
	else if( gbn == "top-spread" )
	{
		obj.Height += move_unit;
		if( obj.Height >= end_pos )
		{
			obj.Height = end_pos;
			KillTimer(time_id);
			return true;
		}
	}
	// end_pos : obj.Height
	else if( gbn == "bottom-spread" )
	{
		obj.Height += move_unit;
		obj.Top -= move_unit;
		if( obj.Height >= end_pos )
		{
			var diff = obj.Height-end_pos;		
			obj.Height = end_pos;
			obj.Top += diff;						
			KillTimer(time_id);
			return true;
		}
	}
	// end_pos : obj.Width
	else if( gbn == "left-spread" )
	{
		obj.Width += move_unit;
		if( obj.Width >= end_pos )
		{
			obj.Width = end_pos;
			KillTimer(time_id);
			return true;
		}
	}
	// end_pos : obj.Width
	else if( gbn == "right-spread" )
	{
		obj.Width += move_unit;
		obj.Left -= move_unit;
		if( obj.Width >= end_pos )
		{
			var diff = obj.Width-end_pos;		
			obj.Width = end_pos;
			obj.Left += diff;	
			KillTimer(time_id);
			return true;
		}
	}	
	// move_unit(ʹ⸸) = array[0] : x  , array[1] : y  
	// end_pos : array(4) = (Left, Top, Width, Height)
	else if( gbn == "center-spread" )
	{
		var arr_fin=array(4);
		for( i = 0 ; i < 4 ; i++ )
			arr_fin[i] = false;

		obj.Left -= move_unit[0];		
		if( obj.Left <= end_pos[0] )
		{
			obj.Left = end_pos[0];
			arr_fin[0] = true;
		}
		obj.Top -= move_unit[1];		
		if( obj.Top <= end_pos[1] )
		{
			obj.Top = end_pos[1];
			arr_fin[1] = true;
		}
		
		obj.Width += move_unit[0]*2;
		if( obj.Width >= end_pos[2] )
		{
			obj.Width = end_pos[2];
			arr_fin[2] = true;
		}

		obj.Height += move_unit[1]*2;
		if( obj.Height >= end_pos[3] )
		{
			obj.Height = end_pos[3];
			arr_fin[3] = true;
		}
		if( arr_fin[0] == true && 
				arr_fin[1] == true && 
				arr_fin[2] == true && 
				arr_fin[3] == true )
		{
			KillTimer(time_id);
			return true;
		}
	}
	// end_pos : #rrggbb
	// cur_pos : Ref() -  ʿ
	else if( gbn == "color-fadein" || 
					 gbn == "bkcolor-fadein" )
	{
		var arr_int_end=array(3);
		var arr_int_cur=array(3);
		var arr_fin=array(3);
		arr_int_end = Rgb2Int(end_pos);
		arr_int_cur = Rgb2Int(cur_pos);
		for( i = 0 ; i < 3 ; i++ )
		{
			arr_fin[i] = false;
			arr_int_cur[i] -= move_unit;
			if( arr_int_cur[i] <= arr_int_end[i] )
			{
				arr_int_cur[i] = arr_int_end[i];
				arr_fin[i] = true;
			}
		}
		cur_pos = Int2Rgb(arr_int_cur);
		if( gbn == "bkcolor-fadein" )
			obj.BkColor = cur_pos;
		else if( gbn == "color-fadein" )
			obj.Color = cur_pos;
		if( arr_fin[0] == true && 
				arr_fin[1] == true && 
				arr_fin[2] == true )
		{
			KillTimer(time_id);
			return true;
		}
	}
	// end_pos : #rrggbb
	// cur_pos : Ref() -  ʿ
	else if( gbn == "color-fadeout" || 
					 gbn == "bkcolor-fadeout" )
	{
		var arr_int_end=array(3);
		var arr_int_cur=array(3);
		var arr_fin=array(3);
		arr_int_end = Rgb2Int(end_pos);
		arr_int_cur = Rgb2Int(cur_pos);
		for( i = 0 ; i < 3 ; i++ )
		{
			arr_fin[i] = false;
			arr_int_cur[i] += move_unit;
			if( arr_int_cur[i] >= arr_int_end[i] )
			{
				arr_int_cur[i] = arr_int_end[i];
				arr_fin[i] = true;
			}
		}
		cur_pos = Int2Rgb(arr_int_cur);
		if( gbn == "bkcolor-fadeout" )
			obj.BkColor = cur_pos;
		else if( gbn == "color-fadeout" )
			obj.Color = cur_pos;
		if( arr_fin[0] == true && 
				arr_fin[1] == true && 
				arr_fin[2] == true )
		{
			KillTimer(time_id);
			return true;
		}
	}
	// init_pos :  ʿ
	// end_pos : #rrggbb	
	// cur_pos : Ref() -  ʿ	
	else if( gbn == "color-blink" ||
					 gbn == "bkcolor-blink" )
	{
		if( cur_pos == end_pos )
			cur_pos = init_pos;
		else
			cur_pos = end_pos;
		if( gbn = "color-blink" )
			obj.Color = cur_pos;
		else
			obj.BkColor = cur_pos;
	}
	return false; 
}