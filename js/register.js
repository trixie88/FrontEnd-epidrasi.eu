if (!(localStorage.getItem("credentials") === null)) {
    let usersCredentialArray = JSON.parse(localStorage.getItem("credentials"));
    if (!(usersCredentialArray.length == 0)) {
        window.location.href = "tree.html";
    }
}
let calculatingImg = document.getElementById("calculatingImg");
let formaEggrafis = document.getElementById("formaEggrafis");
let registerBtn = document.getElementById("registerBtn");
let registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", function (e) {
    formaEggrafis.style.display = "none";
    calculatingImg.style.display = "inline";
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let parentId = document.getElementById("parentId").value;
    let phoneNumber = document.getElementById("phoneNumber").value;
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let repeatPassword = document.getElementById("repeatPassword").value;
    if (password == repeatPassword) {
        let credential = {
            "username": username,
            "password": password,
            "parentId": parentId,
            "name": firstName,
            "lastname": lastName,
            "email": email,
            "phone": phoneNumber,
            "enabled": false
        }
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "https://rest.epidrasi.eu/register/newUser",
            data: JSON.stringify(credential),
            async: true,
            success: () => {

                calculatingImg.style.display = "none";
                formaEggrafis.style.display = "inline";
                window.location.href = "login1.html";
                e.preventDefault();
            },
            error: () => {
                calculatingImg.style.display = "none";
                formaEggrafis.style.display = "inline";
                alert("Username or Email already in Use - OR INVALID PARENT ID");
                e.preventDefault();
            }
        });
    } else {
        alert("Passwords don't match");
    }
    e.preventDefault();
});