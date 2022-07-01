importClass(net.mamoe.mirai.event.GlobalEventChannel);
importClass(net.mamoe.mirai.event.ListeningStatus);
importClass(net.mamoe.mirai.event.events.GroupMessageEvent);
importClass(net.mamoe.mirai.message.code.MiraiCode);
importClass(net.mamoe.mirai.utils.ExternalResource);
importClass(net.mamoe.mirai.message.data.Image);
importPackage(net.mamoe.mirai.message.data);
importPackage(java.awt);
importClass(javax.imageio.ImageIO);
importClass(java.io.File);
importClass(java.awt.font.FontRenderContext);
importClass(java.awt.geom.AffineTransform);
importClass(java.awt.image.BufferedImage);
importClass(java.awt.geom.Rectangle2D);
importClass(java.nio.file.Paths);
importClass(java.io.ByteArrayOutputStream);
importClass(java.io.BufferedReader);
importClass(java.io.IOException);
importClass(java.io.InputStreamReader);
importClass(java.io.OutputStreamWriter);
importClass(java.net.URL);
importClass(java.net.HttpURLConnection);
importClass(java.lang.StringBuilder);
importPackage(java.io);
let rootPath = "C:\\Users\\15628\\Desktop\\project\\java\\Text2Pic";
function createImage(text, font, outFile){
    let arr = getWidthAndHeight(text, font);
    let width = arr[0];
    let height = arr[1];
    let image = new BufferedImage(width, height,BufferedImage.TYPE_INT_BGR);
    let g = image.getGraphics();
    g.setColor(Color.WHITE);
    g.fillRect(0, 0, width, height);
    g.setColor(Color.black);
    g.setFont(font);
    g.drawString(text, 0, font.getSize());
    g.drawString(text, 0, 2 * font.getSize());
    g.dispose();
    ImageIO.write(image, "png", outFile);
}

function getImageData(text, font){
    let arr = getWidthAndHeight(text, font);
    let width = arr[0];
    let height = arr[1];
    let image = new BufferedImage(width, height,BufferedImage.TYPE_INT_BGR);
    let g = image.getGraphics();
    g.setColor(Color.WHITE); 
    g.fillRect(0, 0, width, height);
    g.setColor(Color.black);
    g.setFont(font);
    g.drawString(text, 0, font.getSize());
    g.drawString(text, 0, 2 * font.getSize());
    g.dispose();
    let byteArrayOutputStream = new ByteArrayOutputStream();
    ImageIO.write(image, "png", byteArrayOutputStream);
    let ex = ExternalResource.create(byteArrayOutputStream.toByteArray());
    return ex;
    
}

function getWidthAndHeight(text, font) {
    let r = font.getStringBounds(text, new FontRenderContext(
    AffineTransform.getScaleInstance(1, 1), false, false));
    let unitHeight =  Math.floor(r.getHeight());
    let width = Math.round(r.getWidth()) + 1;
    let height = unitHeight + 3;
    console.log("width:" + width + ", height:" + height);
    return [width, height];
}


var listener = net.mamoe.mirai.event.GlobalEventChannel.INSTANCE.subscribeAlways(net.mamoe.mirai.event.events.GroupMessageEvent, (event) => {
    var chain = event.getMessage();
    var groupId = event.getGroup().getId();
    var senderId = event.getSender().getId();
    console.log("groupId:" + groupId + ", senderId:" + senderId);
    if (chain.stream().anyMatch((sm) => {
        return sm instanceof net.mamoe.mirai.message.data.PlainText;
    })){
        var content = chain.stream().filter((sm) => {
            return sm instanceof net.mamoe.mirai.message.data.PlainText;
        }).findFirst().orElse(null).getContent().toString();
        if (content.search("”Ô“Ù≤‚ ‘")!=-1){
            let url = new URL("https://cj-sycdn.kuwo.cn/ae5440289a0f42a4a1c8df6527571c73/62bb066a/resource/n2/44/85/3886770945.mp3");
            let httpUrl = url.openConnection();
            httpUrl.connect();
            let bytes = new BufferedInputStream(httpUrl.getInputStream());
            let ex = ExternalResource.create(bytes);
            let audio = event.getGroup().uploadAudio(ex);
            event.getGroup().sendMessage(audio);
        }
        if (senderId == 1562818788){
            let imageData = getImageData(content, new Font("ø¨ÃÂ", Font.PLAIN, 100));
            let image = event.getGroup().uploadImage(imageData);
            event.getGroup().sendMessage(image);
        }

    }
});