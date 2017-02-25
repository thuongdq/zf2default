function confirm_delete(mess=''){
	if(mess == "")
		mess = "Bạn có thực sự muốn xóa dữ liệu này";
	if(!window.confirm(mess)){
		return false;
	}else{
		return true;
	}
}



