'use strict';

var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var HOUSING_TYPES = [
  'flat',
  'house',
  'bungalo'
];

var HOUSING_TYPES_MAP = {
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var CHECKIN_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

var CHECKOUT_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;


function getRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getOffersArr() {
  var offersArr = [];
  var locationX;
  var locationY;

  for (var i = 0; i < 8; i++) {
    locationX = getRandomInteger(300, 900);
    locationY = getRandomInteger(100, 500);

    offersArr[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: TITLES[i],
        address: locationX + ', ' + locationY,
        price: getRandomInteger(1000, 1000000),
        type: HOUSING_TYPES[getRandomInteger(0, HOUSING_TYPES.length - 1)],
        rooms: getRandomInteger(1, 5),
        guests: getRandomInteger(1, 100),
        checkin: CHECKIN_TIMES[getRandomInteger(0, CHECKIN_TIMES.length - 1)],
        checkout: CHECKOUT_TIMES[getRandomInteger(0, CHECKOUT_TIMES.length - 1)],
        features: FEATURES.slice(0, getRandomInteger(1, FEATURES.length)),
        description: '',
        photos: []
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
  }
  return offersArr;
}


function renderPinMap(offersArr) {
  var tokyoPinMap = document.querySelector('.tokyo__pin-map');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < offersArr.length; i++) {
    var div = document.createElement('div');
    div.classList.add('pin');
    div.style.left = offersArr[i].location.x + 'px';
    div.style.top = offersArr[i].location.y + 'px';
    var img = document.createElement('img');
    img.src = offersArr[i].author.avatar;
    img.classList.add('rounded');
    img.width = 40;
    img.height = 40;
    img.setAttribute('tabindex', '1');
    div.appendChild(img);

    fragment.appendChild(div);
  }
  tokyoPinMap.appendChild(fragment);
}


function replaceDialogPanel(newDialogPanel) {
  var offerDialog = document.querySelector('#offer-dialog');
  var oldDialogPanel = document.querySelector('.dialog__panel');

  offerDialog.replaceChild(newDialogPanel, oldDialogPanel);
}

function renderOfferDialog(offerObj) {
  var lodgeTemplate = document.querySelector('#lodge-template').content;
  var offerElement = lodgeTemplate.cloneNode(true);

  offerElement.querySelector('.lodge__title').textContent = offerObj.offer.title;
  offerElement.querySelector('.lodge__address').textContent = offerObj.offer.address;
  offerElement.querySelector('.lodge__address').textContent = offerObj.offer.price + '\u20BD/ночь';
  offerElement.querySelector('.lodge__type').textContent = HOUSING_TYPES_MAP[offerObj.offer.type];
  offerElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + offerObj.offer.guests + ' гостей в ' + offerObj.offer.rooms + ' комнатах';
  offerElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + offerObj.offer.checkin + ', выезд до ' + offerObj.offer.checkout;
  var featuresHtml = '';
  for (var j = 0; j < offerObj.offer.features.length; j++) {
    featuresHtml += '<span class="feature__image  feature__image--' + offerObj.offer.features[j] + '"></span>';
  }
  offerElement.querySelector('.lodge__features').innerHTML = featuresHtml;
  offerElement.querySelector('.lodge__description').textContent = offerObj.offer.description;

  replaceDialogPanel(offerElement);

  document.querySelector('.dialog__title img').src = offerObj.author.avatar;
}

var offers = getOffersArr();
renderPinMap(offers);
renderOfferDialog(offers[0]);

var Pins = document.querySelectorAll('.pin:not(.pin__main)');
var dialogClose = document.querySelector('.dialog__close');
var dialog = document.querySelector('.dialog');

function openDialog(idx) {
  for (var i = 0; i < Pins.length; i++) {
    Pins[i].classList.remove('pin--active');
  }
  Pins[idx].classList.add('pin--active');

  dialog.classList.remove('hidden');
  renderOfferDialog(offers[idx]);
}

function closeDialog() {
  dialog.classList.add('hidden');
  for (var j = 0; j < Pins.length; j++) {
    Pins[j].classList.remove('pin--active');
  }
}

function pinClickHandler(i) {
  openDialog(i);
  document.addEventListener('keydown', dialogEscPressHandler);
}

function pinEnterPressHandler(i, evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openDialog(i);
    document.addEventListener('keydown', dialogEscPressHandler);
  }
}

function dialogEscPressHandler(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeDialog();
  }
}

for (var i = 0; i < Pins.length; i++) {
  Pins[i].addEventListener('click', pinClickHandler.bind(null, i));
  Pins[i].addEventListener('keydown', pinEnterPressHandler.bind(null, i));
}

dialogClose.addEventListener('click', function () {
  closeDialog();
});