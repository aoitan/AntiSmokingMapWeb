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

function makeImageMarker(file)
{
  // 画像のURL
  var url = window.URL.createObjectURL(file);

  // 画像サイズ取得
  var reader = new FileReader();
  reader.addEventListener('load', function(e) {
    var img = new Image();
    img.addEventListener('load', function (inE) {
      var imgObj = inE.target;

      // マーカー画像
      var icon = makeIcon(imgObj, url);

      // 位置情報
      var pos = map.getCenter();

      // マーカーを作る
      makeMarker(pos, icon, url);
    }, false);
    img.src = e.target.result;
  }, false);
  reader.readAsDataURL(file);
}

function makeIcon(imgObj, url) {
  // 高さが32になるように拡縮倍率を計算
  var height = imgObj.naturalHeight;
  var width = imgObj.naturalWidth;
  var scale = 32 / height, url;

  // 倍率をかけた幅
  var scaledWidth = width * scale;

  // マーカー画像
  var icon = new google.maps.MarkerImage(url,
               new google.maps.Size(width, height),
               new google.maps.Point(0, 0),
               new google.maps.Point(0, 0),
               new google.maps.Size(scaledWidth, 32));
  return icon;
}

function makeMarker(pos, icon, image) {
  // マーカーを作る
  var marker = new google.maps.Marker({
    position: pos,
    map: map,
    icon: icon
  });

  // マーカーがクリックされたときに表示するinfoウィンドウを作る
  var infoWindow = new google.maps.InfoWindow({
    maxWidth: 320
  });

  // マーカーがクリックされたイベントハンドラ
  google.maps.event.addListener(marker, 'click', function() {
    // infoウィンドウで表示する内容のHTML
    var html = "";
    if (image) {
      html = '<a href="' + image + '"><img src="' + image + '"></a><br />';
    }
    html += '緯度：' + pos.lat() + '<br />経度：' + pos.lng();
    console.log(html);
    viewSummary(html);
  });
}

function viewMap() {
  var mapCanvas = document.getElementById('map-canvas');
  mapCanvas.style.height = '100%';

  var pinSummary = document.getElementById('pin-summary');
  pinSummary.style.display = 'none';

  var pinDetail = document.getElementById('pin-detail');
  pinDetail.style.display = 'none';
}

function viewSummary(html) {
  var mapCanvas = document.getElementById('map-canvas');
  mapCanvas.style.height = '80%';
  mapCanvas.addEventListener('click', (evt) => {
    viewMap();
  });

  var pinSummary = document.getElementById('pin-summary');
  pinSummary.style.height = '20%';
  pinSummary.style.display = 'block';
  pinSummary.addEventListener('click', (evt) => {
    viewDetail();
  });
  pinSummary.innerHTML = 'ここに概要が出る';

  var pinDetail = document.getElementById('pin-detail');
  pinDetail.style.display = 'none';
}

function viewDetail(html) {
  var mapCanvas = document.getElementById('map-canvas');
  mapCanvas.style.height = '20%';
  mapCanvas.addEventListener('click', (evt) => {
    viewSummary();
  });

  var pinSummary = document.getElementById('pin-summary');
  pinSummary.style.height = '20%';
  pinSummary.style.display = 'block';
  pinSummary.addEventListener('click', (evt) => {
    viewSummary();
  });
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
    makeMarker(pos);
  },
  'latlng': function (params) {
    //console.log('latlng: ' + JSON.stringify(params));
    var pos = new google.maps.LatLng(params.lat, params.lng);
    makeMarker(pos);
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


