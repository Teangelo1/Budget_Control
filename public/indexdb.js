// Our database variable
let db;

// Creating a request for our Database
const request = indexedDB.open(`budget`, 1);

request.onupgradeneeded = function(event) {
    // Creates object store called "Pending"
    db = event.target.result;
    db.createObjectStore("pending", {autoIncrement: ture});
};

request.onsuccess = function(event) {
    db = event.target.result;
}
