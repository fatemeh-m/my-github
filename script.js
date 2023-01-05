const userNameElem = document.querySelector(".user-name")
const userBlogElem = document.querySelector(".user-blog")
const userLocationElem = document.querySelector(".user-location")
const userBioElem = document.querySelector(".user-bio")
const userAvatarElem = document.querySelector(".user-avatar")
const invalidUserElem = document.querySelector(".invalid-user")
const errorElem = document.querySelector(".error")
const submitBtn = document.querySelector(".submit-btn")
const inputElem = document.getElementById("user-input")
submitBtn.addEventListener('click', search);

// search user information and show resultsc
async function search(){
    hideAlerts()
    let input = inputElem.value
    if(input == "")
        return
    let savedData = await JSON.parse(window.localStorage.getItem(input))
    if(savedData){
        showUserInformation(savedData)
    } else{
        try {
            let response = await fetch(`https://api.github.com/users/${input}`)
            let data = await response.json()

            if(response.status == 404){
                showAlert(invalidUserElem)
            }else if(response.status >= 200 && response.status < 300){
                showUserInformation(data)
                saveResultToLocalStorage(input, data)
            }
        } catch (e) {
            showAlert(errorElem)
            console.log("connection failed!")
        }
    }
}

//set error elements hidden
function hideAlerts(){
    invalidUserElem.style.visibility = "hidden"
    errorElem.style.visibility = "hidden"    
}

//update elements with resullt
function showUserInformation(data){
    userNameElem.innerHTML = (data.name) ? data.name : "___"
    userBlogElem.innerHTML = (data.blog) ? data.blog : "___"
    userBioElem.innerText = (data.bio) ? data.bio : "__"
    userLocationElem.innerHTML = (data.location) ? data.location : "___"
    if(data.avatar_url){
        userAvatarElem.src = data.avatar_url
    }
}

//set an error element visible
function showAlert(elem){
    elem.style.visibility = "visible"    
}

//store result in local storage
function saveResultToLocalStorage(name, data){
    const userResult = {
        name : data.name,
        blog : data.blog,
        location : data.location,
        bio : data.bio,
        avatar_url : data.avatar_url,
    }
    window.localStorage.setItem(name, JSON.stringify(userResult))
}