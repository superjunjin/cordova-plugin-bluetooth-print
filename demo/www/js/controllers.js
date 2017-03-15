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

    // document.addEventListener('bluetoothprint.DataReceived', function (e) {
    //     $rootScope.$broadcast('bluetoothprint.DataReceived', e.bluetoothPrintData);
    // }, false);
    // document.addEventListener('bluetoothprint.StatusReceived', function (e) {
    //     $rootScope.$broadcast('bluetoothprint.StatusReceived', e.bluetoothPrintStatus);
    // }, false);

    document.addEventListener("deviceready", function () {

        // $scope.$on('bluetoothprint.DataReceived', function (e, data) {

        //     $scope.data.pairedDevices = [];
        //     var dataArray = data.split(",");
        //     for (var i = 0; i < dataArray.length - 1; i++) {
        //         var str = dataArray[i];
        //         var name = str.substring(0, str.indexOf("&"));
        //         var address = str.substring(str.indexOf("&") + 1);
        //         $scope.data.pairedDevices.push({
        //             name: name,
        //             address: address
        //         });
        //     }

        //     $scope.settingModal.show();

        // });

        // $scope.$on('bluetoothprint.StatusReceived', function (e, data) {
        //     //连接成功，存入选中的
        //     if (data === "true") {
        //         if ($scope.data.selectDevice != null && $scope.data.selectDevice !== "") {
        //             window.localStorage.setItem("gprinter", angular.toJson($scope.data.selectDevice));
        //         }  
        //     }
        //     $ionicLoading.hide();
        // });

        //如果有打印机地址，连接打印机
        var gprinter_address = angular.fromJson(window.localStorage.getItem("gprinter")) + "";   
        if (gprinter_address != null && gprinter_address !== "") {
            connectGPrint(gprinter_address);
        }

    }, false);
  
    //打印方法
    function printTag(){
        getPrintString().then(function(str){
            cordova.plugins.BluetoothPrint.printText(str, function (success) {
                
            }, function (error) {
                
            });
        });
            
    }
    //获取打印命令字符串
    function getPrintString(){
        var deferred = $q.defer();
        var printString = '';
        var jsondata = '';
        if($scope.data.selectModel === "model1"){
            jsondata="model/model1.json"; 
            $.getJSON(jsondata, function(data){ 
                printString = data.SIZE+"\n"
                      +data.GAP+"\n"
                      +data.SPEED+"\n"
                      +data.DENSITY+"\n"
                      +data.DIRECTION+"\n"
                      +data.CLS+"\n"
                      +data.TEXT1+"\""+$scope.data.chipType+"\""+"\n"
                      +data.TEXT2+"\""+$scope.data.chipId+"\""+"\n"
                      +data.TEXT3+"\""+$scope.data.chipType+"\""+"\n"
                      +data.TEXT4+"\""+$scope.data.chipType+"\""+"\n"
                      +data.TEXT5+"\""+$scope.data.chipId+"\""+"\n"
                      +data.TEXT6+"\""+$scope.data.chipId+"\""+"\n"
                      +data.QRCODE+"\""+$scope.data.chipId+"\""+"\n"
                      +data.TEXT7+"\""+$scope.data.chipId+"\""+"\n"
                      +data.TEXT8+"\""+$scope.data.chipId+"\""+"\n"
                      +data.PRINT+"\n";
                deferred.resolve(printString);     
            });   
        }
        else if($scope.data.selectModel === "model2"){
            jsondata="model/model2.json"; 
            $.getJSON(jsondata, function(data){ 
                printString = data.SIZE+"\n"
                      +data.GAP+"\n"
                      +data.SPEED+"\n"
                      +data.DENSITY+"\n"
                      +data.DIRECTION+"\n"
                      +data.CLS+"\n"
                      +data.TEXT1+"\""+$scope.data.chipType+"\""+"\n"
                      +data.QRCODE+"\""+$scope.data.chipId+"\""+"\n"
                      +data.PRINT+"\n";
                deferred.resolve(printString);
            });  
        }
        else if($scope.data.selectModel === "model3"){
            jsondata="model/model3.json"; 
            $.getJSON(jsondata, function(data){ 
                printString = data.SIZE+"\n"
                      +data.GAP+"\n"
                      +data.SPEED+"\n"
                      +data.DENSITY+"\n"
                      +data.DIRECTION+"\n"
                      +data.CLS+"\n"
                      +data.TEXT1+"\""+$scope.data.chipType+"\""+"\n"
                      
                      +data.PRINT+"\n";
                deferred.resolve(printString);     
            }); 
        }
        else{

        }
        return deferred.promise;
        
    }

    //连接打印机蓝牙(蓝牙地址)
    function connectGPrint(address) {
        // alert(address);
        if (address != null && address !== "" && address !== "null") {
            $ionicLoading.show({
                template: 'Loading...'
            });
            if (window.cordova && cordova.plugins.BluetoothPrint) {
                cordova.plugins.BluetoothPrint.connectDevice(address, function (success) {
                    //连接成功，存入选中的蓝牙地址
                    window.localStorage.setItem("gprinter_add", angular.toJson(address)); 
                    $ionicLoading.hide();
                }, function (error) {
                    $ionicLoading.hide();
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
            $ionicLoading.show({
                template: 'Loading...'
            });
            // alert("getPairedDevices");
            cordova.plugins.BluetoothPrint.getPairedDevices(function (data) {
                $ionicLoading.hide();
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
                $ionicLoading.hide();
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
