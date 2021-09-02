const applicationServerKey =
    'BAwBLsFBXsZCFS_Mvc7AEwmQGQlS4gzEqwOouF2s7PWS7zXkvdoRcYQrnGpxNHccBXtVdfZqiPRtjgKe1D5Z6s8';

const pushButton = document.getElementById('pushButton');
const peopleTable = $("#peopleTable");


if (!navigator.serviceWorker) {
    window.alert('Service workers are not supported by this browser')
}

if (!window.PushManager) {
    console.warn('Push notifications are not supported by this browser');
    pushButton.style.visibility = "hidden";
}



function initServiceWorker() {
    navigator.serviceWorker.register('/serviceworker.js')
        .then(() => {
            console.log('[SW] Registration successful.');
        })
        .catch(e => {
            console.error('[SW] Registration failed: ', e);
        });
}

function initTable() {
    peopleTable.bootstrapTable({
        columns: [{
            field: "id",
            title: "ID"
        }, {
            field: "fullname",
            title: "Name"
        }, {
            field: "street",
            title: "Street"
        }, {
            field: "address",
            title: "City"
        }, {
            field: "created_by",
            title: "Created"
        }, {
            field: "edited_by",
            title: "Edited"
        }, {
            field: "buttons",
            title: "",
            class: "text-center"
        }]
    })
}

initTable();
let people = null;


caches.open("dynamic-v1").then(function (cache) {
    cache.match("http://localhost/people/getPeople")
        .then(response => {
            if (!response) throw Error("No Data");
            return response.json();
        })
        .then(data => {
            writeToView(data);
        })
        .catch(() => people)
});


if (navigator.onLine) {
    fetch("http://localhost/people/checkCookie")
        .then((resp) => resp.json())
        .then(data => {
            if (data) {
                window.location.href = "http://localhost/";
            } else {
                initServiceWorker();
                people = fetch("http://localhost/people/getPeople")
                    .then(response => response.json())
                    .then(data => {
                        writeToView(data);
                    })
                    .catch(err => {
                        console.log("Security cookies not found");
                    });
            }
        })
        .catch(err => console.log(err));
}





function writeToView(people) {
    peopleTable.bootstrapTable('load', people);
}


// reloads page when back online
window.addEventListener('online', () => {
    location.reload();
})

// reloads page when offline
window.addEventListener('offline', () => {
    location.reload();
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Push Notifications ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (pushButton !== null) {
    navigator.serviceWorker.ready
        .then(serviceWorkerRegistration =>
            serviceWorkerRegistration.pushManager.getSubscription())
        .then(subscription => {
            if (subscription === null) {
                pushButton.textContent = 'Push off';
            } else {
                pushButton.textContent = 'Push on';
            }
        });


    pushButton.addEventListener('click', () => {
        navigator.serviceWorker.ready
            .then(serviceWorkerRegistration =>
                serviceWorkerRegistration.pushManager.getSubscription())
            .then(subscription => {
                if (subscription === null) {
                    push_subscribe()
                        .then(res => {
                            console.log("subscribe: " + res);
                        });
                    pushButton.textContent = 'Push on';
                } else {
                    if (confirm("are you sure you want to unsubscribe?")) {
                        push_unsubscribe();
                        pushButton.textContent = 'Push off';
                    }
                }
            });
    });
}


function checkNotificationPermission() {
    return new Promise((resolve, reject) => {
        if (Notification.permission === 'denied') {
            reject(new Error('Push messages are blocked.'));
        } else if (Notification.permission === 'granted') {
            resolve();
        } else {
            Notification.requestPermission().then(result => {
                if (result !== 'granted') {
                    reject(new Error('Bad permission result'));
                } else {
                    resolve();
                }
            });
        }
    })
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function push_subscribe() {
    return checkNotificationPermission()
        .then(() => navigator.serviceWorker.ready)
        .then(serviceWorkerRegistration =>
            serviceWorkerRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
            })
        )
        .then(subscription => {
            return push_sendSubscriptionToServer(subscription, 'POST');
        })
        .catch(e => {
            if (Notification.permission === 'denied') {
                console.warn('Notifications are denied by the user.');
            } else {
                console.error('Impossible to subscribe to push notifications', e);
            }
        });
}

function push_unsubscribe() {
    navigator.serviceWorker.ready
        .then(serviceWorkerRegistration =>
            serviceWorkerRegistration.pushManager.getSubscription())
        .then(subscription => {
            if (!subscription) {
                return;
            }
            subscription.unsubscribe();
            return push_sendSubscriptionToServer(subscription, 'DELETE');
        })
        .catch(e => {
            console.error('Error when unsubscribing the user', e);
        });
}

function push_sendSubscriptionToServer(subscription, method) {
    const key = subscription.getKey('p256dh');
    const token = subscription.getKey('auth');

    return fetch('http://localhost/people/push_subscription', {
        method,
        mode: "same-origin",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "endpoint": subscription.endpoint,
            "publicKey": key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
            "authToken": token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null
        })
    });
}


