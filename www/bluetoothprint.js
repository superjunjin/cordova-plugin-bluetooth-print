var exec = require('cordova/exec');
//连接打印机
exports.connectDevice = function (address,success, error) {
	// alert(address);
	exec(success, error, "BluetoothPrint", "connectDevice", [address]);
};
//获取已配对的蓝牙设备
exports.getPairedDevices = function (success, error) {
	exec(success, error, "BluetoothPrint", "getPairedDevices", []);
};
//关闭连接
exports.closeConnect = function () {
	exec(null, null, "BluetoothPrint", "closeConnect", []);
};
//打印
//1型号,2图纸版本,3班别,4代号,5芯片ID,6日期,7尺寸
exports.printText = function (stringData,success, error) {
	
	exec(success, error, "BluetoothPrint", "printText", [stringData]);
};
// //打印方法2（侨兴）（直接打开蓝牙地址连接，然后打印）
// exports.printText2 = function (address,model,remarks,chipId,dateTime,specification,success, error) {
// 	exec(success, error, "BluetoothPrint", "printText2", [address,model,remarks,chipId,dateTime,specification]);
// };
