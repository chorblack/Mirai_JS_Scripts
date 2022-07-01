importClass(java.io.BufferedReader);
importClass(java.io.IOException);
importClass(java.io.InputStreamReader);
importClass(java.io.OutputStreamWriter);
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
  let inputStreamReader = new InputStreamReader(fileInputStream);
  let bufferedReader = new BufferedReader(inputStreamReader);
  let line = null;
  let text = "";
  while ((line = bufferedReader.readLine()) != null) {
    text = text + line;
    text = text + "\n";
  }
  text = text.substring(0,text.length-1);
  bufferedReader.close();
  return text;
}