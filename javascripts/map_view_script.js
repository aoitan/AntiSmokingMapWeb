/* global google */
var touchTime = 0;

var source = null;

window.addEventListener('DOMContentLoaded', function () {
  map_view_loading();
});

var map;
function map_view_loading() {
  mapView(35.6853264, 139.7530997);
}

function mapView(latitude, longitude) {
  var mapOptions = {
    zoom: 16,
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

function makeMarker(id, pos, type, detail) {
  // マーカーを作る
  var ICON = [
      'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    ];
  var icon = ICON[type % 4];
  var marker = new google.maps.Marker({
    icon: icon,
    map: map,
    position: pos
  });

  // マーカーがクリックされたイベントハンドラ
  google.maps.event.addListener(marker, 'click', function() {
    var now = new Date().getTime();
    if (now - touchTime > 300) {
      // 概要表示と詳細表示を作る
      var star = "";
      if (0 <= detail.rating && detail.rating < 0.5) {
        star = 'images/star_0.0.gif';
      } else if (0.5 <= detail.rating && detail.rating < 1.0) {
        star = 'images/star_0.5.gif';
      } else if (1.0 <= detail.rating && detail.rating < 1.5) {
        star = 'images/star_1.0.gif';
      } else if (1.5 <= detail.rating && detail.rating < 2.0) {
        star = 'images/star_1.5.gif';
      } else if (2.0 <= detail.rating && detail.rating < 2.5) {
        star = 'images/star_2.0.gif';
      } else if (2.5 <= detail.rating && detail.rating < 3.0) {
        star = 'images/star_2.5.gif';
      } else if (3.0 <= detail.rating && detail.rating < 3.5) {
        star = 'images/star_3.0.gif';
      } else if (3.5 <= detail.rating && detail.rating < 4.0) {
        star = 'images/star_3.5.gif';
      } else if (1.0 <= detail.rating && detail.rating < 1.5) {
        star = 'images/star_4.0.gif';
      } else if (4.0 <= detail.rating && detail.rating < 4.5) {
        star = 'images/star_4.5.gif';
      } else if (4.5 <= detail.rating && detail.rating < 5.0) {
        star = 'images/star_5.0.gif';
      }
      var name = (detail.name)? detail.name: '名前はまだない';
      var summaryView = document.getElementById('pin-summary');
      summaryView.innerHTML = '<h1 class="title">' + name + '</h1>' +
                          '<img src="' + star + '">';
      var detailView = document.getElementById('pin-detail');

      var address = (detail.address)? detail.address: '<span style="text-decoration: line-through">住所不定</span>住所不明';
      var detailHtml = '<p class="address">' + address + '</p>';
      detail.comment.forEach((item) => {
        detailHtml = detailHtml + '<p class="comment">' + item[0] + '<span style="font-size: small">' + item[1] + '</span></p>';
      });
      detailView.innerHTML = detailHtml;

      viewSummary();
      touchTime = now;
      console.log('1 touchTime: ' + touchTime);
    }
  });
}

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

  var pinDetail = document.getElementById('pin-detail');
  pinDetail.style.height = '60%';
  pinDetail.style.display = 'block';
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
    //console.log('latlng: ' + JSON.stringify(params));
    var pos = new google.maps.LatLng(params.lat, params.lng);
    makeMarker(params.id, pos, params.type, params.detail);
  }
};

window.addEventListener('message', (event) => {
  source = event.source;
  var cmd = event.data.split(':')[0];
  var idx = event.data.indexOf(':') + 1;
  var paramStr = event.data.slice(idx);
  var params = JSON.parse(paramStr);
  //console.log('cmd="' + cmd + '", params="' + JSON.stringify(params) + '"');
  dispatcher[cmd](params);
});


