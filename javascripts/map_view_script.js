window.addEventListener('DOMContentLoaded', function () {
  map_view_loading();
});

var map;
function map_view_loading() {
  mapView(35.6853264, 139.7530997);
}

function mapView(latitude, longitude) {
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(latitude, longitude),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
}

function setCenterPosition(lat, lng) {
  var pos = new google.maps.LatLng(lat, lng);
  map.setCenter(pos);
}

function makeMarker(id, pos, type) {
  // マーカーを作る
  var ICON = [
      'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    ];
  var icon = ICON[type % 4];
  var marker = new google.maps.Marker({
    //icon: icon,
    position: pos
  });

  // マーカーがクリックされたイベントハンドラ
  google.maps.event.addListener(marker, 'click', function() {
    var now = new Date().getTime();
    if (now - touchTime > 300) {
      viewSummary();
      touchTime = now;
      console.log('1 touchTime: ' + touchTime);
    }
  });
}

var touchTime = 0;

function viewMap() {
  var mapCanvas = document.getElementById('map-canvas');
  mapCanvas.style.height = '100%';
  mapCanvas.style.display = 'block';
  mapCanvas.removeEventListener('click', viewSummaryListenerMap);
  mapCanvas.removeEventListener('click', viewDetailListenerMap);

  var pinSummary = document.getElementById('pin-summary');
  pinSummary.style.height = '0%';
  pinSummary.style.display = 'none';
  pinSummary.removeEventListener('click', viewSummaryListenerSummary);
  pinSummary.removeEventListener('click', viewDetailListenerSummary);

  var pinDetail = document.getElementById('pin-detail');
  pinDetail.style.height = '0%';
  pinDetail.style.display = 'none';
  pinDetail.removeEventListener('click', viewDetailListenerDetail);
}

function viewSummaryListenerMap(evt) {
  var now = new Date().getTime();
  if (now - touchTime > 300) {
    viewMap();
    touchTime = now;
    console.log('2 touchTime: ' + touchTime);
  }
}

function viewSummaryListenerSummary(evt) {
  var now = new Date().getTime();
  if (now - touchTime > 300) {
    viewDetail();
    touchTime = now;
    console.log('3 touchTime: ' + touchTime);
  }
}


function viewSummary(html) {
  var mapCanvas = document.getElementById('map-canvas');
  mapCanvas.style.height = '80%';
  mapCanvas.style.display = 'block';
  mapCanvas.removeEventListener('click', viewDetailListenerMap);
  mapCanvas.addEventListener('click', viewSummaryListenerMap);

  var pinSummary = document.getElementById('pin-summary');
  pinSummary.style.height = '20%';
  pinSummary.style.display = 'block';
  pinSummary.removeEventListener('click', viewDetailListenerSummary);
  pinSummary.addEventListener('click', viewSummaryListenerSummary);
  pinSummary.innerHTML = 'ここに概要が出る';

  var pinDetail = document.getElementById('pin-detail');
  pinDetail.style.height = '0%';
  pinDetail.style.display = 'none';
  pinDetail.removeEventListener('click', viewDetailListenerDetail);
}

function viewDetailListenerMap(evt) {
  var now = new Date().getTime();
  if (now - touchTime > 300) {
    viewMap();
    touchTime = now;
    console.log('4 touchTime: ' + touchTime);
  }
}

function viewDetailListenerSummary(evt) {
  var now = new Date().getTime();
  if (now - touchTime > 300) {
    viewSummary();
    touchTime = now;
    console.log('5 touchTime: ' + touchTime);
  }
}

function viewDetailListenerDetail(evt) {
}

function viewDetail(html) {
  var mapCanvas = document.getElementById('map-canvas');
  mapCanvas.style.height = '20%';
  mapCanvas.style.display = 'block';
  mapCanvas.removeEventListener('click', viewSummaryListenerSummary);
  mapCanvas.addEventListener('click', viewDetailListenerMap);

  var pinSummary = document.getElementById('pin-summary');
  pinSummary.style.height = '20%';
  pinSummary.style.display = 'block';
  pinSummary.removeEventListener('click', viewSummaryListenerSummary);
  pinSummary.addEventListener('click', viewDetailListenerSummary);
  pinSummary.innerHTML = 'ここに概要が出る';

  var pinDetail = document.getElementById('pin-detail');
  pinDetail.style.height = '60%';
  pinDetail.style.display = 'block';
  pinDetail.innerHTML = 'ここに詳細が出る';
}

var dispatcher = {
  'current': function (params) {
    //console.log('current: ' + JSON.stringify(params));
    setCenterPosition(params.coords.latitude, params.coords.longitude);
  },
  'marker': function (params) {
    //console.log('marker: ' + JSON.stringify(params));
    var pos = new google.maps.LatLng(params.coords.latitude, params.coords.longitude);
    makeMarker(params.id, pos, params.type);
  },
  'latlng': function (params) {
    console.log('latlng: ' + JSON.stringify(params));
    var pos = new google.maps.LatLng(params.lat, params.lng);
    makeMarker(params.id, pos, params.type);
  }
};

window.addEventListener('message', (event) => {
  var cmd = event.data.split(':')[0];
  var idx = event.data.indexOf(':') + 1;
  var paramStr = event.data.slice(idx);
  var params = JSON.parse(paramStr);
  //console.log('cmd="' + cmd + '", params="' + JSON.stringify(params) + '"');
  dispatcher[cmd](params);
});


