const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.querySelector("#usernameForm").value;
    const password = document.querySelector("#passwordForm").value;
    const rememberMe = document.querySelector("#rememberCheckBox").checked;
    
    console.log("testing!!");

    document.querySelector("#usernameForm").value = "";
    document.querySelector("#passwordForm").value = "";
    document.querySelector("#rememberCheckBox").checked = false;
});

document.querySelector('.cookie-consent button').addEventListener('click', () => {
    document.querySelector('.cookie-consent').style.display = 'none';
});