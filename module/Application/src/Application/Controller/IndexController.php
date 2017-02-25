<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Mvc\MvcEvent;

class IndexController extends AbstractActionController
{
    public function onDispatch(MvcEvent $e){
        $response = parent::onDispatch($e);
        $route = $e->getRouteMatch();
        $controller = $route->getParam('controller');
        $moduleName = strtolower(substr($controller, 0, strpos($controller, '\\')));
        $this->layout()->setTemplate('layout/'.$moduleName);
        return $response;
    }
    
    public function indexAction()
    {
        return new ViewModel();
    }
}
