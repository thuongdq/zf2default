<?php
namespace TDQ\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;
use Zend\Permissions\Acl\Acl;
use Zend\Permissions\Acl\Role\GenericRole as Role;

class AclPlugin extends AbstractPlugin
{

    protected $role;

    protected $access;

    public function getAuthService()
    {
        $sm = $this->getController()->getServiceLocator();
        $authService = $sm->get('ZendAuth');
        if ($authService->hasIdentity()) {
            $user = $authService->getIdentity();
            if ($user->getLevel() == 1) {
                $this->role = "member";
                $this->access = $user->getAccess();
            } else {
                $this->role = "admin";
            }
        } else {
            $this->role = 'guest';
        }
        return $this->role;
    }

    public function getAccess()
    {
        return $this->access;
    }

    public function configAcl()
    {
        $acl = new Acl();
        $acl->deny();
        $acl->addRole(new Role("guest"));
        $acl->addRole(new Role("member"), array(
            "guest"
        ));
        $acl->addRole(new Role("admin"), array(
            "member"
        ));
        
        $acl->addResource("admincontrolpanel")
            ->addResource("admincontrolpanel:index", "admincontrolpanel")
            ->addResource("admincontrolpanel:category", "admincontrolpanel")
            ->addResource("admincontrolpanel:link", "admincontrolpanel")
            ->addResource("admincontrolpanel:file", "admincontrolpanel")
            ->addResource("admincontrolpanel:chat", "admincontrolpanel")
            ->addResource("admincontrolpanel:user", "admincontrolpanel")
            ->addResource("admincontrolpanel:verify", "admincontrolpanel")
            ->addResource("admincontrolpanel:post", "admincontrolpanel")
            ->addResource("admincontrolpanel:product", "admincontrolpanel")
            ->addResource("admincontrolpanel:order", "admincontrolpanel");
        
        $acl->allow("guest", "admincontrolpanel:verify", array(
            "index",
            "login",
            "forgot",
            "active",
            "denied"
        ));
        $acl->allow("member", "admincontrolpanel:verify", array(
            "logout"
        ));
        $role = $this->getAuthService();
        $serialize = new \Zend\Serializer\Adapter\PhpSerialize();
       
        if ($this->getAccess() != "") {
            $rule = $serialize->unserialize($this->getAccess());
            if ($role != 'admin' && ! empty($rule['admincontrolpanel'])) {
                $module = 'admincontrolpanel';
                foreach ($rule['admincontrolpanel'] as $controller => $action) {
                    $acl->allow($role, $module . ":" . $controller, $action);
                }
            }
        }
        
        $acl->allow("admin");
        
        
        return $acl;
    }

    public function RoleAccess($e)
    {
        $role = $this->getAuthService();
        $acl = $this->configAcl();
        $route = $e->getRouteMatch();
        $controller = $route->getParam('controller');
        $moduleName = strtolower(substr($controller, 0, strpos($controller, '\\')));
        $arr = explode("\\", $controller);
        $controllerName = strtolower(array_pop($arr));
        $actionName = $route->getParam('action');
        
        
        
        if (! $acl->isAllowed($role, $moduleName . ":" . $controllerName, $actionName)) {
            echo $role."-". $moduleName . ":" . $controllerName.":".$actionName;
            $responce = $e->getResponse();
            $responce->setStatusCode(302)->setContent('Access Denied');
            $responce->sendHeaders();
            if (isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
                $e->stopPropagation();
            }
        }
    }
}

