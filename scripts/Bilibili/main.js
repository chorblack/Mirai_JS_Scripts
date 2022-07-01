importClass(net.mamoe.mirai.event.GlobalEventChannel);
importClass(net.mamoe.mirai.event.ListeningStatus);
importClass(net.mamoe.mirai.event.events.GroupMessageEvent);
importClass(net.mamoe.mirai.message.code.MiraiCode);
importClass(net.mamoe.mirai.utils.ExternalResource);
importClass(net.mamoe.mirai.message.data.Image);
importPackage(net.mamoe.mirai.message.data);
importClass(java.io.BufferedReader);
importClass(java.io.IOException);
importClass(java.io.InputStreamReader);
importClass(java.io.OutputStreamWriter);
importClass(java.net.URL);
importClass(java.net.HttpURLConnection);
importClass(java.lang.StringBuilder);
importPackage(java.io);
importClass(java.util.regex.Pattern);
importClass(java.util.regex.Matcher);

/**
 * 
 * @param {*} method 请求方式，默认为GET
 * @param {*} httpUrl 请求地址
 * @param {*} param 请求参数
 * @returns 请求结果
 */
 function requests(method, httpUrl, param){
    let result = new StringBuilder();
    try{
        let url = new URL(httpUrl);
        var connection = url.openConnection();
        connection.setRequestMethod(method);
        connection.setRequestProperty("accept", "*/*");
        connection.setRequestProperty("connection", "Keep-Alive");
        connection.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)");
        /*
        connection.setConnectTimeout(15000);
        connection.setReadTimeout(15000);
        */
        if (method == "POST"){
            connection.setDoOutput(true);
            connection.setDoInput(true);
            if (param!=null && param!="") {
                var out = new OutputStreamWriter(connection.getOutputStream(), "UTF-8");
                out.write(param);
                out.flush();
            }
        }
        if (connection.getResponseCode() == 200){
            var ind = new BufferedReader(new InputStreamReader(connection.getInputStream(),"UTF-8"));
            while ((line = ind.readLine()) != null) {
                result.append(line);
            }
        } 
        }catch(e){
            console.log(e);
        }finally{
        if(out!=null){
            out.close();
        }
        if(ind!=null){
            ind.close();
        }
    }
    connection.disconnect();
    return String(result);
}

let p1 = Pattern.compile(
    "^https://(www\\.|)bilibili\\.com/video/([A-Za-z0-9]+)(/.*|\\?.*|)$"
);
let p2 = Pattern.compile(
    "^https://b23\\.tv/([0-9A-Za-z]+)(/.*|\\?.*|)$"
);
let p4 = Pattern.compile(
    //https://www.bilibili.com/video/av62580762?p=3
    "^av([0-9]+)(/.*|\\?.*|)$"
);
let p5 = Pattern.compile(
    //https://www.bilibili.com/video/av62580762?p=3
    "^BV([0-9A-Za-z]+)(/.*|\\?.*|)$"
);

function make_check(id) {
    if (id.startsWith("BV")) {
        return "https://api.bilibili.com/x/web-interface/view?bvid=" + id;
    }
    if (id.startsWith("av")) {
        return "https://api.bilibili.com/x/web-interface/view?aid=" + id.substring(2);
    }
    return "https://api.bilibili.com/x/web-interface/view?aid=" + id;
}
let matchList = [p1, p2, p4, p5];
let groupItem = [2, 1, 1, 0];

var listener = net.mamoe.mirai.event.GlobalEventChannel.INSTANCE.subscribeAlways(net.mamoe.mirai.event.events.GroupMessageEvent, (event) => {
    var chain = event.getMessage();
    var groupId = event.getGroup().getId();
    if (chain.stream().anyMatch((sm) => {
        return sm instanceof net.mamoe.mirai.message.data.PlainText;
    })){
        var content = chain.stream().filter((sm) => {
            return sm instanceof net.mamoe.mirai.message.data.PlainText;
        }).findFirst().orElse(null).getContent().toString();
        for (let i = 0; i < matchList.length; i++) {
            let match = matchList[i];
            let matcher = match.matcher(content);
            if (matcher.find()){
                let requestUrl = make_check(matcher.group(groupItem[i])); 
                let resData = requests("GET", requestUrl);
                let jsonData = JSON.parse(resData);
                let builder = new MessageChainBuilder();
                if (jsonData.code == 0) {
                    let title = jsonData.data.title;
                    let cover = jsonData.data.pic.toString() + "@448w_252h_1c_100q.jpg";
                    let url = new URL(cover);
                    let httpUrl = url.openConnection();
                    httpUrl.connect();
                    let bytes = new BufferedInputStream(httpUrl.getInputStream());
                    let ex = ExternalResource.create(bytes);
                    builder.add(event.getGroup().uploadImage(ex))
                    httpUrl.disconnect();
                    builder.add(title + "\n");
                    let desc = jsonData.data.desc;
                    if (desc == null) desc = "";
                    if (desc.length > 15) desc = desc.substring(0, 15) + "...";
                    if (desc == "") desc = title;
                    let author = jsonData.data.owner.name;
                    builder.add("Up: " + author + "\n");
                    builder.add("描述: " + desc + "\n");
                    let danmaku = jsonData.data.stat.danmaku;
                    let view = jsonData.data.stat.view;
                    let like = jsonData.data.stat.like;
                    let coin = jsonData.data.stat.coin;
                    let favorite = jsonData.data.stat.favorite;
                    let comment = jsonData.data.stat.reply;
                    builder.add("播放: " + view + " 弹幕: " + danmaku + "\n");
                    builder.add("投币: " + coin + " 点赞: " + like + " 收藏: " + favorite + " 评论: " + comment + "\n");
                    builder.add("视频地址: " + "https://www.bilibili.com/video/" + jsonData.data.bvid.toString());
                    event.getGroup().sendMessage(builder.build());
                    break;
                } 
            }
        }        
    }
});