angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope,$ionicModal,$rootScope,$ionicLoading,$q) {

    $scope.data = {
        selectDevice: '',//存储蓝牙地址
        pairedDevices: [],//已经配对的蓝牙
        models: [],//多种模板
        selectModel: '',//选中模板
        chipType: '',
        chipId: ''
    };

    $scope.data.models = [{
        value:"model1",
        name:"model1"
    },{
        value:"model2",
        name:"model2"
    },{
        value:"model3",
        name:"model3"
    }];


	$ionicModal.fromTemplateUrl('templates/setting.html',  {
        scope: $scope,
        animation: 'slide-in-right'
    }).then(function (modal) {
        $scope.settingModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/model.html',  {
        scope: $scope,
        animation: 'slide-in-right'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    document.addEventListener("deviceready", function () {
        //如果有打印机地址，连接打印机
        $scope.data.selectDevice = angular.fromJson(window.localStorage.getItem("gprinter_add")) + "";   
        if ($scope.data.selectDevice != null && $scope.data.selectDevice !== "") {
            connectGPrint($scope.data.selectDevice);
        }
        else{
            alert("蓝牙地址为空");
        }

    }, false);
  
    //打印方法
    function printTag(){
        var str = getPrintString();
        if (window.cordova && cordova.plugins.BluetoothPrint) {
            cordova.plugins.BluetoothPrint.printText(str, function (success) {
                
            }, function (error) {
                
            });
        }       
    }
  
    //定义标签纸宽高
    function getSIZE(w,h){
        return "SIZE "+w+" mm, "+h+" mm";
    }
    //间隙高度，间隙高度补偿值
    function getGAP(m,n){
        return "GAP "+m+" mm, "+n+" mm";
    }
    //打印速度
    function getSPEED(s){
        return "SPEED "+s;
    }
    //打印浓度
    function getDENSITY(d){
        return "DENSITY "+d;
    }
    //打印方向
    function getDIRECTION(d){
        return "DIRECTION "+d;
    }
    //清除缓存
    function getCLS(){
        return "CLS";
    }
    //设置文字
    //x：文字方塊左上角 X 座标，y: 文字方塊左上角 Y 座标，font：字型名称，
    //rotation：顺时针旋转角度，xm：水平放大值（1-10），
    //ym：垂直放大值（1-10），content：文字内容字符串
    function getTEXT(x,y,font,rotation,xm,ym,content){
        if(content.indexOf("@")<0){
            return "TEXT "+x+","+y+","+"\""+font+"\""+","+rotation+","+xm+","+ym+","+"\""+content+"\"";
        }
        else{
            return "TEXT "+x+","+y+","+"\""+font+"\""+","+rotation+","+xm+","+ym+","+content;
        }
    }
    //设置二维码
    //x：QRCODE 条码左上角 X 座标，y：QRCODE 条码左上角 Y 座标，
    //level：错误纠正能力等级，cw：1-10，mode：A/M(自动或手动生成编码)
    //rotation：顺时针旋转角度，content：条码内容字符串
    function getQRCODE(x,y,level,cw,mode,rotation,content){
        if(content.indexOf("@")<0){
            return "QRCODE "+x+","+y+","+level+","+cw+","+mode+","+rotation+","+"\""+content+"\"";
        }
        else{
            return "QRCODE "+x+","+y+","+level+","+cw+","+mode+","+rotation+","+content;
        }
    }
    //设置一维码
    //x：BARCODE 条码左上角 X 座标，y：BARCODE 条码左上角 Y 座标，
    //codeType：条码类型，h：条码高度，hr：有无人眼可识别码（0\1）
    //rotation：顺时针旋转角度，narrow：窄条码比例因子 (dot)
    //wide：宽条码比例因子 (dot)，content：条码内容字符串
    function getBARCODE(x,y,codeType,h,hr,rotation,narrow,wide,content){
        if(content.indexOf("@")<0){
             return "BARCODE "+x+","+y+","+"\""+codeType+"\""+","+h+","+hr+","+rotation+","+narrow+","+wide+","+"\""+content+"\"";
        }
        else{
             return "BARCODE "+x+","+y+","+"\""+codeType+"\""+","+h+","+hr+","+rotation+","+narrow+","+wide+","+content;
        }
        
    }
    //设置计数器
    //n：计数器号
    //step：增量值
    //expression：初始字符串

    function getSETCOUNTER(n,step,expression){
        return "SET COUNTER "+"@"+n+" "+step+"\n"
                +"@"+n+"="+"\""+expression+"\"";
    }

    //打印张数，打印张数的copy数
    function getPRINT(m,n){
        return "PRINT "+m+","+n;
    }

    function getModel1Str(){
        return getSIZE(40,30)+"\n"
               + getGAP(2,0)+"\n"
               + getSPEED(4)+"\n"
               + getDENSITY(8)+"\n"
               + getDIRECTION(1)+"\n"
               + getCLS()+"\n"
               + getTEXT(20,30,3,0,1,1,"123")+"\n"
               + getPRINT(1,2)+"\n"
               + getSIZE(40,30)+"\n"
               + getGAP(2,0)+"\n"
               + getSPEED(4)+"\n"
               + getDENSITY(8)+"\n"
               + getDIRECTION(1)+"\n"
               + getCLS()+"\n"
               + getTEXT(20,30,3,0,1,1,"abc")+"\n"
               + getPRINT(1,2)+"\n";

        // return  "SIZE 40 mm, 30 mm"+"\n"
        //         "GAP 2 mm, 0 mm"+"\n"
        //         "DIRECTION 1"+"\n"
        //         "CLS"+"\n"
        //         "TEXT 20,130,"+"\""+"3"+"\""+",0,1,1,"+"\""+"456"+"\""+"\n"
        //         "PRINT 1,1"+"\n";

    }
    function getModel2Str(){
        return getSIZE(70,15)+"\n" 
               + getGAP(2,0)+"\n"
               + getSPEED(4)+"\n"
               + getDENSITY(8)+"\n"
               + getDIRECTION(1)+"\n"
               + getCLS()+"\n"
               + getTEXT(20,100,3,0,1,1,$scope.data.chipId)+"\n"
               + getTEXT(20,30,3,0,1,1,$scope.data.chipType)+"\n"
               + getQRCODE(100,15,"H",4,"A",0,$scope.data.chipId)+"\n"
               + getPRINT(1,1)+"\n";

    }
    function getModel3Str(){
        return getSIZE(40,30)+"\n"
               + getGAP(2,0)+"\n"
               + getSPEED(4)+"\n"
               + getDENSITY(8)+"\n"
               + getDIRECTION(1)+"\n"
               + getCLS()+"\n"
               + getBARCODE(10,100,"128",48,0,0,2,4,$scope.data.chipId)+"\n"
               + getBARCODE(10,10,"128",48,1,0,2,1,$scope.data.chipId)+"\n"
               + getPRINT(1,1)+"\n";

    }

    //获取打印命令字符串
    function getPrintString(){
        var printString = '';
        if($scope.data.selectModel === "model1"){
            printString = getModel1Str();        
        }
        else if($scope.data.selectModel === "model2"){
            printString = getModel2Str();  
        }
        else if($scope.data.selectModel === "model3"){
            printString = getModel3Str();  
        }
        else{

        }
        return printString;
        
    }

    //连接打印机蓝牙(蓝牙地址)
    function connectGPrint(address) {
        // alert(address);
        if (address != null && address !== "" && address !== "null") {
            // $ionicLoading.show({
            //     template: 'Loading...'
            // });
            if (window.cordova && cordova.plugins.BluetoothPrint) {
                cordova.plugins.BluetoothPrint.connectDevice(address, function (success) {
                    //连接成功，存入选中的蓝牙地址
                    // $timeout(function(){
                    //     $ionicLoading.hide();
                    // });
                    alert("连接成功");
                    window.localStorage.setItem("gprinter_add", angular.toJson(address));
                     
                }, function (error) {
                    alert("连接失败");
                    // $timeout(function(){
                    //     $ionicLoading.hide();
                    // });     
                });
            }
        }
        else{
            alert("蓝牙地址为空");
        }
    }

    //关闭打印机连接
    $scope.closeGPrintConnect = function () {
        if (window.cordova && cordova.plugins.BluetoothPrint) {
            cordova.plugins.BluetoothPrint.closeConnect(function (success) {
                alert("断开连接成功");
            }, function (error) {
                alert("断开连接失败");   
            });
        }
    };
 

    $scope.getOneDevice = function (address) {

        $scope.data.selectDevice = address;
        $scope.settingModal.hide();

    };

    $scope.selectModel = function(){
        $scope.modal.show();
    };
    $scope.getOneModel = function(value){
        $scope.data.selectModel = value;
        $scope.modal.hide();
    };

    //获取配对蓝牙列表
    $scope.getPairedDevices = function () {

        if (window.cordova && cordova.plugins.BluetoothPrint) {
            // $ionicLoading.show({
            //     template: 'Loading...'
            // });
            // alert("getPairedDevices");
            cordova.plugins.BluetoothPrint.getPairedDevices(function (data) {
                // $ionicLoading.hide();
                $scope.data.pairedDevices = data;
                $scope.settingModal.show();
                
            }, function (error) {
                // $ionicLoading.hide();
                alert(error);
            });
        }
    };
    
    //打印方法
    $scope.print = function () {
        printTag(); 
    };
    //连接蓝牙
    $scope.connect = function () {
        connectGPrint($scope.data.selectDevice);
    };
    
});
