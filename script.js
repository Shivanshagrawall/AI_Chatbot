let inputBox = document.querySelector('#input-box');
let chatContainer = document.querySelector('.chat-container');
let imageBtn = document.querySelector('#image-btn');
let inputImage = document.querySelector('#image-btn input');
let image = document.querySelector('#image-btn img');
let submitBtn = document.querySelector('#submit-input');

// API URL
const api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBFTNkQ7C4Wx8MPH8Xba5lnA32DLopMA6I";

let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
}

// Function to Generate Response through API
async function generateResponse(aiChatBox) {

    let requestOption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [
                {
                    "parts": [
                        { "text": user.message },
                        ...(user.file.data ? [{ "inline_data": user.file }] : [])
                    ]
                }

            ]
        })
    }


    try {
        let response = await fetch(api_url, requestOption);
        let data = await response.json();
        let responseData = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

        let text = aiChatBox.querySelector('.ai-area');
        text.innerHTML = responseData;
    }
    catch (error) {
        alert(error);
    }
    finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
        user.file = { mime_type: null, data: null };
        image.src = 'image.svg';
        image.classList.remove('choose');
    }
}

// Function to create user and AI chatbox
function createChatBox(html, classes) {
    let div = document.createElement('div');
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

// Function to handle prompts Submitted by users
function handleChatResponse(message) {
    let html = `
        <img src="user-image.jpg" alt="user Image" id="user-image" height="50">
        <div class="user-area">
            ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>` : ""}
            ${message}
        </div>
    `
    let userChatBox = createChatBox(html, "user-area-box");
    chatContainer.appendChild(userChatBox);
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

    setTimeout(() => {
        let html = `
            <img src="ai-chatbot.avif" alt="ai Image" id="ai-image" height="50">
            <div class="ai-area">
            Loading...
            </div>
        `
        let aiChatBox = createChatBox(html, "ai-area-box");
        chatContainer.appendChild(aiChatBox);

        user.message = message;
        generateResponse(aiChatBox);
    }, 1000);

}

// Event Listener when Enter press in Prompts section
inputBox.addEventListener('keydown', (e) => {
    if (e.key == "Enter") {
        handleChatResponse(inputBox.value);
        inputBox.value = "";
    }
})

// Image Input Section 
inputImage.addEventListener("change", () => {
    let file = inputImage.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1];
        user.file = {
            mime_type: file.type,
            data: base64string,
        }
        image.src = `data:${user.file.mime_type};base64,${user.file.data}`;
        image.classList.add('choose')
    }
    reader.readAsDataURL(file);
})
imageBtn.addEventListener("click", () => {
    imageBtn.querySelector("input").click();
})

// Submit Button
submitBtn.addEventListener("click", () => {
    handleChatResponse(inputBox.value);
    inputBox.value = "";
})
