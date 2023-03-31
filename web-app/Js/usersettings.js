auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.replace('../Html/login.html?#');
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
    console.log(snap.val().full_name + "(found)");

    GetUserData(snap);
})

function GetUserData(data) {
    var First_Name = data.val().first_name;
    var Last_Name = data.val().last_name;
    var Phone = data.val().Phone;
    console.log(First_Name);

    var NavUserName = document.getElementById("User-Name");
    var SettingsName = document.getElementById("Settings-Name");
    var SettingsPhone = document.getElementById("Settings-Phone");
    NavUserName.innerHTML = First_Name;
    SettingsName.innerHTML = First_Name + " " + Last_Name;
    SettingsPhone.innerHTML = "+92 " + Phone;

}