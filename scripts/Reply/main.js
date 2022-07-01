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
importClass(java.util.Random);
importPackage(java.io);
/**
 * 
 * @param {*} file 文件名
 * @param {*} text 写入内容
 * @param {*} method 写入方法，默认为覆盖，可选附加
 */
 function FileWrite(file,text,method){
    let f = File(file);
    if(!f.exists()){
      //判断文件是否存在，如果不存在就新建一个txt
      f.createNewFile();
    }
    (method ==null) ? method = false : method = true;
    let fileWriter = new java.io.FileWriter(file,method);
    let bufferedWriter = new java.io.BufferedWriter(fileWriter);
    bufferedWriter.write(text);
    bufferedWriter.newLine();
    bufferedWriter.flush();
    bufferedWriter.close();
}

/**
* 
* @param {*} file 文件名
* @returns 读取的文件内容
*/
function FileRead(file){
    let f = File(file);
    if(!f.exists()){
      //判断文件是否存在，如果不存在就新建一个txt
      f.createNewFile();
    }
    let fileInputStream = new FileInputStream(file);
    let inputStreamReader = new InputStreamReader(fileInputStream,"UTF-8");
    let bufferedReader = new BufferedReader(inputStreamReader);
    var lineTxt = bufferedReader.readLine();
    let text = "";
    
    while (lineTxt != null) {
        text = text + lineTxt;
        text = text + "\n";
        lineTxt = bufferedReader.readLine();
    }
    if (text.endsWith("\n")){
        text = text.substring(0,text.length-1);
    }
    bufferedReader.close();
    return text;
}


var data = FileRead("scripts/Reply/data.json");
var dataJson = JSON.parse(data);
var dataJsonLength = dataJson.length;
var replyArray = Array(dataJsonLength);
for (let key in dataJson){
    replyArray.push(key);
}

var listener = net.mamoe.mirai.event.GlobalEventChannel.INSTANCE.subscribeAlways(net.mamoe.mirai.event.events.GroupMessageEvent, (event) => {
    var chain = event.getMessage();
    var groupId = event.getGroup().getId();
    if (chain.stream().anyMatch((sm) => {
        return sm instanceof net.mamoe.mirai.message.data.PlainText;
    })){
        var content = chain.stream().filter((sm) => {
            return sm instanceof net.mamoe.mirai.message.data.PlainText;
        }).findFirst().orElse(null).getContent().toString();
        if (groupId!=826047796){
            for (let i = 0; i < replyArray.length-1; i++){
                if (content.indexOf(replyArray[i]) != -1){
                    let reply = dataJson[replyArray[i]];
                    let replyLength = reply.length;
                    let replyContent = reply[new Random().nextInt(replyLength-1)];
                    event.getGroup().sendMessage(replyContent);
                    break;
                }
            }
        }
        if (encodeURI(content).indexOf("%E5%91%80%E5%98%9E%E5%91%80%E5%98%9E") != -1){
            event.getGroup().sendMessage(Image.fromId("{16A8C9AD-B8F1-BA27-E5C8-D15E08A161CF}.jpg"));
        }
    }
});
