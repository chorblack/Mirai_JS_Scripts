var Http = require("Http");
importClass(net.mamoe.mirai.event.GlobalEventChannel);
importClass(net.mamoe.mirai.event.ListeningStatus);
importClass(net.mamoe.mirai.event.events.GroupMessageEvent);
importClass(net.mamoe.mirai.message.code.MiraiCode);
importClass(net.mamoe.mirai.utils.ExternalResource);
importClass(java.nio.charset.Charset);
importClass(java.nio.ByteBuffer);
//importClass(net.mamoe.mirai.contact.Contact);
//importClass(net.mamoe.mirai.contact.Group);
importClass(net.mamoe.mirai.message.data.Image);
importPackage(net.mamoe.mirai.message.data);

function get_music_url(rid,mod){
    let param;
    (mod == 0) ? param = "keyword" :param = "rid";
    let base_url = 'http://47.100.69.166:666/?mod=' + mod.toString() + '&'+ param +'=' + rid;
    let res = Http.get(base_url).toString();
    return res;
}
    
function rename_use(file_name){
    let file_name = file_name.replace("\\", '').replace("/", '').replace(":", '').replace("*", '').replace("?",'').replace('"', '').replace("<", '').replace(">", '').replace("|", '').replace("&nbsp;", "");
    return file_name
}

function get_music_list(keyname){
    let base_url = 'http://47.100.69.166:666/?keyword=' + keyname + '&mod=1';
    let res = String(Http.get(base_url));
    let music_list = res.split("|");
    return music_list;
}


/*
importPackage(Packages["okhttp3"]);
let client = new OkHttpClient().newBuilder().build();
*/
var music_data;
var listener = net.mamoe.mirai.event.GlobalEventChannel.INSTANCE.subscribeAlways(net.mamoe.mirai.event.events.GroupMessageEvent, (event) => {
    var chain = event.getMessage();
    var groupId = event.getGroup().getId();
    for (let i=0;i<chain.length;i++){
        console.log(chain[i].toString());
    }
    function getImageUrl(image) {
        return event.getBot().queryImageUrl(image);
    }

   if (chain.stream().anyMatch((sm) => {return sm instanceof net.mamoe.mirai.message.data.Image;})){
        let image = chain.stream().filter((sm) => {
            return sm instanceof net.mamoe.mirai.message.data.Image;
        }).findFirst().orElse(null);
        let id = image.getImageId();
        id = id.substring(1, 37).replaceAll("-", "");
        let imageUrl = "http://gchat.qpic.cn/gchatpic_new/0/0-0-" + id + "/0?term=2";
        console.log(imageUrl);
    }
    if (chain.size() == 2 &&
        chain.stream().anyMatch((sm) => {
            return sm instanceof net.mamoe.mirai.message.data.PlainText;
        })
    ){
        var content = chain.stream().filter((sm) => {
            return sm instanceof net.mamoe.mirai.message.data.PlainText;
        }).findFirst().orElse(null).getContent().toString();
        if(/^%E7%82%B9%E6%AD%8C/.test(encodeURI(content))){
            content = encodeURI(content);
            music_data = get_music_url(content.replace("%E7%82%B9%E6%AD%8C",""),0);
            let data = JSON.parse(music_data);
            let music_artist = data.artist;
            let music_name = data.name;
            let music_picurl = data.pic;
            let music_url = data.url;
            event.getGroup().sendMessage(new MusicShare(MusicKind.NeteaseCloudMusic,music_name,music_artist,music_url,music_picurl,music_url));
        }
        if (/^#%E7%82%B9%E6%AD%8C/.test(encodeURI(content))){
            content = encodeURI(content);
            music_data = get_music_list(content.replace("#%E7%82%B9%E6%AD%8C",""));
            console.log(music_data.length);
            let total_music = "";
            for (let i = 0; i < music_data.length; i++) {
                let data = JSON.parse(music_data[i]);
                total_music = total_music + i + ":" + data["name"] + "-" + data["artist"] + "\n";
            }
            total_music = total_music + "--please input the #number to choose the music--";
            event.getGroup().sendMessage(total_music);
        }
        if (/^#\d+/.test(content)){
            let music_num = content.replace("#","");
            if (music_num == "" || music_num.length>3){
                return;
            }
            music_num = Number(music_num);
            let data = JSON.parse(music_data[music_num]);
            let music_rid = data.rid;
            let music_artist = data.artist;
            let music_name = data.name;
            let music_picurl = data.pic;
            let music_url = get_music_url(music_rid,2);
            event.getGroup().sendMessage(new MusicShare(MusicKind.NeteaseCloudMusic,music_name,music_artist,music_url,music_picurl,music_url));
        }
    }
});
