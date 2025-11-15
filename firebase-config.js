// firebase-config.js
// Демо-конфиг - замените на свои данные Firebase
const firebaseConfig = {
    apiKey: "demo-lecturesbase-api-key",
    authDomain: "lecturesbase-demo.firebaseapp.com",
    projectId: "lecturesbase-demo",
    storageBucket: "lecturesbase-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "demo-app-id"
};

// Инициализация Firebase (в демо-режиме может не работать)
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
    }
} catch (error) {
    console.log('Firebase не настроен. Работаем в демо-режиме.');
}

// Демо-переменные
const auth = {
    onAuthStateChanged: (callback) => {
        // Демо-функция
        setTimeout(() => callback(null), 100);
    },
    signInWithEmailAndPassword: () => Promise.reject(new Error('Настройте Firebase')),
    signOut: () => Promise.resolve()
};

const db = {
    collection: () => ({
        doc: () => ({
            get: () => Promise.resolve({ exists: false, data: () => null }),
            set: () => Promise.resolve()
        }),
        add: () => Promise.resolve(),
        where: () => ({
            where: function() { return this; },
            orderBy: () => ({
                get: () => Promise.resolve({ forEach: (cb) => {}, empty: true, size: 0 })
            }),
            get: () => Promise.resolve({ forEach: (cb) => {}, empty: true, size: 0 })
        }),
        get: () => Promise.resolve({ forEach: (cb) => {}, empty: true, size: 0 })
    })
};

const storage = {
    ref: () => ({
        child: () => ({
            put: () => Promise.resolve({
                ref: {
                    getDownloadURL: () => Promise.resolve('#')
                }
            })
        })
    })
};

console.log('🔧 LecturesBase работает в демо-режиме. Настройте Firebase для полной функциональности.');