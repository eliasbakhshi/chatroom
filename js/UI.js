/* Make changes for the UI of the chatroom. */
class UI {
    constructor(list, rooms) {
        this.list = list;
        this.rooms = rooms;
    }
    add(data) {
        let when = dateFns.distanceInWordsToNow(
            data.created_at.toDate(),
            { addSuffix: true }
            );
        let message = `
        <div class="message">
            <h3>${data.name}</h3>
            <span>${when}</span>
            <p>${data.message}</p>
        </div>
        `;
        this.list.innerHTML += message;
    }
    setRooms(value, name) {
        let roomOption = `<option value="${value}">${name}</option>`;
        this.rooms.innerHTML += roomOption;
    }
}