function ShowSignup() {
    var login = document.getElementById("Login-form");
    var signup = document.getElementById("Signup-form");

    login.style.display = "none";
    signup.style.display = "block";
}


function ShowLogin() {
    var login = document.getElementById("Login-form");
    var signup = document.getElementById("Signup-form");

    login.style.display = "block";
    signup.style.display = "none";
}

function Register() {
    var Email = document.getElementById('Signup-email').value;
    var password = document.getElementById('Signup-password').value;
    var name = document.getElementById('Signup-username').value;

    if (validate_email(Email) == false || validate_password(password) == false) {
        alert('Invalid Fields!!')
        return
    }

    if (validate_field(name) == false) {
        alert('One or More Extra Fields is Outta Line!!')
        return
    }

    firebase.auth().createUserWithEmailAndPassword(Email, password)
        .then(function () {
            var user = auth.currentUser
            var database_ref = database.ref()

            var user_data = {
                email: Email,
                full_name: name,
                last_login: Date.now()
            }

            database_ref.child('users/' + user.uid).set(user_data)

            alert('User Created!!')
        })
        .catch(function (error) {
            var error_code = error.code
            var error_message = error.message

            alert(error_message)
        })
}

function LoginAsUser() {
    var email = document.getElementById('Login-email').value;
    var password = document.getElementById('Login-password').value;

    if (validate_email(email) == false || validate_password(password) == false) {
        alert('Invalid Inputs!!')
        return
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function () {
            var user = auth.currentUser

            var database_ref = database.ref()

            var user_data = {
                last_login: Date.now()
            }

            database_ref.child('users/' + user.uid).update(user_data)
            alert('You are Logged In!!')

        })
        .catch(function (error) {
            var error_code = error.code
            var error_message = error.message

            alert(error_message)
        })
}


function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
        return true
    } else {

        return false
    }
}

function validate_password(password) {
    if (password < 6) {
        return false
    } else {
        return true
    }
}

function validate_field(field) {
    if (field == null) {
        return false
    }

    if (field.length <= 0) {
        return false
    } else {
        return true
    }
}

window.addEventListener("load", function () {
    window.location.replace('login.html?#');
})

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("You are Logged in");
        window.location.replace('Html/user.html');
    }
})


