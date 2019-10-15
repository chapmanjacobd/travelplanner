import React, { useState } from 'react';

const GOOGLE_BUTTON_ID = 'google-sign-in-button';

class GoogleSignIn extends React.Component {
  componentDidMount () {
    window.gapi.signin2.render(GOOGLE_BUTTON_ID, {
      width: 180,
      height: 50,
      onFailure: this.onFailure,
      onsuccess: this.onSuccess,
    });
  }
  onSuccess (googleUser) {
    const profile = googleUser.getBasicProfile();
    console.log('Name: ' + profile.getName());
    // // The ID token you need to pass to your backend:
    // var id_token = googleUser.getAuthResponse().id_token;
    // console.log("ID Token: " + id_token);
    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', 'https://travel.unli.xyz/api/tokensignin');
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // xhr.onload = function (){
    //   console.log('Signed in as: ' + xhr.responseText);
    // };
    // xhr.send('idtoken=' + id_token);
  }
  onFailure (res) {
    console.log(res);
  }
  render () {
    return <div id={GOOGLE_BUTTON_ID} data-onsuccess='onSignIn' />;
  }
}

export default GoogleSignIn;

// const GoogleLoginBtn = () => {
//   const [
//     showButton,
//     toggleShow,
//   ] = useState(true);

//   if (showButton) {
//     return (
//       <GoogleLogin
//         onSuccess={res => {
//           toggleShow(false);
//           responseGoogle(res);
//         }}
//         onFailure={responseGoogle}
//         clientId=''
//         buttonText='Login'
//         cookiePolicy={'single_host_origin'}
//         // theme='dark'
//       />
//     );
//   }
//   return (
//     // <GoogleLogout onClick={() => toggleShow(true)} buttonText='Logout' onLogoutSuccess={logout} />
//   );
// };
