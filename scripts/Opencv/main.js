var opencv = require("mod-opencv");
importClass(net.mamoe.mirai.event.GlobalEventChannel);
importClass(net.mamoe.mirai.event.ListeningStatus);
importClass(net.mamoe.mirai.event.events.GroupMessageEvent);
importClass(net.mamoe.mirai.message.code.MiraiCode);
importClass(net.mamoe.mirai.utils.ExternalResource);
importClass(net.mamoe.mirai.message.data.Image);
importPackage(net.mamoe.mirai.message.data);
/*
Transport.send(msg, "shabixuexiaonmsl@163.com", "IXGKAGLGNEXWPRUC");*/

let image1 = opencv.readImage(java.lang.System.getProperty("user.dir") +"/scripts/Opencv/1.jpg");
let image2 = opencv.readImage(java.lang.System.getProperty("user.dir") +"/scripts/Opencv/2.jpg");
let res = opencv.sift(image2, image1);
console.log(JSON.stringify(res.position));
opencv.saveImage(java.lang.System.getProperty("user.dir") +"/scripts/Opencv/demo.png",res.process);
opencv.saveImage(java.lang.System.getProperty("user.dir") +"/scripts/Opencv/demo1.png",res.result);
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
