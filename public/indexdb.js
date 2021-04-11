// Our database variable
let db;

// Creating a request for our Database
const request = indexedDB.open(`budget`, 1);

request.onupgradeneeded = function (event) {
    // Creates object store called "Pending"
    db = event.target.result;
    db.createObjectStore(`pending`, { autoIncrement: ture });
};

request.onsuccess = function (event) {
    db = event.target.result;

    // Checks if the app is online before reading from db
    if (navigator.onLine) {
        checkDatabase();
    }
};
request.onerror = function (event) {
    console.log(`Oops${event.target.errorcode}`);
};

function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");

    // access the pending object store
    const store = transaction.objectStore("pending");

    // using add method to add a record to the store
    store.add(record);
};



