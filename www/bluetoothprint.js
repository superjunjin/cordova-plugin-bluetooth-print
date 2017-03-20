var exec = require('cordova/exec');
//连接打印机
exports.connectDevice = function (address,success, error) {
	exec(success, error, "BluetoothPrint", "connectDevice", [address]);
};
//获取已配对的蓝牙设备
exports.getPairedDevices = function (success, error) {
	exec(success, error, "BluetoothPrint", "getPairedDevices", []);
};
//关闭连接
exports.closeConnect = function (success, error) {
	exec(success, error, "BluetoothPrint", "closeConnect", []);
};
//打印
exports.printText = function (stringData,success, error) {
	
	exec(success, error, "BluetoothPrint", "printText", [stringData]);
};

