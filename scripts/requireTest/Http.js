importClass(java.io.BufferedReader);
importClass(java.io.IOException);
importClass(java.io.InputStreamReader);
importClass(java.io.OutputStreamWriter);
importClass(java.net.URL);
importClass(java.net.HttpURLConnection);
importClass(java.lang.StringBuilder);

/**
 * 
 * @param {*} method 请求方式
 * @param {*} httpUrl 请求地址
 * @param {*} param 参数
 * @returns 返回结果
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
    //关闭连接
    connection.disconnect();
    return String(result);
}
var Http = {};
Http.get = function(httpUrl){
    return requests("GET",httpUrl,null);
}

Http.post = function(httpUrl,param){
    return requests("POST",httpUrl,param);
}

module.exports = Http;