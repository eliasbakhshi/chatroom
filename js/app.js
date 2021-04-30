/* Change the title of dropbox to room after the choice. */
let rooms = document.querySelector("select#rooms");
let roomsLabel = document.querySelector("#roomsLabel");
let nameBox = document.querySelector("#name");
let list = document.querySelector("section.list");
let newMessage = document.querySelector("form.new-message");

// Check if the user has username save in localstorage.
let name = "";
if (localStorage.getItem("Cname")) {
    name = localStorage.getItem("Cname")
} else {
    name = "anon";
    localStorage.setItem("Cname", name);
}
nameBox.value = name;

/* Class instances for intracting with Firebase. */
const chat = new Chat(name);
const ui = new UI(list, rooms);

/** Get the rooms and put it in the dropbox. */
chat.rooms.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
                dataRooms = change.doc.data();
                ui.setRooms(dataRooms.name,dataRooms.display_name);
            }
        });
    });

if (rooms !== null) {
    rooms.classList.remove("selected");
    roomsLabel.textContent = "Select a room";
    newMessage.style.display = "none";
    rooms.onchange = function () {
        // Change the label of the room box
        if (this.options[rooms.selectedIndex].value !== "none") {
            rooms.classList.add("selected");
            roomsLabel.textContent = "Room";
            newMessage.style.display = "flex";
        } else {
            rooms.classList.remove("selected");
            roomsLabel.textContent = "Select a room";
            newMessage.style.display = "none";
        }
        /* Fetch the messages. */
        list.innerHTML = "";
        chat.changeRoom(rooms.options[rooms.selectedIndex].value);
        chat.get(data => ui.add(data));
    }
}

/** Change the name by clicking outside of the box. */
function setNameByClick (e) {
    if (!e.target.classList.contains("name")) {
        if (nameBox.value.trim() !== name) {
            chat.changeName(nameBox.value.trim());
        }
    }
}

/** Change the name by pressing enter. */
function setNameByEnter (e) {
    if (e.key === "Enter") {
        if (nameBox.value.trim() !== name) {
            chat.changeName(nameBox.value.trim());
        }
    }
}
window.addEventListener("click", setNameByClick);
nameBox.addEventListener("keyup", setNameByEnter);
/* For the new message. */
newMessage.addEventListener("submit", (send) => {
    send.preventDefault();
    let messageText = document.getElementById("messageText");
    if (messageText.innerHTML.trim() !== "") {
        chat.add(messageText.innerHTML)
            .then(() => {
                messageText.innerHTML = "";
                list.scrollTop = list.scrollHeight;
            })
            .catch(err => console.log(err));
    }
});
/* Send the message by pressing the enter. */
newMessage.addEventListener("keydown", function (e) {
    if(e.key === "Enter" && e.shiftKey === false) {
        let messageText = document.getElementById("messageText");
        if (messageText.innerHTML.trim() !== "") {
            chat.add(messageText.innerHTML)
                .then(() => {
                    messageText.innerHTML = "";
                    list.scrollTop = list.scrollHeight;
                })
                .catch(err => console.log(err));
        }
    }
})
