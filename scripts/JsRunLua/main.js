importClass(net.mamoe.mirai.event.GlobalEventChannel);
importClass(net.mamoe.mirai.event.ListeningStatus);
importClass(net.mamoe.mirai.event.events.GroupMessageEvent);
importClass(net.mamoe.mirai.message.code.MiraiCode);
importClass(net.mamoe.mirai.utils.ExternalResource);
importClass(net.mamoe.mirai.message.data.Image);
importPackage(net.mamoe.mirai.message.data);
importClass(org.luaj.vm2.lib.jse.JsePlatform);
var globals = JsePlatform.standardGlobals();
var luaPath = "C:\\Users\\15628\\Desktop\\project\\mirai\\scripts\\JsRunLua\\test.lua";
globals.loadfile(luaPath).call();
c = globals.get("c").toString();
console.log(c);
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
