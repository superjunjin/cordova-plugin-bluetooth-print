# cordova-plugin-bluetooth-print
蓝牙打印插件

## 安装插件
clone代码到本地后，把demo文件夹删除，就是插件了。
安装命令 cordova plugin add cordova-plugin-bluetooth-print

## demo使用
ionic项目，
* 首先运行bower install，安装ionic，jquery等的库文件
* 然后运行cordova platform add android，添加安卓环境和插件
* cordova build android，打包apk

## 参考项目
http://blog.csdn.net/reality_jie_blog/article/details/11895843
基本思想就是通过蓝牙地址建立socket连接，然后通过流发送打印指令的字符串给打印机

## 打印指令
条码机编程手册
http://download.csdn.net/detail/superjunjin/9743834

## 准备
首先打开蓝牙，和要连接的打印机匹配成功

## 常用方法 
* 获取配对蓝牙列表

cordova.plugins.BluetoothPrint.getPairedDevices(function (data) {}, function (error) {});

参数1：成功回调函数，返回配对蓝牙列表数据

参数2：失败回调函数

* 连接打印机

cordova.plugins.BluetoothPrint.connectDevice(address,function (data) {}, function (error) {});

参数1：传入要连接的打印机的蓝牙地址

参数2：成功回调函数

参数3：失败回调函数

* 打印

cordova.plugins.BluetoothPrint.printText(str,function (data) {}, function (error) {});

参数1：传入要打印的字符串命令

参数2：成功回调函数

参数3：失败回调函数

* 关闭连接

cordova.plugins.BluetoothPrint.closeConnect(function (data) {}, function (error) {});

参数1：成功回调函数

参数2：失败回调函数

## 常用打印机命令
* SIZE(定义标签纸宽高)(必须设置)

eg: SIZE 70 mm, 15 mm（宽70mm，高15mm）

* GAP(两标签之间间隙)(必须设置)

语法：GAP m mm, n mm

m：间隙高度
n：间隙高度的补偿值

eg: GAP 2 mm, 0 mm (两标签间距2mm)

* SPEED(设定打印机的打印速度)

eg: SPEED 4 

* DENSITY(设定打印机的打印浓度)

eg: DENSITY 8

* DIRECTION(设定打印方向)

eg: DIRECTION 1

* CLS(清除数据缓存)(必须设置)

eg: CLS (注意事项：此项指令必须置于 SIZE 指令之后)

* TEXT(打印文字)

语法：TEXT X, Y, ”font”, rotation, x-multiplication, y-multiplication, “content”

X：文字方塊左上角 X 座标

Y: 文字方塊左上角 Y 座标

font：字型名称

rotation：顺时针旋转角度

X-multiplication：水平放大值（1-10）

Y-multiplication：垂直放大值（1-10）

content：文字内容字符串

eg: TEXT 100,100,”3”,0,1,1,”EXAMPLE PROGRAM”

* QRCODE(打印一维码)

语法：BARCODE X, Y, ”code type”, height, human readable, rotation, narrow, wide, “code”

X：条码左上角 X 座标

Y：条码左上角 Y 座标

code type：条码类型

height：条码高度

human readable：0 : 无人眼可识别码/1 : 有人眼可识别码

rotation：顺时针旋转条码角度

narrow：窄条码比例因子 (dot)

wide：宽条码比例因子 (dot)

code：条码内容

eg：BARCODE 100,100,”128”,96,1,0,2,4,”1000”

* QRCODE(打印二维码)

语法：QRCODE X, Y, ECC Level, cell width, mode, rotation, "Data string”

X：QRCODE 条码左上角 X 座标

Y：QRCODE 条码左上角 Y 座标

ECC level：错误纠正能力等级

cell width：1-10

mode：A/M(自动或手动生成编码)

rotation：顺时针旋转角度

Data string：条码内容字符串

eg：QRCODE 10,10,H,4,A,0,"ABCabc123"

* PRINT(打印张数)(必须设置)

语法： PRINT m,n

m：打印张数

n：每张标签需重复打印的张数

eg：PRINT 1,1 （打印一张）



## 注意

* SIZE，GAP，CLS，PRINT命令是必须设置的

* 在拼接打印命令字符串时，每个命令结束都要加换行符，最后一行也要加

* PRINT命令必须设置在打印命令字符串最后

* 打印内容命令（TEXT等命令）必须置于打印准备命令之后（SIZE等命令）

* 关于联打多条标签的列子，参照模板1

* 文字，一维码，二维码的坐标单位为dot

200 DPI: 1 mm = 8 dots
300 DPI: 1 mm = 12 dots
DPI是指每英寸可打印的点数
