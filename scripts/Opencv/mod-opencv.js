/*
 * @version: 2.0
 * @Date: 2021-10-24 15:10:47
 * @LastEditTime: 2021-10-24 15:28:06
 * @LastEditors: 澪
 * @Description: opencv-sift
 * @QQ号: 1562818788
 */

java.lang.System.load(java.lang.System.getProperty("user.dir") + "/libs/opencv_java460.dll");
importClass(java.util.LinkedList);
importClass(java.io.File);
importClass(java.io.FileOutputStream);
importClass(org.opencv.core.Point);
importClass(org.opencv.imgproc.Imgproc);
importClass(org.opencv.imgcodecs.Imgcodecs);
importClass(org.opencv.core.Core);
importClass(org.opencv.core.Mat);
importClass(org.opencv.core.MatOfDMatch);
importClass(org.opencv.core.MatOfKeyPoint);
importClass(org.opencv.core.MatOfPoint2f);
importClass(org.opencv.core.MatOfRect);
importClass(org.opencv.core.Size);
importClass(org.opencv.features2d.DescriptorMatcher);
importClass(org.opencv.features2d.Features2d);
importPackage(org.opencv.highgui.Highgui);
importPackage(org.opencv.features2d);
importClass(org.opencv.calib3d.Calib3d);
importClass(org.opencv.core.CvType);
importClass(org.opencv.core.Scalar);
importClass(org.opencv.core.MatOfByte);
importClass(org.opencv.imgcodecs.Imgcodecs);
importClass(org.opencv.core.Rect);

var opencv = {};
/**
 * 对图片进行裁剪，并返回一个新的mat类型图片
 * @param {*} image 图片对象
 * @param {*} x x坐标
 * @param {*} y y坐标
 * @param {*} width 宽度
 * @param {*} height 高度
 * @returns Mat类型对象
 */
opencv.cropImage = function(image, x, y, width, height) {
    var resImage = new Mat(image, new Rect(x, y, width, height));
    return resImage;
}

/**
 * 第一个参数是小图，即要找的图，第二个参数是大图
 * @param {*} temp 小图
 * @param {*} origin 大图
 * @param {*} rect [x,y,width,height]
 */
opencv.sift = function(temp, origin, rect) {
    (rect == undefined) ? rect = [0, 0, origin.cols(), origin.rows()]: rect = [origin.cols() * rect[0], origin.rows() * rect[1], origin.cols() * rect[2], origin.rows() * rect[3]]
    var templateImage = temp;
    console.log(rect)
    var clip = opencv.cropImage(origin, rect[0], rect[1], rect[2], rect[3]);
    var originalImage = clip;
    /*
    Imgproc.GaussianBlur(templateImage, templateImage, new Size(3, 3), 0, 0);
    Imgproc.cvtColor(templateImage, templateImage,Imgproc.COLOR_BGR2GRAY);

    Imgproc.GaussianBlur(originalImage, originalImage, new Size(3, 3), 0, 0);
    Imgproc.cvtColor(originalImage, originalImage,Imgproc.COLOR_BGR2GRAY);
    */
    let templateKeyPoints = new MatOfKeyPoint();
    let originalKeyPoints = new MatOfKeyPoint();
    let resT = new Mat();
    let resO = new Mat();
    //	匹配的点数
    let sift = SIFT.create();
    //提取对象关键点
    sift.detect(templateImage, templateKeyPoints);
    sift.detect(originalImage, originalKeyPoints);
    //提取描述子
    sift.compute(templateImage, templateKeyPoints, resT);
    sift.compute(originalImage, originalKeyPoints, resO);
    let matches = new LinkedList();
    let descriptorMatcher = DescriptorMatcher.create(DescriptorMatcher.FLANNBASED);
    console.log("寻找最佳匹配");
    /**
     * knnMatch方法的作用就是在给定特征描述集合中寻找最佳匹配
     * 使用KNN-matching算法，令K=2，则每个match得到两个最接近的descriptor，然后计算最接近距离和次接近距离之间的比值，当比值大于既定值时，才作为最终match。
     */
    descriptorMatcher.knnMatch(resT, resO, matches, 2);
    console.log("计算匹配结果");
    let goodMatchesList = new LinkedList();
    let nndrRatio = 0.7;
    //对匹配结果进行筛选，依据distance进行筛选
    for (var i = 0; i < matches.size(); i++) {
        let dmatcharray = matches.get(i).toArray();
        let m1 = dmatcharray[0];
        let m2 = dmatcharray[1];
        if (m1.distance <= m2.distance * nndrRatio) {
            goodMatchesList.addLast(m1);
        }
    }
    let matchesPointCount = goodMatchesList.size();
    //当匹配后的特征点大于等于 4 个，则认为模板图在原图中，该值可以自行调整
    if (matchesPointCount >= 4) {
        console.log("模板图在原图匹配成功！");
        let templateKeyPointList = templateKeyPoints.toList();
        let originalKeyPointList = originalKeyPoints.toList();
        let objectPoints = new LinkedList();
        let scenePoints = new LinkedList();
        for (var j = 0; j < goodMatchesList.size(); j++) {
            objectPoints.addLast(templateKeyPointList.get(goodMatchesList.get(j).queryIdx).pt);
            scenePoints.addLast(originalKeyPointList.get(goodMatchesList.get(j).trainIdx).pt);
        }
        let objMatOfPoint2f = new MatOfPoint2f();
        objMatOfPoint2f.fromList(objectPoints);
        let scnMatOfPoint2f = new MatOfPoint2f();
        scnMatOfPoint2f.fromList(scenePoints);
        //使用 findHomography 寻找匹配上的关键点的变换
        let homography = Calib3d.findHomography(objMatOfPoint2f, scnMatOfPoint2f, Calib3d.RANSAC, 3);
        /**
         * 透视变换(Perspective Transformation)是将图片投影到一个新的视平面(Viewing Plane)，也称作投影映射(Projective Mapping)。
         */
        let templateCorners = new Mat(4, 1, CvType.CV_32FC2);
        let templateTransformResult = new Mat(4, 1, CvType.CV_32FC2);
        let double1 = java.lang.reflect.Array.newInstance(java.lang.Double.TYPE, 2);;
        double1[0] = 0;
        double1[1] = 0;
        templateCorners.put(0, 0, double1);
        double1[0] = templateImage.cols();
        templateCorners.put(1, 0, double1);
        double1[1] = templateImage.rows();
        templateCorners.put(2, 0, double1);
        double1[0] = 0;
        templateCorners.put(3, 0, double1);
        //使用 perspectiveTransform 将模板图进行透视变以矫正图象得到标准图片
        Core.perspectiveTransform(templateCorners, templateTransformResult, homography);
        //矩形四个顶点  匹配的图片经过旋转之后就这个矩形的四个点的位置就不是正常的abcd了
        let pointA = templateTransformResult.get(0, 0);
        let pointB = templateTransformResult.get(1, 0);
        let pointC = templateTransformResult.get(2, 0);
        let pointD = templateTransformResult.get(3, 0);
        //将匹配的图像用用四条线框出来
        Imgproc.rectangle(originalImage, new Point(pointA), new Point(pointC), new Scalar(0, 255, 0));
        let goodMatches = new MatOfDMatch();
        goodMatches.fromList(goodMatchesList);
        let matchOutput = new Mat(originalImage.rows() * 2, originalImage.cols() * 2, Imgcodecs.IMREAD_COLOR);
        Features2d.drawMatches(templateImage, templateKeyPoints, originalImage, originalKeyPoints, goodMatches, matchOutput, new Scalar(0, 255, 0), new Scalar(255, 0, 0), new MatOfByte(), 2);
        Features2d.drawMatches(templateImage, templateKeyPoints, originalImage, originalKeyPoints, goodMatches, matchOutput, new Scalar(0, 255, 0), new Scalar(255, 0, 0), new MatOfByte(), 2);
        //你也可以保存中心点，例如：return [(pointA[0]+pointB[0])/2,(pointA[1]+pointB[1])/2]
        //clip.release();
        java.lang.System.gc();
        let judge1 = (((pointC[0]-pointA[0])*0.9 < temp.cols()) && (temp.cols() < (pointC[0]-pointA[0])*1.1));
        let judge2 = (((pointC[1]-pointA[1])*0.9 < temp.rows()) && (temp.rows() <(pointC[1]-pointA[1])*1.1));
        let judge3 = ((origin.cols()*-0.05 < (rect[0] + pointA[0])) && ((rect[0] + pointA[0]) <origin.cols()));
        let judge4 = ((origin.rows()*-0.05 < (rect[0] + pointA[0])) && ((rect[0] + pointA[0]) <origin.rows()));
        let judge5 = (temp.cols() < origin.cols());
        let judge6 = (temp.rows() < origin.rows());
        if (1){
            return {
                position: {
                    "x": rect[0] + pointA[0],
                    "y": rect[1] + pointA[1]
                },
                process: matchOutput,
                result: originalImage
            };
        } else {
            console.log("精度不够！");
            return {
                position: {
                    "x": -1,
                    "y": -1
                }
            }
        }

    } else {
        console.log("模板图不在原图中！");
        clip.release()
        return {
            position: {
                "x": -1,
                "y": -1
            }
        }
    }
}

/**
 * mat to bytes
 * @param {*} mat mat类型图片
 * @returns byte数组
 */
opencv.mat2bytes = function(mat) {
    let byteArray = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, mat.total() * mat.channels());
    mat.get(0, 0, byteArray);
    return byteArray;
}
//读取路径中的图片并返回一个Image类型对象（这不是mat类型吗）
opencv.readImage = function(path) {
    let image = Imgcodecs.imread(path);
    return image;
}
//将Mat类型图片保存到指定路径
opencv.saveImage = function(path, mat) {
    Imgcodecs.imwrite(path, mat);
}
module.exports = opencv;