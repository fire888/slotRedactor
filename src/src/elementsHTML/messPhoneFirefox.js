import '../stylesheets/messLowBalance.css'



export function messPhoneFirefox (gameContext) {
    const redirectAddress = gameContext.CONSTANTS.GAME_CONFIG.HOME_URL

    const container = document.createElement('div')
    container.style.display = 'flex';
    container.style.flex = '1 0 auto'
    container.style.justifyContent = 'center'
    container.style.alignItems = 'center'


    const mess = document.createElement('div')
    mess.classList.add('mess-low-balance')
    mess.setAttribute("id", "blockWindow");

    mess.innerHTML = `
           <div>Alert !</div>
           <div class="text-mess">Your browser don't support graphics acceleration. Please change browser.</div>
           <div class="but-group-mess">
                <div id="redirectFromBlockWindow" class="but-mess">
                    <div>Home</div>
                </div>
           </div>`
    container.appendChild(mess)

    document.querySelector('.app-container').append(container)

    gameContext.components['ui'] && gameContext.components['ui'].disableButtons()

    document.getElementById("redirectFromBlockWindow").addEventListener ("click", function () {
        redirectFromBlockWindow(redirectAddress);
    }, false);

    return container
}


function redirectFromBlockWindow(redirectAddress) {
    window.location.href = redirectAddress;
    return false;
}

