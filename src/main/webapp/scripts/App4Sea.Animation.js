/* ==========================================================================
 * (c) 2018 Þorsteinn Helgi Steinarsson     thorsteinn(at)asverk.is
 *
 * ==========================================================================*/

var App4Sea = App4Sea || {};
var App4SeaAnimation = (function () {
    "use strict";
    var my = {};

    ////////////////////////////////////////////////////////////////////////////
    // Animate
    my.Animate = function (url, name) {
        if (state !== "Stopped")
            Stop();
        state = "Stopped";

        var ext = url.substr(url.length - 3, 3);
        if (ext !== 'kml' && ext !== 'kmz') {
            return;
        }

        count = my.AniData[golLink].length;
        document.getElementById('title').innerText = name;
    };

    function initInfo() {
        var el = document.getElementById('start');
        el.innerHTML = startDate.substr(startDate.length - 8, 8);
        el = document.getElementById('current');
        el.innerHTML = currentDate.substr(currentDate.length - 8, 8);
        el = document.getElementById('end');
        el.innerHTML = endDate.substr(endDate.length - 8, 8);

        el = document.getElementById('startDate');
        el.innerHTML = startDate.substr(0, 10);
        el = document.getElementById('currentDate');
        el.innerHTML = currentDate.substr(0, 10);
        el = document.getElementById('endDate');
        el.innerHTML = endDate.substr(0, 10);
    }

    function updateInfo() {
        // Updage time stamps
        var el = document.getElementById('current');
        if (el === 'undefined')
            return;

        el.innerHTML = currentDate.substr(currentDate.length - 8, 8);

        el = document.getElementById('currentDate');
        el.innerHTML =  currentDate.substr(0, 10);                        
        var layerid = my.AniData[golLayerID][anindex];
        var lind = findLayerIndex(layerid);
        var remember = 1;

        //if (App4Sea.logging) console.log(my.AniData[golLink][anindex]);           
        //if (App4Sea.logging) console.log(layerid);

        // Check if layer is active (layer is assumed to exist)
        App4Sea.TreeMenu.Checkbox(layerid, true);

        // Find last index that should be active
        var lastanindex = anindex - remember;
        while (lastanindex < 0)
            lastanindex = lastanindex + count;

        // Make last inactive
        layerid = my.AniData[golLayerID][lastanindex];
        App4Sea.TreeMenu.Checkbox(layerid, false);

        // Update progress
        progress.value = anindex * 100 / count;

        // Next id
        anindex = anindex + 1;
        if (anindex === count)
            anindex = 0;
    }

    function findLayerIndex(lind){
        for (var ynd=0; ynd<App4Sea.OpenLayers.layers.length; ynd++){
            var item = App4Sea.OpenLayers.layers[ynd];
            if (item.id === lind) {
                return ynd;
            }
        }

        return -1;
    }

    function timeElapsed() {
        if (state !== "Playing") {
            Stop();
            state = "Stopped";
            return;
        }

        if (timerId === null || my.AniData[golLink] === null) {
            Stop();
            state = "Stopped";
            return;
        }

        if (my.AniData[golWhen].length !== 0) {
            currentDate = my.AniData[golWhen][anindex].innerHTML;
        }
        else {
            currentDate = my.AniData[golBegin][anindex].innerHTML;
        }

        updateInfo();
    }

    // Statuses Events++
    // ------------------------------------------------------------
    // Stopped  Play, New Data, Error, Refresh, +++ (Possibly Play)
    // Playing  Stop, New Data, Error, Refresh, +++ (Possibly Stop)
    my.PlayStop = function () {
        // We ignore this event if status in not either Playing or Stopped
        if (state !== "Stopped" && state !== "Playing")
            return;

        state = "Transition";
        // Establish formal status (as indicated by icon in use)
        var btnImg = document.getElementById('playStopImg');
        var iconPath = btnImg.src;
        var icon = iconPath.substr(iconPath.length - 8, 8);

        if (icon === "play.png") { // Are stopped shall play
            // Make sure all is stopped before we begin
            Stop();
            // Do not set state to Stopped. We are in stopping state: 
            // Now timer is stopping and icon is ready to play. timerId is null. 

            // Prepare data while we are in a safe state
            Prepare();
            btnImg.src = "icons\\stop.png";

            // StartTimer
            timerId = window.setInterval(timeElapsed, 1000 / frameRate);
            state = "Playing";
        } 
        else { // Are playing, shall stop
            Stop();
            state = "Stopped";
        }
    };

    var Prepare = function () {
        if (count !== 0) {
            // Turn off all the layer images
            for (var aind=0; aind<count; aind++) {
                App4Sea.TreeMenu.Checkbox(my.AniData[golLayerID][aind], false);
            }

            if (my.AniData[golWhen].length !== 0) {
                startDate = my.AniData[golWhen][0].innerHTML;
                endDate = my.AniData[golWhen][my.AniData[1].length-1].innerHTML;
            }
            else {
                startDate = my.AniData[golBegin][0].innerHTML;
                endDate = my.AniData[golEnd][my.AniData[golEnd].length-1].innerHTML;
            }
            currentDate = startDate;

            initInfo();
        }
    };

    var Stop = function () {            
        state = "Stopping";

        // StopTimer
        if (timerId !== null) {
            window.clearInterval(timerId);
            timerId = null;
        }

        var btnImg = document.getElementById('playStopImg');
        btnImg.src = "icons\\play.png";
    };

    my.Progress = function () {
        if (count === undefined)
            return;
        anindex = parseInt( 0.5 + progress.value * count /100 ); 
        Stop();
        Prepare();            
        updateInfo(); 
    };
    
    //////////////////////////////////////////////////////////////////////////
    // Members
    my.AniData = [[],[],[],[],[]];//[gol, golw, golb, gole, goll]   

    const golLink = 0;// Ground Overlay Link (index into AniData)
    const golWhen = 1;// when
    const golBegin = 2;// begin
    const golEnd= 3;// end
    const golLayerID = 4;// LayerID

    let state = "Stopped";
    let count;
    let endDate;
    let startDate;
    let currentDate;
    let frameRate = 1; // frames per second
    let timerId = null;
    let anindex = 0;
    
    const progress = document.getElementById('progress');
    progress.addEventListener('input', my.Progress, false, {passive: true} );
    progress.addEventListener('touch', my.Progress, false, {passive: true} );

    return my;
}(App4SeaAnimation || {}));