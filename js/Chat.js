class Chat {
    constructor(name) {
        this.name = name;
        this.room;
        this.messages = db.collection('messages');
        this.rooms = db.collection('rooms');
        this.unsubMessages;
    }

    async add(message) {
        const now = firebase.firestore.Timestamp.fromDate(new Date());
        const newMessage = {
            message,
            name: this.name,
            room: this.room,
            created_at: now
        };
        const response = await chat.messages.add(newMessage);
        return response;
    }
    changeRoom(room) {
        this.room = room;
        if (this.unsubMessages) {
            this.unsubMessages();
        }
    }
    changeName (name) {
        this.name = name;
        name = localStorage.setItem("Cname", name);
    }
    get(callback) {
        this.unsubMessages = this.messages
                                    .where("room", "==", this.room)
                                    .orderBy("created_at")
                                    .onSnapshot(snapshot => {
                                        snapshot.docChanges().forEach(change => {
                                            if (change.type === "added") {
                                                callback(change.doc.data());
                                            }
                                        });
                                    });
    }
}
