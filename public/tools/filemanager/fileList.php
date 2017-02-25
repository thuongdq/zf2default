<?php
/******************************************/
/* Function to get files list from server */
/*    for using inside JQuery scripts     */
/*    created by Andrejus Semionovas      */
/******************************************/
function get_root_path() {
  $pos = strrpos(dirname(__FILE__),DIRECTORY_SEPARATOR.'responsivefilemanager');
  $adm = substr(dirname(__FILE__), 0, $pos);
  $pos2 = strrpos($adm,DIRECTORY_SEPARATOR);
  return substr(__FILE__, 0, $pos2);
}
$thumb = preg_replace("/\.[^.]+$/", "", $_GET['thumb']);
$path = get_root_path().$_GET['path'];
$files = array();
if (is_dir($path)) {
    if ($dh = opendir($path)) {
        while (($file = readdir($dh)) !== false) {
            if (!in_array($file,array(".","..",".htaccess"))) {
				if(isset($thumb) && strpos($file, $thumb)!==false) {
					$img = @getimagesize($path.$file);
					$files[] = array("name" => $file, "dimensions" => $img[0].'x'.$img[1].'px');
				}
			}
        }
        closedir($dh);
		echo json_encode($files);
    }
	else echo "<br>Can't open directory: $path. Please check the path.";
} else echo "<br>Can't find directory in path: $path. Please check the path.";
?>