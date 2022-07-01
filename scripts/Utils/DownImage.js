importClass(java.io.BufferedReader);
importClass(java.io.IOException);
importClass(java.io.InputStreamReader);
importClass(java.io.OutputStreamWriter);
importClass(java.net.URL);
importClass(java.net.HttpURLConnection);
importClass(java.lang.StringBuilder);
importPackage(java.io);

/**
 * 
 * @param {*} file 写入文件夹名字，留空为同目录下
 * @param {*} httpUrl 下载地址
 * @returns 是否下载成功
 */
function DownImage(file,httpUrl){
    (file == ""|file == null) ? file = "./" : file = file;
    let arrUrl = httpUrl.split("/");
    let buf = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
    let size = 0;
    try{
        let name = new FileOutputStream(file + arrUrl[arrUrl.length-1]);
        var url = new URL(httpUrl);
        var connection = url.openConnection();
        connection.connect();
        let bis = new BufferedInputStream(connection.getInputStream());
        let f = new File(name);
        if(!f.exists()){
            //判断文件是否存在，如果不存在就新建一个
            f.createNewFile();
        }
        while ((size = bis.read(buf)) != -1){
            name.write(buf, 0, size);
        }
        //记得及时释放资源
        name.close();
        bis.close();
        connection.disconnect();
        return true;
    }catch(e){
        console.log(e);
        connection.disconnect();
        return false;
    }
}