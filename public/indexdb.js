const { response } = require("express");

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

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");

    // get all records from store and set to a variable
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.results.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
                .then(() => {
                    // if successful, open a transaction on your pending db
                    const transaction = db.transaction(["pending"], "readwrite");

                    // access your pending store object
                    const store = transaction.objectStore("pending");

                    // clear all items from store
                    store.clear();
                });
        }
    }
}

// this event listener to listen for the app coming back online if offline
window.addEventListener(`online`, checkDatabase);



