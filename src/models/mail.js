const nodemailer = require('nodemailer');

//创建发送邮件的请求对象
let nmail = nodemailer.createTransport({
    host: "smtp.qq.com", // 主机，不改
    ssl: true,// 使用ssl
    // host: 'smtp.qq.com',    //发送端邮箱
    port: 465,     //端口号
    secure: true,
    auth: {
        user: '2466921236@qq.com',
        pass: 'iqiiimuemzcwdjaa' //授权码
    }
});

function send(mail,code,callBack) {
    let mailObj = {
        from: '2466921236@qq.com',   // 邮件名称和发件人邮箱地址
        to: mail,   //收件人邮箱地址（这里的mail是封装后方法的参数，代表收件人的邮箱地址）
        subject: '欢迎注册',   //邮件标题
        text: '您的验证码是：'+code , // 邮件内容
    }
    // 发送邮件
    nmail.sendMail(mailObj, (err, data) => {
        if (err) {
            callBack(1);
        } else {
            console.log('发送成功: %s', data.messageId);
            callBack(0);
        }
    })
}
module.exports = { send }
