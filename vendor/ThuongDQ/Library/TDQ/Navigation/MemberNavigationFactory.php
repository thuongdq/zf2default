<?php
namespace Tool\Navigation;

use Interop\Container\ContainerInterface;
use Zend\Navigation\Service\DefaultNavigationFactory;

class MemberNavigationFactory extends DefaultNavigationFactory
{

    protected function getName()
    {
        return 'member';
    }
    
    protected function getPages(ContainerInterface $container)
    {
        if (null === $this->pages) {
            $configuration = $container->get('config');
            $auth = $container->get('AuthService');
            $userData = $auth->getStorage()->read();
            
            if (! empty($userData)) {
                $label = "Logout(" . $userData['username'] . ")";
            } else {
                $label = "Logout";
            }
            $configuration['navigation'][$this->getName()][] = array(
                'label' => $label,
                'route' => 'training/verify',
                'action' => 'logout'
            );
            $app = $container->get("Application");
            $routeMatch = $app->getMvcEvent()->getRouteMatch();
            $router = $app->getMvcEvent()->getRouter();
            $pages = $this->getPagesFromConfig($configuration['navigation'][$this->getName()]);
            $this->pages = $this->injectComponents($pages, $routeMatch, $router);
        }
        return $this->pages;
    }
}