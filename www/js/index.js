var LED_SERVICE = 'FF10';
var GSWITCH_CHARACTERISTIC = 'FF21';
var GBRIGHTNESS_CHARACTERISTIC = 'FF22';

var YSWITCH_CHARACTERISTIC = 'FF11';
var YBRIGHTNESS_CHARACTERISTIC = 'FF12';


var app = {
    initialize: function() {
        this.bindEvents();
        this.showMainPage();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('backbutton', this.onBackButton, false);
        deviceList.addEventListener('click', this.connect, false);
        refreshButton.addEventListener('click', this.refreshDeviceList, false);
        onButton.addEventListener('click', this.switchOn, false);
        offButton.addEventListener('click', this.switchOff, false);
        onButton2.addEventListener('click', this.switchOngreen, false);
        offButton2.addEventListener('click', this.switchOffgreen, false);
        ybrightness.addEventListener('change', this.ysetBrightness, false);
        gbrightness.addEventListener('change', this.gsetBrightness, false);
        disconnectButton.addEventListener('click', this.disconnect, false);
    },
    onDeviceReady: function() {
        FastClick.attach(document.body); // https://github.com/ftlabs/fastclick
        app.refreshDeviceList();
    },
    refreshDeviceList: function() {
        deviceList.innerHTML = ''; // empty the list
        ble.scan([LED_SERVICE], 5, app.onDiscoverDevice, app.onError);
    },
    onDiscoverDevice: function(device) {
        var listItem = document.createElement('li');
        listItem.innerHTML = device.name + '<br/>' +
            device.id + '<br/>' +
            'RSSI: ' + device.rssi;
        listItem.dataset.deviceId = device.id;
        deviceList.appendChild(listItem);
    },
    connect: function(e) {
        var deviceId = e.target.dataset.deviceId;
        ble.connect(deviceId, app.onConnect, app.onError);
    },
    onConnect: function(peripheral) {
        app.peripheral = peripheral;
        app.showDetailPage();
    },
    disconnect: function(e) {
        if (app.peripheral && app.peripheral.id) {
            ble.disconnect(app.peripheral.id, app.showMainPage, app.onError);
        }
    },
    switchOn: function() {
        app.setSwitchValue(1);
    },
    switchOff: function() {
        app.setSwitchValue(0);
    },
      switchOngreen: function() {
        app.setSwitchValuegreen(1);
    },
    switchOffgreen: function() {
        app.setSwitchValuegreen(0);
    },
    
    
    setSwitchValue: function(value) {
        var success = function() {
            console.log('Set switch value to ' + value);
        };

        if (app.peripheral && app.peripheral.id) {
            var data = new Uint8Array(1);
            data[0] = value;
            ble.write(
                app.peripheral.id,
                LED_SERVICE,
                YSWITCH_CHARACTERISTIC,
                data.buffer,
                success,
                app.onError
            );
        }
    },
        setSwitchValuegreen: function(value) {
        var success = function() {
            console.log('Set switch value to ' + value);
        };

        if (app.peripheral && app.peripheral.id) {
            var data = new Uint8Array(1);
            data[0] = value;
            ble.write(
                app.peripheral.id,
                LED_SERVICE,
                GSWITCH_CHARACTERISTIC,
                data.buffer,
                success,
                app.onError
            );
        }
    },
    ysetBrightness: function() {

        var data = new Uint8Array(1);
        data[0] = ybrightness.value;

        var success = function() {
            console.log('Set brightness to ' + data[0]);
        };

        if (app.peripheral && app.peripheral.id) {
            ble.write(
                app.peripheral.id,
                LED_SERVICE,
                YBRIGHTNESS_CHARACTERISTIC,
                data.buffer,
                success,
                app.onError
            );
        }
    },

     gsetBrightness: function() {

        var data = new Uint8Array(1);
        data[0] = gbrightness.value;

        var success = function() {
            console.log('Set brightness to ' + data[0]);
        };

        if (app.peripheral && app.peripheral.id) {
            ble.write(
                app.peripheral.id,
                LED_SERVICE,
                GBRIGHTNESS_CHARACTERISTIC,
                data.buffer,
                success,
                app.onError
            );
        }
    },
    showMainPage: function() {
        mainPage.hidden = false;
        detailPage.hidden = true;
    },
    showDetailPage: function() {
        mainPage.hidden = true;
        detailPage.hidden = false;
    },
    onBackButton: function() {
        if (mainPage.hidden) {
            app.disconnect();
        } else {
            navigator.app.exitApp();
        }
    },
    onError: function(reason) {
        navigator.notification.alert(reason, app.showMainPage, 'Error');
    }
};

app.initialize();
