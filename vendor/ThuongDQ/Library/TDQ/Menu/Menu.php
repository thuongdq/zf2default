<?php
// if ( ! defined('BASEPATH')) exit('No direct script access allowed');
namespace TDQ\Menu;

use Zend\ServiceManager\ServiceLocatorInterface;

class Menu
{

    protected $_open = "<ul class='menu'>";

    protected $_close = "</ul>";

    protected $_openitem = "<li>";

    protected $_closeitem = "</li>";

    protected $_baseurl = SITE_URL;

    protected $_result = "";

    protected $sm;

    public function __construct(ServiceLocatorInterface $sm)
    {
        $this->sm = $sm;
    }
    
    public function setOption($config)
    {
        foreach ($config as $k => $value) {
            $method = "set" . ucfirst($k);
            $this->$method($value);
        }
    }

    public function setOpen($tag)
    {
        $this->_open = $tag;
    }

    public function setClose($tag)
    {
        $this->_close = $tag;
    }

    public function setOpenitem($tag)
    {
        $this->_openitem = $tag;
    }

    public function setCloseitem($tag)
    {
        $this->_closeitem = $tag;
    }

    public function setBaseurl($url)
    {
        $this->_baseurl = $url;
    }

    public function callMenu($menu)
    {
        if ($menu->getChild()->count() > 0) {
            $this->_result .= $this->_open;
            foreach ($menu->getChild() as $k => $value) {
                $this->_result .= $this->_openitem;
                if ($value->getChild()->count() > 0) {
                    $this->_result .= "<a href='javascript:void(0)' class='link'>" . $value->getName() . "</a>";
                } else {
                    $this->_result .= "<a href='$this->_baseurl/" . $value->getLink() . "'>" . $value->getName() . "</a>";
                }
                $this->callMenu($value);
                $this->_result .= $this->_closeitem;
            }
            $this->_result .= $this->_close;
        }
        return $this->_result;
    }
}

