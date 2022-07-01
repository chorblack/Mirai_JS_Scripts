importClass(net.mamoe.mirai.event.GlobalEventChannel);
importClass(net.mamoe.mirai.event.ListeningStatus);
importClass(net.mamoe.mirai.event.events.GroupMessageEvent);
importClass(net.mamoe.mirai.message.code.MiraiCode);
importClass(net.mamoe.mirai.utils.ExternalResource);
importClass(net.mamoe.mirai.message.data.Image);
importPackage(net.mamoe.mirai.message.data);
GlobalEventChannel.INSTANCE.subscribe(GroupMessageEvent, event => {
    var chain = event.getMessage();
    var groupId = event.getGroup().getId();
    if (chain.size() == 2 &&
            chain.stream().anyMatch((sm) => {
                return sm instanceof net.mamoe.mirai.message.data.PlainText;
            })
        ){
            var content = chain.stream().filter((sm) => {
                return sm instanceof net.mamoe.mirai.message.data.PlainText;
            }).findFirst().orElse(null).getContent().toString();
            if (content.search("1")!=-1){
                event.getGroup().sendMessage("2");
            }
        }
});