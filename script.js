const button = document.getElementById('button')
const buttonRepeat = document.getElementById('button-repeat')
const buttonSubtitle = document.getElementById('button-subtitle')
const audioElement = document.getElementById('audio')
const textElement = document.getElementById('jokeText')


let joke 


// VoiceRSS Javascript SDK
// mod the SDK instead of creating a new Audio replace with our audio element  
// audioElement.src=t.responseText, audioElement.play()
// const VoiceRSS={speech:function(e){this._validate(e),this._request(e)},_validate:function(e){if(!e)throw"The settings are undefined";if(!e.key)throw"The API key is undefined";if(!e.src)throw"The text is undefined";if(!e.hl)throw"The language is undefined";if(e.c&&"auto"!=e.c.toLowerCase()){var a=!1;switch(e.c.toLowerCase()){case"mp3":a=(new Audio).canPlayType("audio/mpeg").replace("no","");break;case"wav":a=(new Audio).canPlayType("audio/wav").replace("no","");break;case"aac":a=(new Audio).canPlayType("audio/aac").replace("no","");break;case"ogg":a=(new Audio).canPlayType("audio/ogg").replace("no","");break;case"caf":a=(new Audio).canPlayType("audio/x-caf").replace("no","")}if(!a)throw"The browser does not support the audio codec "+e.c}},_request:function(e){var a=this._buildRequest(e),t=this._getXHR();t.onreadystatechange=function(){if(4==t.readyState&&200==t.status){if(0==t.responseText.indexOf("ERROR"))throw t.responseText;audioElement.src=t.responseText,audioElement.play()}},t.open("POST","https://api.voicerss.org/",!0),t.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),t.send(a)},_buildRequest:function(e){var a=e.c&&"auto"!=e.c.toLowerCase()?e.c:this._detectCodec();return"key="+(e.key||"")+"&src="+(e.src||"")+"&hl="+(e.hl||"")+"&r="+(e.r||"")+"&c="+(a||"")+"&f="+(e.f||"")+"&ssml="+(e.ssml||"")+"&b64=true"},_detectCodec:function(){var e=new Audio;return e.canPlayType("audio/mpeg").replace("no","")?"mp3":e.canPlayType("audio/wav").replace("no","")?"wav":e.canPlayType("audio/aac").replace("no","")?"aac":e.canPlayType("audio/ogg").replace("no","")?"ogg":e.canPlayType("audio/x-caf").replace("no","")?"caf":""},_getXHR:function(){try{return new XMLHttpRequest}catch(e){}try{return new ActiveXObject("Msxml3.XMLHTTP")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(e){}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}throw"The browser does not support HTTP request"}};


// Disable/Enable Button
function toggleButton(){
    button.disabled = !button.disabled
    buttonRepeat.disabled = !buttonRepeat.disabled 
}

function toggleSubtitleButton(){
    if(textElement.hidden){
        textElement.hidden = false
        buttonSubtitle.innerText = 'Subtitle: On '
    }else{
        textElement.hidden = true
        buttonSubtitle.innerText = 'Subtitle: OFF '
    }
}


// Passing Joke to VoiceRSS API
function tellMe(joke) {
    // console.log('tell me: ', joke)
    VoiceRSS.speech({
        //The key should be hidden. the server has the key. Send the response with the key
        //to the client, the frontend. Never have the API key on the frontend. 
        key: 'f4e7280bfba84376b65000b0165e7039',
        src: joke,
        hl: 'en-gb',
        v: 'Alice',
        r: 1, 
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
}



// Get Jokes from Joke API
async function getJokes(){
    const apiUrl = 'https://v2.jokeapi.dev/joke/Programming,Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit'
    try {
        buttonRepeat.disabled = false
        const response = await fetch(apiUrl)
        const data = await response.json()
        if(data.setup){
            joke = `${data.setup} ... ${data.delivery}`
        } else {
            joke = data.joke
        }
        textElement.innerText = joke
        // Text-to_Speech
        tellMe(joke)
        // Disable the Button after the joke button is clicked, 
        toggleButton()  // button.disabled = true
    } catch (error) {
        //Catch Errors
        console.log('Beeeep Error Here: ', error)
    }
}


//Event Listeners
button.addEventListener('click', getJokes)

buttonRepeat.addEventListener('click', ()=>{
    textElement.innerText = joke
    tellMe(joke)
    toggleButton()
})

buttonSubtitle.addEventListener('click', toggleSubtitleButton)

audioElement.addEventListener('ended', () => {
    toggleButton()
    textElement.innerText = ""
}) 
// wait until the audio event has ended, to enable the joke button
// audioElement.addEventListener('ended', () => {button.disabled = false})