function buyerLogin() {

    let username = document.getElementById("buyerUsername").value.trim();
    let password = document.getElementById("buyerPassword").value.trim();

    if (username !== "" && password !== "") {

        alert("Login Successful!");
        window.location.href = "home.html";

        // window.location.href = "home.html";

    } else {

        alert("Please enter Username and Password.");

    }

}