if (!(localStorage.getItem("credentials") === null)) {
  let usersCredentialArray = JSON.parse(localStorage.getItem("credentials"));
  if (!(usersCredentialArray.length == 0)) {
    window.location.href = "tree.html";
  }
}
let calculatingImg = document.getElementById("calculatingImg");
let loginForma = document.getElementById("loginForma");
let loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", function() {
  loginForma.style.display = "none";
  calculatingImg.style.display = "inline";
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  $.ajax({
    url: "https://rest.epidrasi.eu/login/" + username + "/" + password,
    dataType: "json",
    type: "POST",
    async: true,
    success: function(data) {
      let enabled = data.enabledUser;
      if (enabled) {
        let credentialArray = [];
        credentialArray.push(data.alphanumeric);
        credentialArray.push(data.usersId);
        credentialArray.push(data.username);
        storeCredentialsInLocalStorage(credentialArray);
        calculatingImg.style.display = "none";
        loginForma.style.display = "inline";
        window.location.href = "tree.html";
      } else {
        calculatingImg.style.display = "none";
        loginForma.style.display = "inline";
        alert("Activate your account through the email we have sent you");
      }
    },
    error: function() {
      calculatingImg.style.display = "none";
      loginForma.style.display = "inline";
      alert("Wrong username Or Password");
    }
  });
});

function storeCredentialsInLocalStorage(credentialArray) {
  let objectIdArray;
  if (localStorage.getItem("credentials") === null) {
    objectIdArray = [];
  } else {
    objectIdArray = JSON.parse(localStorage.getItem("credentials"));
    objectIdArray = [];
  }
  credentialArray.forEach(function(credential) {
    objectIdArray.push(credential);
  });
  //  objectIdArray.push(objectId);
  localStorage.setItem("credentials", JSON.stringify(objectIdArray));
}
