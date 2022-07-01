//send Image to group
let url = new URL(music_picurl);
var httpUrl = url.openConnection();
httpUrl.connect();
var bytes = new BufferedInputStream(httpUrl.getInputStream());
let ex = ExternalResource.create(bytes);
let image = event.getGroup().uploadImage(ex);
event.getGroup().sendMessage(image);

//String to byte[]
var str = "芜湖起飞"; 
var bytes = (new java.lang.String(str)).getBytes("UTF-8"); 
console.log(java.lang.String(bytes,"GBK"));

//java.lang.System.load(java.lang.System.getProperty("user.dir") + "\\libs\\opencv_java460.dll");
//console.log("用户的当前工作目录:"+ java.lang.System.getProperty("user.dir"));