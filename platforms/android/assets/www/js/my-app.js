// Code for platform detection
var isMaterial = Framework7.prototype.device.ios === false;
var isIos = Framework7.prototype.device.ios === true;

// Add the above as global variables for templates
Template7.global = {
  material: isMaterial,
  ios: isIos,
};
// A template helper to turn ms durations to mm:ss
// We need to be able to pad to 2 digits
function pad2(number) {
  if (number <= 99) { number = ('0' + number).slice(-2); }
  return number;
}

// Now the actual helper to turn ms to [hh:]mm:ss
function durationFromMsHelper(ms) {
  if (typeof ms != 'number') {
    return '';
  }
  var x = ms / 1000;
  var seconds = pad2(Math.floor(x % 60));
  x /= 60;
  var minutes = pad2(Math.floor(x % 60));
  x /= 60;
  var hours = Math.floor(x % 24);
  hours = hours ? pad2(hours) + ':' : '';
  return hours + minutes + ':' + seconds;
}

// A stringify helper
// Need to replace any double quotes in the data with the HTML char
//  as it is being placed in the HTML attribute data-context
function stringifyHelper(context) {
  var str = JSON.stringify(context);
  return str.replace(/"/g, '&quot;');
}

// Finally, register the helpers with Template7
Template7.registerHelper('durationFromMs', durationFromMsHelper);
Template7.registerHelper('stringify', stringifyHelper);

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

if (!isIos) {
  // Change class
  $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
  // And move Navbar into Page
  $$('.view .navbar').prependTo('.view .page');
}

// Initialize app
var myApp = new Framework7({
  material: isIos? false : true,
  template7Pages: true,
  precompileTemplates: true,
  swipePanel: 'left',
  swipePanelActiveArea: '30',
  swipeBackPage: true,
  animateNavBackIcon: true,
  pushState: !!Framework7.prototype.device.os,
});

// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true,
  domCache: true,
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function deviceIsReady() {
  getToken();
});

$$(document).on('click', '.panel .search-link', function searchLink() {
  // Only change route if not already on the index
  //  It would be nice to have a better way of knowing this...
  var indexPage = $$('.page[data-page=index]');
  if (indexPage.hasClass('cached')) {
    mainView.router.load({
      pageName: 'index',
      animatePages: false,
      reload: true,
    });
  }
});


$$(document).on('submit', '#user-login', userLogin);
