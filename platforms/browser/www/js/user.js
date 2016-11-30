var server = 'http://localhost/';
var userToken = 'jnandezp';
var passToken = '123123';

function getToken(){
  myApp.showPreloader('getToken');
  var tokenExist = localStorage.getItem('tokenWebService');
  if (!tokenExist) {
    $.ajax({
      dataType: 'json',
      data: { user: userToken, password: passToken },
      method: "post",
      processData: true,
      url: server+"token.php",
      success: function searchSuccess(resp) {
        if (resp.token != undefined && resp.token != '') {
          localStorage.setItem('tokenWebService', resp.token);
        }
        myApp.hidePreloader();
        myApp.alert('Token Success', 'Token Success');
      },
      error: function searchError(xhr, err) {
        // myApp.alert('An error has occurred', 'Login Error');
      }
    });
  }else{
    myApp.hidePreloader();
  }
}



function userLogin(e) {
  var formData = myApp.formToJSON('#user-login');
  e.preventDefault();

  var tokenExist = localStorage.getItem('tokenWebService');
  if (!tokenExist) {
    getToken();
  }

  console.log(tokenExist);

  // Simple validate
  if (!formData.email || !formData.password) {
    myApp.alert('Please enter email and password', 'Login Error');
    return;
  }

  // Loading
  myApp.showPreloader('Searching');


  $.ajax({
    url: server+"login.php",
    headers: {
      'Authorization':'Bear '+tokenExist,
    },
    method: "post",
    dataType: 'json',
    processData: true,
    data: formData,
    success: function searchSuccess(resp) {
      myApp.hidePreloader();
      myApp.alert('Welcome ' + resp.name, 'Login Success');
      mainView.router.load({
        pageName: 'index',
        animatePages: false,
        reload: true,
      });
    },
    error: function searchError(xhr, err) {
      myApp.hidePreloader();
      myApp.alert('An error has occurred', 'Login Error');
    }
  });
}
