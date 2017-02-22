
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


    @Override
    public void onDestroy() {
        super.onDestroy();
         
    }
}