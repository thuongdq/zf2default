<?php 
namespace TDQ\Demo;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;
use Zend\Paginator\Paginator;
class Process02{
    public function test(){
        echo "Call Library QHO in vendor with process02 - StandardAutoloader";
    }
    
    public function make($data, array $config)
    {
        $ormPaging = new ORMPaginator($data);
        $adapter = new DoctrineAdapter($ormPaging);
        $paging = new Paginator($adapter);
        $paging->setDefaultItemCountPerPage($config['ItemCountPerPage']);
        $paging->setCurrentPageNumber($config['CurrentPageNumber']);
        return $paging;
    }
}
?>