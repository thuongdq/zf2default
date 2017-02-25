<?php
namespace TDQ\Mail;

use Zend\Mail;
use Zend\Mail\Transport\Smtp as SmtpTransport;
use Zend\Mail\Transport\SmtpOptions;
use Zend\ServiceManager\ServiceLocatorInterface;

class MailManager
{

    protected $smtp;

    protected $sm;
    
    protected $mailData;

    public function __construct(ServiceLocatorInterface $sm)
    {
        $this->sm = $sm;
    }

    public function getSmtpTranspot()
    {
        if (! $this->smtp) {
            $config = $this->sm->get('config');
            $transport = new SmtpTransport();
            $option = new SmtpOptions(array(
                'name' => 'smtp.gmail.com',
                'host' => 'smtp.gmail.com',
                'port' => 465,
                'connection_class' => 'login',
                'connection_config' => $config['smtp_config']
            ));
            $transport->setOptions($option);
            $this->smtp = $transport;
        }
        return $this->smtp;
    }

    public function setDataMailer(array $data)
    {
        if (! empty($data)) {
            extract($data);
            $html = new \Zend\Mime\Part($message);
            $html->type = \Zend\Mime\Mime::TYPE_HTML;
            $html->disposition = \Zend\Mime\Mime::DISPOSITION_INLINE;
            $html->encoding = \Zend\Mime\Mime::ENCODING_QUOTEDPRINTABLE;
            $html->charset = 'UTF-8';
            
            $body = new \Zend\Mime\Message();
            $body->addPart($html);
            
            
            $mail = new Mail\Message();
            $mail->setFrom($mailFrom, $nameFrom);
            $mail->addTo($emailTo, $nameTo);
            $mail->setSubject($subject);
            $mail->setBody($body);
            $mail->setEncoding("UTF-8");
            
            $this->mailData = $mail;
//             $this->getSmtpTranspot()->send($mail);
        }
    }
    
    public function getDataMailer(){
        if($this->mailData){
            return $this->mailData;
        }
    }
    
    public function sendReportMail($dataSendMail)
    {
//         $sm = $this->getServiceLocator();
//         $mail = $this->sm->get('MailManager');
        $message = new \TDQ\Mail\MailMessage();
        $renderer = $this->sm->get('ViewRenderer');
        $content = $renderer->render('admin-control-panel/emails/' . $dataSendMail['mailer']['template'], array(
            'content' => $message->getMessageInfo($dataSendMail['message'])
        ));
        $dataSendMail['mailer']['message'] = $content;
        $this->setDataMailer($dataSendMail['mailer']);
        $this->getSmtpTranspot()->send($this->getDataMailer());
    }
}