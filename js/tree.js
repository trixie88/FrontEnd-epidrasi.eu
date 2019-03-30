let goToChatBtn = document.getElementById("goToChatBtn");
let checkedUsersList;
let usersId;
let tokenAlphanumeric;
let modalUsersId = document.getElementById("modalUsersId");
let showModalSendMessageBtn = document.getElementById("showModalSendMessage");
let logoutBtn = document.getElementById("logoutBtn");
let sendMessageBtn = document.getElementById("sendMessageBtn");
let followersBtn = document.getElementById("followersBtn");
let calculatingImg = document.getElementById("calculatingImg");
goToChatBtn.addEventListener("click", function() {
  window.location.href = "chat.html";
});
if (localStorage.getItem("credentials") === null) {
  window.location.href = "login1.html";
} else {
  let usersCredentialArray = JSON.parse(localStorage.getItem("credentials"));
  if (usersCredentialArray.length == 0) {
    window.location.href = "login1.html";
  } else {
    tokenAlphanumeric = usersCredentialArray[0];
    usersId = usersCredentialArray[1];
    modalUsersId.innerText = usersId;
    let loggedInUsername = usersCredentialArray[2];
    document.getElementById("usersLi").setAttribute("parentID", usersId);
    document.getElementById(
      "loggedInUsernamee"
    ).innerHTML = `<i class="collapsed">
              <i class="fas fa-folder eikonidio">
              </i>
            </i>
            <i class="expanded"><i class="far fa-folder-open eikonidio">
              </i> 
            </i>  ${loggedInUsername} `;
  }
}
followersBtn.addEventListener("click", function() {
  followersBtn.style.display = "none";
  calculatingImg.style.display = "inline";
  setTimeout(function() {
    $.ajax({
      url: "https://rest.epidrasi.eu/get/getNumberOfChildren/" + usersId,
      type: "POST",
      dataType: "text",
      async: true,
      success: function(data) {
        let numberOfFollowers = document.getElementById("numberOfFollowers");
        calculatingImg.style.display = "none";
        numberOfFollowers.innerText = data + " Followers";
      },
      error: function() {
        alert("errorr");
      }
    });
  }, 0);
});
logoutBtn.addEventListener("click", function() {
  $.ajax({
    url: "https://rest.epidrasi.eu/logout/" + tokenAlphanumeric,
    type: "POST",
    async: true,
    success: function() {
      deleteCredentialsFromLocalStorage();
      window.location.href = "login1.html";
    },
    error: function() {
      alert("errorr");
    }
  });
});
showModalSendMessageBtn.addEventListener("click", function() {
  checkedUsersList = [...document.querySelectorAll(".checkedForMessage")]; //etsi kanw to nodeList array se ES6
});
sendMessageBtn.addEventListener("click", function() {
  let typedMessage = document.getElementById("typedMessage").value;
  let senderId = usersId;
  let messagesArray = [];
  checkedUsersList.forEach(function(checkBox) {
    if (checkBox.checked == true) {
      let receiverID = checkBox.value;
      let messageFromFrontEnd = {
        senderID: senderId,
        receiverID: receiverID,
        text: typedMessage
      };
      messagesArray.push(messageFromFrontEnd);
    }
  });
  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "https://rest.epidrasi.eu/saveMessages/message",
    data: JSON.stringify(messagesArray),
    async: true,
    success: () => {
      alert("messages sent");
    },
    error: () => {
      alert("errorr");
    }
  });
});

function deleteCredentialsFromLocalStorage() {
  let objectIdArray;
  if (localStorage.getItem("credentials") === null) {
    objectIdArray = [];
  } else {
    objectIdArray = JSON.parse(localStorage.getItem("credentials"));
    objectIdArray = [];
  }
  localStorage.setItem("credentials", JSON.stringify(objectIdArray));
}
let tree = document.querySelector(".tree");
let count = 1;
tree.addEventListener("click", function(e) {
  if (e.target.classList.contains("eikonidio")) {
    let diakoptis =
      e.target.parentElement.parentElement.parentElement.nextElementSibling;
    console.log("diakoptis apo katw");
    console.log(diakoptis);
    // if (diakoptis.style.display == "none") {
    let parentUlList = diakoptis.children[0];
    let parentIdfromLi = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute(
      "parentId"
    );
    console.log("+++++++++++++");
    console.log(parentUlList);
    console.log("paidia");
    console.log(parentUlList.children.length);
    if (parentUlList.children.length == 0) {
      $.ajax({
        type: "POST",
        url:
          "https://rest.epidrasi.eu/get/" +
          parentIdfromLi +
          "/" +
          tokenAlphanumeric,
        dataType: "json",
        // data:tokenAlphanumeric,
        async: true,
        success: function(data) {
          for (i = 0; i < data.length; i++) {
            let li = document.createElement("li");
            li.setAttribute("parentID", data[i].id);
            li.innerHTML = `<span class="parent">
                           <a style="color:#000; text-decoration:none;" data-toggle="collapse" href="#page1" aria-expanded="false" aria-controls="page1">
                                <i class="collapsed">
                                    <i class="fas fa-folder eikonidio">
                                  </i>
                                </i>
                                <i class="expanded">
                                  <i class="far fa-folder-open eikonidio">
                                  </i>
                                </i> ${data[i].username}
                             </a>
                             <input class="checkedForMessage" type="checkbox"  value="${
                               data[i].id
                             }">
                              <i class="fas fa-envelope"></i>
                            </span>
                                <div id="page+${count}" class="collapse show" style="display:none;">
                                <ul class="ParentList">
                                </ul>
                               </div>
                            `;
            // let span = document.createElement("span");
            // span.className = "parent";
            // let aElement = document.createElement("a");
            // aElement.setAttribute("style", "color:#000; text-decoration:none;");
            // aElement.setAttribute("data-toggle", "collapse");
            // aElement.setAttribute("href", "#!");
            // aElement.setAttribute("aria-expanded", "false");
            // aElement.setAttribute("aria-controls", "page1");
            // aElement.innerText = data[i].username;
            // let iCollapsed = document.createElement("i");
            // iCollapsed.className = "collapsed";
            // let iFaSFaFolder = document.createElement("i");
            // iFaSFaFolder.className = "fas fa-folder eikonidio";
            // let iExpanded = document.createElement("i");
            // iExpanded.className = "expanded";
            // let iFarFaFolder = document.createElement("i");
            // iFarFaFolder.className = "far fa-folder-open eikonidio";
            // iExpanded.appendChild(iFarFaFolder);
            // iCollapsed.appendChild(iFaSFaFolder);
            // aElement.appendChild(iCollapsed);
            // aElement.appendChild(iExpanded);
            // span.appendChild(aElement);
            // let ulList = document.createElement("ul");
            // ulList.className = "ParentList";
            // // ulList.appendChild(divCollapsed);
            // let divCollapsed = document.createElement("div");
            // divCollapsed.id = "page" + count;
            // divCollapsed.className = "collapse show";
            // divCollapsed.style.display = "none";
            // divCollapsed.appendChild(ulList);
            // li.appendChild(span);
            // li.appendChild(divCollapsed);
            parentUlList.appendChild(li);
            count = count + 1;
          }
        },
        error: function() {
          alert("errorr");
        }
      });
    }
    if (diakoptis.style.display == "none") {
      diakoptis.style.display = "block";
    } else {
      diakoptis.style.display = "none";
    }
  }
});
