
package cn.sj.cordova.bluetoothprint;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import java.util.Iterator;
import java.util.Vector;
import java.util.ArrayList;
import java.util.logging.Logger;
import java.util.Set;
import java.util.UUID;
import java.io.IOException;
import java.io.OutputStream;


import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;
import android.util.Base64;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.widget.Toast;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
// import android.content.ServiceConnection;
// import android.content.ComponentName;
// import android.content.Context;
// import android.content.Intent;
// import android.os.Bundle;
// import android.os.IBinder;
import android.content.*;
// import android.content.ContextWrapper;
import android.os.*;
// import android.os.RemoteException;
import android.app.Activity;
import android.view.*;
// import android.view.ContextThemeWrapper;





public class BluetoothPrintPlugin extends CordovaPlugin {

    private BluetoothAdapter mBluetoothAdapter;
    // private PrinterServiceConnection conn = null;
    // private GpService mGpService = null;
    private Activity activity;
    private String boothAddress = "" ;
    private String oneModel,drawingRev,oneClass,oneCode,chipId,dateTime,specification = "";
    
    private boolean isConnection = false;//蓝牙是否连接
    private BluetoothDevice device = null;
    private static BluetoothSocket bluetoothSocket = null;
    private static OutputStream outputStream = null;
    private static final UUID uuid = UUID
            .fromString("00001101-0000-1000-8000-00805F9B34FB");
    
    

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        
        activity = cordova.getActivity();
        
    }


     
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        //获取已配对的蓝牙设备
        if (action.equals("getPairedDevices")) {
            getPairedDevices();
            return true;
        }
        //连接选中的蓝牙设备(打印机)
        if (action.equals("connectDevice")){
            connectDevice(args, callbackContext);
            return true;
        }
        //打印
        if (action.equals("printText")){
            printText(args, callbackContext);
            return true;
        }
        
        return false;
    }



    private void connectDevice(final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String address = args.getString(0);
        // Get the local Bluetooth adapter
        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        device = mBluetoothAdapter.getRemoteDevice(address);
        if (!isConnection) {
            try {
                bluetoothSocket = device
                        .createRfcommSocketToServiceRecord(uuid);
                bluetoothSocket.connect();
                outputStream = bluetoothSocket.getOutputStream();
                isConnection = true;
                
            } catch (Exception e) {
                isConnection = false;
                Toast.makeText(activity.getApplicationContext(), "连接失败！", 1).show();
                
            }
            Toast.makeText(activity.getApplicationContext(), device.getName() + "连接成功！",
                    Toast.LENGTH_SHORT).show();
            
        } 

        String jsEvent = String.format(
                "cordova.fireDocumentEvent('bluetoothprint.StatusReceived',{'bluetoothPrintStatus':'%s'})",
                isConnection);
        webView.sendJavascript(jsEvent);  
      
        
    }

    private void getPairedDevices(){

        // Get the local Bluetooth adapter
        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        // Get a set of currently paired devices
        Set<BluetoothDevice> pairedDevices = mBluetoothAdapter.getBondedDevices();
        // If there are paired devices, add each one to the ArrayAdapter
        if (pairedDevices.size() > 0) {
            String str = "";
            for (BluetoothDevice device : pairedDevices) {
                
                str+= device.getName() + "&"+ device.getAddress() +",";
                
                
            }
            String jsEvent = String.format(
                "cordova.fireDocumentEvent('bluetoothprint.DataReceived',{'bluetoothPrintData':'%s'})",
                str);
            webView.sendJavascript(jsEvent);                     
        }

    }



    private void printText(final JSONArray args, final CallbackContext callbackContext) throws JSONException{
        //1型号,2图纸版本,3班别,4代号,5芯片ID,6日期,7尺寸
        
        String sendData = args.getString(0);
        
        if (isConnection) {
            System.out.println("开始打印！！");
            try {
                byte[] data = sendData.getBytes("gbk");
                outputStream.write(data, 0, data.length);
                outputStream.flush();
                callbackContext.success();
            } catch (IOException e) {
                callbackContext.error("发送失败！");
                Toast.makeText(activity.getApplicationContext(), "发送失败！", Toast.LENGTH_SHORT)
                        .show();
            }
        } else {
            callbackContext.error("设备未连接，请重新连接！");
            Toast.makeText(activity.getApplicationContext(), "设备未连接，请重新连接！", Toast.LENGTH_SHORT)
                    .show();

        }
    }

    // private void setPrintData(String oneModel,String drawingRev,String oneClass,String oneCode,String chipId,String dateTime,String specification){

    //     TscCommand tsc = new TscCommand(); 
    //     tsc.addSize(70, 15); //设置标签尺寸，按照实际尺寸设置 
    //     tsc.addGap(2); //设置标签间隙，按照实际尺寸设置，如果为无间隙纸则设置为0
    //     tsc.addDirection(DIRECTION.BACKWARD,MIRROR.NORMAL);//设置打印方向 
    //     tsc.addReference(0, 0);//设置原点坐标 
    //     tsc.addTear(ENABLE.ON); //撕纸模式开启 
    //     tsc.addCls();// 清除打印缓冲区 
        
    //     //绘制简体中文 
    //     tsc.addText(10,30,FONTTYPE.SIMPLIFIED_CHINESE,ROTATION.ROTATION_0,FONTMUL.MUL_1,FONTMUL.MUL_1,oneModel);
    //     tsc.addText(95,30,FONTTYPE.SIMPLIFIED_CHINESE,ROTATION.ROTATION_0,FONTMUL.MUL_1,FONTMUL.MUL_1,drawingRev);
    //     tsc.addText(10,80,FONTTYPE.SIMPLIFIED_CHINESE,ROTATION.ROTATION_0,FONTMUL.MUL_1,FONTMUL.MUL_1,oneClass);
    //     tsc.addText(35,80,FONTTYPE.SIMPLIFIED_CHINESE,ROTATION.ROTATION_0,FONTMUL.MUL_1,FONTMUL.MUL_1,dateTime);
    //     tsc.addText(150,40,FONTTYPE.SIMPLIFIED_CHINESE,ROTATION.ROTATION_0,FONTMUL.MUL_2,FONTMUL.MUL_2,oneCode);
    //     tsc.addText(200,40,FONTTYPE.SIMPLIFIED_CHINESE,ROTATION.ROTATION_0,FONTMUL.MUL_2,FONTMUL.MUL_2,specification);
    //     //绘制二维码
    //     tsc.addQRCode(250, 10, EEC.LEVEL_L,5,ROTATION.ROTATION_0, chipId);
    //     tsc.addText(370,30,FONTTYPE.SIMPLIFIED_CHINESE,ROTATION.ROTATION_0,FONTMUL.MUL_1,FONTMUL.MUL_1,chipId);
    //     tsc.addText(370,80,FONTTYPE.SIMPLIFIED_CHINESE,ROTATION.ROTATION_0,FONTMUL.MUL_1,FONTMUL.MUL_1,chipId);
        
    //     tsc.addPrint(1,1); // 打印标签 
    //     tsc.addSound(2, 100); //打印标签后 蜂鸣器响 
    //     Vector<Byte> datas = tsc.getCommand(); //发送数据 
    //     Byte[] Bytes = datas.toArray(new Byte[datas.size()]); 
    //     byte[] bytes = ArrayUtils.toPrimitive(Bytes); 
    //     String str = Base64.encodeToString(bytes, Base64.DEFAULT); 
    //     int rel; 
    //     try { 
    //         rel = mGpService.sendTscCommand(0, str); 
    //         // GpCom.ERROR_CODE r=GpCom.ERROR_CODE.values()[rel]; 
    //         // if(r != GpCom.ERROR_CODE.SUCCESS){ 
    //         //    Toast.makeText(getApplicationContext(),GpCom.getErrorText(r), Toast.LENGTH_SHORT).show(); 
    //         // } 
    //     } 
    //     catch (RemoteException e) { // TODO Auto-generated catch block
    //         e.printStackTrace();
    //     }


    // }

    // private void setPrintData2(String boothAddress,String oneModel,String drawingRev,String oneClass,String oneCode,String chipId,String dateTime,String specification){

    //     TSCActivity TscDll = new TSCActivity();
    //     TscDll.openport(boothAddress);

    //     TscDll.setup(70, 15, 4, 4, 0, 2, 0);
    //     TscDll.clearbuffer();
    //     TscDll.printerfont(10, 30, "3", 0, 1, 1, oneModel);
    //     TscDll.printerfont(95, 30, "3", 0, 1, 1, drawingRev);
    //     TscDll.printerfont(10, 80, "3", 0, 1, 1, oneClass);
    //     TscDll.printerfont(35, 80, "3", 0, 1, 1, dateTime);
    //     TscDll.printerfont(150,40, "3", 0, 2, 2, oneCode);
    //     TscDll.printerfont(200,40, "3", 0, 2, 2, specification);
    //     TscDll.barcode(250, 10, "128", 100, 1, 0, 3, 3, chipId);
    //     TscDll.printerfont(370, 30, "3", 0, 2, 2, specification);
    //     TscDll.printerfont(370, 80, "3", 0, 2, 2, specification);
        
    //     String status = TscDll.status();
        
    //     // TscDll.printlabel(2, 1);
        
    //     TscDll.closeport();
    // }

    

    @Override
    public void onDestroy() {
        super.onDestroy();
         
    }
}