importClass(net.mamoe.mirai.event.GlobalEventChannel);
importClass(net.mamoe.mirai.event.ListeningStatus);
importClass(net.mamoe.mirai.event.events.GroupMessageEvent);
importClass(net.mamoe.mirai.message.code.MiraiCode);
importClass(net.mamoe.mirai.utils.ExternalResource);
importClass(net.mamoe.mirai.message.data.Image);
importPackage(net.mamoe.mirai.message.data);
/**
 * tmd，只能发不能接
 */
function sendMail(){
    importClass(java.util.Properties);
    importPackage(javax.mail);
    importPackage(javax.activation);
    importPackage(javax.mail.internet);
    let props = new Properties();
    props.put("mail.smtp.host", "smtp.163.com");
    let session = javax.mail.Session.getInstance(props, null);
    try {
        let msgcode = 1234;
        let msg = new MimeMessage(session);
       // msg.setFrom("你的邮箱","你想使用的发送名");
        msg.setFrom(new InternetAddress("xxxx@163.com", "芜湖起飞", "UTF-8"));
        msg.setRecipients(javax.mail.Message.RecipientType.TO,"xxxx@qq.com");
        msg.setSubject("芜湖起飞"); //标题
        msg.setSentDate(new Date());
        msg.setText(msgcode);
        Transport.send(msg, "xxxx@163.com", "授权码");
    } catch (mex) {
        console.log(mex)
    }
}

function getMail() {
    importClass(java.util.Properties);
    importClass(java.lang.Class);
    importClass(javax.mail.Folder);
    //importClass(javax.mail.Message);
    importClass(javax.mail.internet.MimeMessage)
    importClass(javax.mail.Session);
    importClass(javax.mail.Store);
    importClass(java.lang.StringBuffer);
    importClass(java.io.InputStreamReader);
    importClass(java.io.BufferedReader);
    importClass(javax.mail.internet.MimeBodyPart)
    importClass(java.lang.StringBuilder);
    importClass(javax.mail.util.ByteArrayDataSource);
    importClass(javax.mail.internet.MimeMultipart);
    let protocol = "pop3";
    let isSSL = true;
    let host = "pop.163.com";
    let port = 995;
    let username = "xxxx@163.com";
    let password = "授权码";
    
    let props = new Properties();
    props.put("mail.pop3.ssl.enable", isSSL);
    props.put("mail.pop3.host", host);
    props.put("mail.pop3.port", port);
    
    let session = Session.getDefaultInstance(props);
    
    let store = null;
    let folder = null;
    try {
      store = session.getStore(protocol);
      store.connect(username, password);
    
      folder = store.getFolder("INBOX");
      folder.open(Folder.READ_ONLY);
      let size = folder.getMessageCount();
      console.log("邮件总数："+ size);
      let message = folder.getMessage(size);
      let from = message.getFrom()[0].toString().match(/<(\S*)>/)[1];
      let subject = message.getSubject();
      let content = getBody(message);
      let date = message.getSentDate();
      console.log("From: " + from);
      console.log("Subject: " + subject);
      console.log("Data："+ content);
      console.log("Date: " + date);
      console.log("邮件大小：" + message.getSize());
    } catch (e) {
      console.log(e);
    } finally {
      try {
        if (folder != null) {
          folder.close(false);
        }
        if (store != null) {
          store.close();
        }
      } catch (e) {
        console.log(e);
      }
    }
    console.log("接收完毕！");   
}




function getBody(part) {
    if (part.isMimeType("text/*")) {
        // Part是文本:
        return part.getContent().toString();
    }
    if (part.isMimeType("multipart/*")) {
        // Part是一个Multipart对象:
        let multipart = part.getContent();
        // 循环解析每个子Part:
        for (let i = 0; i < multipart.getCount(); i++) {
            let bodyPart = multipart.getBodyPart(i);
            let body = getBody(bodyPart);
            if (body) {
                return body;
            }
        }
    }
    return "";
}
//getMail();
var listener = net.mamoe.mirai.event.GlobalEventChannel.INSTANCE.subscribeAlways(net.mamoe.mirai.event.events.GroupMessageEvent, (event) => {
    var chain = event.getMessage();
    var groupId = event.getGroup().getId();
    if (chain.stream().anyMatch((sm) => {
        return sm instanceof net.mamoe.mirai.message.data.PlainText;
    })){
        var content = chain.stream().filter((sm) => {
            return sm instanceof net.mamoe.mirai.message.data.PlainText;
        }).findFirst().orElse(null).getContent().toString();
        
    }
});
