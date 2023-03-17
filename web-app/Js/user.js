auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.replace('../login.html?#');
        firebase.initializeApp(firebaseConfig);
    }

    else {
        localStorage.setItem("UserId", user.uid);
    }
})

function signout() {
    auth.signOut();
}

const UserId = localStorage.getItem("UserId");
console.log(UserId);

firebase.database().ref('users/' + UserId).on("value", snap => {
    Username = snap.val().full_name;
    Useremail = snap.val().email;
    
    GiveData(snap);
})

function GiveData(data) {
    console.log(data.val().full_name);
}