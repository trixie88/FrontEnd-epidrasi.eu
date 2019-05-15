let sendMessageBtn = document.getElementById("sendMessageBtn");
let chatInbox = document.getElementById("chatInbox");
let usersOfChat = [];
let usersId;
let chatUserID = "";
let shownMessagesLength = 0;
let loggedInUsername;
let hiddeNeM = document.getElementById("hiddeNeM");
let messagesArea = document.getElementById("messagesArea");
if (localStorage.getItem("credentials") === null) {
  window.location.href = "login1.html";
} else {
  let usersCredentialArray = JSON.parse(localStorage.getItem("credentials"));
  if (usersCredentialArray.length == 0) {
    window.location.href = "login1.html";
  } else {
    tokenAlphanumeric = usersCredentialArray[0];
    usersId = usersCredentialArray[1];
    loggedInUsername = usersCredentialArray[2];
    $.ajax({
      url:
        "https://rest.epidrasi.eu/saveMessages/getUsersWithActiveChat/" +
        usersId,
      type: "GET",
      dataType: "json",
      async: true,
      success: function(data) {
        for (i = 0; i < data.length; i++) {
          let divChatList = document.createElement("div");
          divChatList.className = "chat_list";
          divChatList.innerHTML = `<div class="chat_people">
                                <div class="chat_img"> <img  class="imageChat" src="https://ptetutorials.com/images/user-profile.png"
                                        alt="sunil"> </div>
                                <div class="chat_ib">
                                    <h5>${data[i].name} ${data[i].lastname}</h5>
                                    <p hidden="false">${data[i].id}</p>
                                  </div>
                            </div>`;
          chatInbox.appendChild(divChatList);
        }
      },
      error: function() {
        alert("errorr");
      }
    });
  }
}
chatInbox.addEventListener("click", function(e) {
  if (e.target.classList.contains("imageChat")) {
    chatUserID =
      e.target.parentElement.nextElementSibling.children[1].innerText;
    messagesArea.innerHTML = "";
    $.ajax({
      url:
        "https://rest.epidrasi.eu/saveMessages/getChatBetween/" +
        chatUserID +
        "/" +
        usersId,
      type: "GET",
      dataType: "json",
      async: true,
      success: function(data) {
        // console.log(data);
        shownMessagesLength = data.length;
        for (i = 0; i < data.length; i++) {
          if (data[i].sender.id == usersId) {
            let divOutGoing = document.createElement("div");
            divOutGoing.className = "outgoing_msg";
            divOutGoing.innerHTML = ` <div class="sent_msg">
                                <p>${data[i].text}</p>
                                <span class="time_date">${data[i].date}</span>
                            </div>`;
            messagesArea.appendChild(divOutGoing);
            // console.log("eiserxomeno");
          } else {
            let divIncoming = document.createElement("div");
            divIncoming.className = "incoming_msg";
            divIncoming.innerHTML = `<div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png"
                                    alt="sunil"> </div>
                            <div class="received_msg">
                                <div class="received_withd_msg">
                                    <p>${data[i].text}</p>
                                    <span class="time_date">${
                                      data[i].date
                                    }</span>
                                </div>
                            </div>`;
            messagesArea.appendChild(divIncoming);
          }
        }
      },
      error: function() {
        alert("errorr");
      }
    });
  }
});
setInterval(function() {
  if (chatUserID != "") {
    $.ajax({
      url:
        "https://rest.epidrasi.eu/saveMessages/getChatBetween/" +
        chatUserID +
        "/" +
        usersId,
      type: "GET",
      dataType: "json",
      async: true,
      success: function(data) {
        if (data.length > shownMessagesLength) {
          shownMessagesLength = data.length;
          messagesArea.innerHTML = "";
          for (i = 0; i < data.length; i++) {
            if (data[i].sender.id == usersId) {
              let divOutGoing = document.createElement("div");
              divOutGoing.className = "outgoing_msg";
              divOutGoing.innerHTML = ` <div class="sent_msg">
                                <p>${data[i].text}</p>
                                <span class="time_date">${data[i].date}</span>
                            </div>`;
              messagesArea.appendChild(divOutGoing);
            } else {
              let divIncoming = document.createElement("div");
              divIncoming.className = "incoming_msg";
              divIncoming.innerHTML = `<div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png"
                                    alt="sunil"> </div>
                            <div class="received_msg">
                                <div class="received_withd_msg">
                                    <p>${data[i].text}</p>
                                    <span class="time_date">${
                                      data[i].date
                                    }</span>
                                </div>
                            </div>`;
              messagesArea.appendChild(divIncoming);
            }
          }
        }
      },
      error: function() {
        alert("errorr");
      }
    });
  }
}, 3000);
sendMessageBtn.addEventListener("click", () => {
  let typedMessage = document.getElementById("typedMessageArea");
  let messagesArray = [];
  if (chatUserID != "") {
    let messageFromFrontEnd = {
      senderID: usersId,
      receiverID: chatUserID,
      text: typedMessage.value
    };
    messagesArray.push(messageFromFrontEnd);
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "https://rest.epidrasi.eu/saveMessages/message",
      data: JSON.stringify(messagesArray),
      async: true,
      success: () => {
        typedMessage.value = "";
        // alert("messages sent");
      },
      error: () => {
        alert("Server Error");
      }
    });
  } else {
    alert("Please Choose A user from the left");
  }
});
