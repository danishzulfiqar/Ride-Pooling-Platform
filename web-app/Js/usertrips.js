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
    var loaderContainer = document.getElementById('loader-container');
    var listwarning = document.getElementById("List-Warning");
    var NavUserName = document.getElementById("User-Name");

    console.log(First_Name);
    NavUserName.innerHTML = First_Name;

    if (data.val().Trips)
    {
        listwarning.innerHTML= "";
    }
    else{
        listwarning.innerHTML= "No Trips to Show";
    }

    // For loader
    loaderContainer.style.opacity = '0';
    loaderContainer.style.visibility = 'hidden';
}