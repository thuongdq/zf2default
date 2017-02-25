<?php
namespace TDQ\Mail;

class MailMessage
{

    protected $message;

    public function forgotPasswordMessage(array $data)
    {
        if (! empty($data)) {
            extract($data);
            $this->message = "
                <h4>Chào bạn $name</h4>
                Chúng tôi nhận được yêu cầu phục hồi mật khẩu cho tài khoản <b>$username</b>.<br>
                Để xác nhận điều này vui lòng nhấp chuột <a href='$link'>vào đây</a>.<br>
                Trân trọng.";
        }
    }

    public function changeAutoPasswordMessage(array $data)
    {
        if (! empty($data)) {
            extract($data);
            $this->message = "
                <h4>Chào bạn $name</h4>
                Mật khẩu mới của tài khoản <b>$username</b> là: $newpass<br>
                Xin vui lòng thay đổi mật khẩu và xoá bỏ email này để bảo đảm tính an toàn cho bạn.<br>
                Click <a href='$link'>vào đây</a> để đăng nhập trở lại hệ thống.<br>
                Trân trọng.";
        }
    }

    public function activeAcountMessage(array $data)
    {
        if (! empty($data)) {
            extract($data);
            $this->message = "
                <h4>Chào bạn $name</h4>
                Chúng tôi nhận được yêu cầu lập tài khoản <b>$username</b> của bạn tại <a href='" . $webInfo['webUrl'] . "'>" . $webInfo['webName'] . "</a>. <br>
                Để hoàn tất việc đăng ký vui lòng nhấp chuột <a href='$link'>vào đây</a> để kích hoạt tài khoản của bạn.<br>
                Trân trọng.";
        }
    }
    
    public function reActiveAcountMessage(array $data)
    {
        if (! empty($data)) {
            extract($data);
            $this->message = "
            <h4>Chào bạn $name</h4>
            Chúng tôi nhận được yêu cầu kích hoạt lại tài khoản <b>$username</b> của bạn tại <a href='" . $webInfo['webUrl'] . "'>" . $webInfo['webName'] . "</a>. <br>
            Để hoàn tất việc kích hoạt vui lòng nhấp chuột <a href='$link'>vào đây</a> để kích hoạt tài khoản của bạn.<br>
            Trân trọng.";
        }
        }

    public function changePasswordAccountMessage(array $data)
    {
        if (! empty($data)) {
            extract($data);
            $this->message = "
            <h4>Chào bạn $name</h4>
            Bạn vừa tiến hành đổi mật khẩu của tài khoản <b>$username</b> tại <a href='" . $webInfo['webUrl'] . "'>" . $webInfo['webName'] . "</a>. <br>
            Nếu bạn không thực hiện thao tác này vui lòng kiểm tra lại hoặc liên hệ với chúng thôi theo địa chỉ dưới đây để được trợ giúp." . $webInfo['webAddress'] . "<br>
            Trân trọng.";
        }
    }

    public function lockAcountMessage(array $data)
    {
        if (! empty($data)) {
            extract($data);
            $this->message = "
            <h4>Chào bạn $name</h4>
            Tài khoản <b>$username</b> của bạn tại <a href='" . $webInfo['webUrl'] . "'>" . $webInfo['webName'] . "</a> vừa bị khoá. <br>
            Hiện tại bạn không thể thao tác bất kỳ điều gì dựa trên tài khoản này.
            Nếu có thắc mắc vui lòng liên hệ với chúng tôi theo địa chỉ dưới đây." . $webInfo['webAddress'] . "<br>
            Trân trọng.";
        }
    }
    
    public function unLockAcountMessage(array $data)
    {
        if (! empty($data)) {
            extract($data);
            $this->message = "
            <h4>Chào bạn $name</h4>
            Tài khoản <b>$username</b> của bạn tại <a href='" . $webInfo['webUrl'] . "'>" . $webInfo['webName'] . "</a> vừa đã được mở khoá. <br>
            Nếu bạn quên mật khẩu có thể tiến hành lấy lại mật khẩu qua email.
            Nếu có thắc mắc vui lòng liên hệ với chúng tôi theo địa chỉ dưới đây." . $webInfo['webAddress'] . "<br>
            Trân trọng.";
        }
    }

    public function requestShareMessage(array $data)
    {
        if (! empty($data)) {
            extract($data);
            $this->message = "
            <h4>Chào bạn $name</h4>
            Tôi là $usernameRequest, tôi rất mừng khi bạn đưa lên hệ thống tập tin: $label dưới tài khoản \"$username\" tại <a href='" . $webInfo['webUrl'] . "'>" . $webInfo['webName'] . "</a>, và với tôi tập tin này rất cần thiết cho công việc hiện tại. Vì thế tôi gửi yêu cầu, mong muốn bạn chia sẻ tập tin này cho tôi.<br>
            Để chia sẻ tập tin này, bạn vui lòng nhấp <a href='$link'>vào đây</a>.<br>
            Cảm ơn bạn, và chúc bạn một ngày tốt lành.";
        }
    }

    public function shareMessage(array $data)
    {
        if (! empty($data)) {
            extract($data);
            $this->message = "
                <h4>Chào bạn $name</h4>
                Tệp tin $label đã được chia sẻ cho  tài khoản \"$username\", Bạn có thể đăng nhập vào tài khoản tại <a href='" . $webInfo['webUrl'] . "'>" . $webInfo['webName'] . "</a> và tải về ngay lúc này.<br>
                Chúc bạn một ngày tốt lành.";
        }
    }

    public function getMessageInfo($dataMessage)
    {
        switch ($dataMessage['for']) {
            case 'forgot':
                $this->forgotPasswordMessage($dataMessage);
                break;
            case 'change-auto-password':
                $this->changeAutoPasswordMessage($dataMessage);
                break;
            case 'active-account':
                $this->activeAcountMessage($dataMessage);
                break;
            case 're-active-account':
                $this->reActiveAcountMessage($dataMessage);
                break;
            case 'change-password-account':
                $this->changePasswordAccountMessage($dataMessage);
                break;
            case 'lock-account':
                $this->lockAcountMessage($dataMessage);
                break;
            case 'un-lock-account':
                $this->unLockAcountMessage($dataMessage);
                break;
            case 'request-share':
                $this->requestShareMessage($dataMessage);
                break;
            case 'share':
                $this->shareMessage($dataMessage);
                break;
        }
        if ($this->message) {
            return $this->message;
        }
    }
}