<?php
namespace TDQ\ToolManager;
use Zend\ServiceManager\ServiceLocatorInterface;
class ToolManager
{

    protected $sm;

    public function __construct(ServiceLocatorInterface $sm)
    {
        $this->sm = $sm;
    }
    
    public function Unicode($str){
        if(!$str) return false;
        $unicode = array(
            'a'=>array('á','à','ả','ã','ạ','ă','ắ','ặ','ằ','ẳ','ẵ','â','ấ','ầ','ẩ','ẫ','ậ'),
            'A'=>array('Á','À','Ả','Ã','Ạ','Ă','Ắ','Ặ','Ằ','Ẳ','Ẵ','Â','Ấ','Ầ','Ẩ','Ẫ','Ậ'),
            'd'=>array('đ'),
            'D'=>array('Đ'),
            'e'=>array('é','è','ẻ','ẽ','ẹ','ê','ế','ề','ể','ễ','ệ'),
            'E'=>array('É','È','Ẻ','Ẽ','Ẹ','Ê','Ế','Ề','Ể','Ễ','Ệ'),
            'i'=>array('í','ì','ỉ','ĩ','ị'),
            'I'=>array('Í','Ì','Ỉ','Ĩ','Ị'),
            'o'=>array('ó','ò','ỏ','õ','ọ','ô','ố','ồ','ổ','ỗ','ộ','ơ','ớ','ờ','ở','ỡ','ợ'),
            '0'=>array('Ó','Ò','Ỏ','Õ','Ọ','Ô','Ố','Ồ','Ổ','Ỗ','Ộ','Ơ','Ớ','Ờ','Ở','Ỡ','Ợ'),
            'u'=>array('ú','ù','ủ','ũ','ụ','ư','ứ','ừ','ử','ữ','ự'),
            'U'=>array('Ú','Ù','Ủ','Ũ','Ụ','Ư','Ứ','Ừ','Ử','Ữ','Ự'),
            'y'=>array('ý','ỳ','ỷ','ỹ','ỵ'),
            'Y'=>array('Ý','Ỳ','Ỷ','Ỹ','Ỵ'),
            '-'=>array(' ','&quot;','.',"'",'"','(', ')','*', '^', '$', '#', '@', '!', '%', '&', '+'),
            ' '=>array('?')
        );
    
        foreach($unicode as $nonUnicode=>$uni){
            foreach($uni as $value)
                $str = str_replace($value,$nonUnicode,$str);
        }
        $str=trim(strtolower($str));
        $str=rtrim($str,"-");
        return $str;
    }
    
    public function convertTagToString($entity)
    {
        $tagStr = "";
        $tags = $entity->getTags();
        if (count($tags)) {
            $i = 0;
            foreach ($tags as $tag) {
                $i ++;
                $tagStr .= $tag->getName();
                if ($i < count($tags)) {
                    $tagStr .= ', ';
                }
            }
        }
        return $tagStr;
    }
    
    
    public function getSelectDataViewChildCategory($category, $result = array(), $pre = '')
    {
        if ($category->getChild()) {
            foreach ($category->getChild() as $cateChild) {
                $result[] = array(
                    'label' => $pre . $cateChild->getName(),
                    'disabled' => false,
                    'value' => $cateChild->getId(),
                );
                $result = $this->getSelectDataViewChildCategory($cateChild, $result, $pre . '--');
            }
        }
        return $result;
    }
    
    public function getViewDataTree($category, $selected = array(), $str = '')
    {
        $select = "false";
        if (in_array($category->getId(), $selected)) {
            $select = "true";
        }
        $folder = "fa fa-folder icon-state-warning icon-lg";
        $file = "fa fa-file icon-state-warning icon-lg";
        $str .= '{
                   "id": "' . $category->getId() . '",
                   "text": "' . $category->getName() . '",
                   "state": {
                            "selected": ' . $select . ',
                            "opened": true
                    },
            ';
    
        if ($category->getChild()->count() > 0) {
            $str .= '"icon" : "' . $folder . '",';
            $str .= '"children": [';
            foreach ($category->getChild() as $cateChild) {
                $str = $this->getViewDataTree($cateChild, $selected, $str);
            }
            $str .= ']';
        } else {
            $str .= '"icon" : "' . $file . '",';
        }
        $str .= '},';
        return $str;
    }
    
 
    
}
