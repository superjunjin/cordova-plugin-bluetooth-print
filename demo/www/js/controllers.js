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
        var gprinter_address = angular.fromJson(window.localStorage.getItem("gprinter")) + "";   
        if (gprinter_address != null && gprinter_address !== "") {
            connectGPrint(gprinter_address);
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
    //X：文字方塊左上角 X 座标，Y: 文字方塊左上角 Y 座标，font：字型名称，
    //rotation：顺时针旋转角度，X-multiplication：水平放大值（1-10），
    //Y-multiplication：垂直放大值（1-10），content：文字内容字符串
    function getTEXT(x,y,font,rotation,xm,ym,content){
        return "TEXT "+x+","+y+","+"\""+font+"\""+","+rotation+","+xm+","+ym+","+"\""+content+"\"";
    }
    //设置二维码
    //X：QRCODE 条码左上角 X 座标，Y：QRCODE 条码左上角 Y 座标，
    //ECC level：错误纠正能力等级，cell width：1-10，mode：A/M(自动或手动生成编码)
    //rotation：顺时针旋转角度，Data string：条码内容字符串
    function getQRCODE(x,y,level,cw,mode,rotation,content){
        return "QRCODE "+x+","+y+","+level+","+cw+","+mode+","+rotation+","+"\""+content+"\"";
    }
    //打印张数，打印张数的copy数
    function getPRINT(m,n){
        return "PRINT "+m+","+n;
    }

    function getModel1Str(){
        return getSIZE(70,15)+"\n"
               + getGAP(2,0)+"\n"
               + getSPEED(4)+"\n"
               + getDENSITY(8)+"\n"
               + getDIRECTION(1)+"\n"
               + getCLS()+"\n"
               + getTEXT(20,30,3,0,1,1,$scope.data.chipType)+"\n"
               + getTEXT(20,80,3,0,1,1,$scope.data.chipId)+"\n"
               + getPRINT(1,1)+"\n";

    }
    function getModel2Str(){
        return getSIZE(70,15)+"\n"
               + getGAP(2,0)+"\n"
               + getSPEED(4)+"\n"
               + getDENSITY(8)+"\n"
               + getDIRECTION(1)+"\n"
               + getCLS()+"\n"
               + getTEXT(20,30,3,0,1,1,$scope.data.chipType)+"\n"
               + getQRCODE(100,15,"H",4,"A",0,$scope.data.chipId)+"\n"
               + getPRINT(1,1)+"\n";

    }
    function getModel3Str(){
        return getSIZE(70,15)+"\n"
               + getGAP(2,0)+"\n"
               + getSPEED(4)+"\n"
               + getDENSITY(8)+"\n"
               + getDIRECTION(1)+"\n"
               + getCLS()+"\n"
               + getQRCODE(100,15,"H",4,"A",0,$scope.data.chipId)+"\n"
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
                    // alert("success");
                    window.localStorage.setItem("gprinter_add", angular.toJson(address));
                     
                }, function (error) {
                    // $timeout(function(){
                    //     $ionicLoading.hide();
                    // });     
                });
            }
        }
    }

    //关闭打印机连接
    function closeGPrintConnect() {
        if (window.cordova && cordova.plugins.BluetoothPrint) {
            cordova.plugins.BluetoothPrint.closeConnect();
        }
    }

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
                $scope.data.pairedDevices = [];
                var dataArray = data.split(",");
                for (var i = 0; i < dataArray.length - 1; i++) {
                    var str = dataArray[i];
                    var name = str.substring(0, str.indexOf("&"));
                    var address = str.substring(str.indexOf("&") + 1);
                    $scope.data.pairedDevices.push({
                        name: name,
                        address: address
                    });
                }

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
