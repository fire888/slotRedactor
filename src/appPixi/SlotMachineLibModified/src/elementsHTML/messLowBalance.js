/**
 * Created by Vasilii on 13.07.2020.
 */

import '../stylesheets/messLowBalance.css'

export function showMessageLowBalance (gameContext) {
    const eventEmitter = gameContext.components.eventEmitter
    const redirectAddress = gameContext.CONSTANTS.GAME_CONFIG.REDIRECT_URL
    const l = gameContext.components.locale

    const container = document.createElement('div')
    container.classList.add('mess-low-balance')
    container.setAttribute("id", "blockWindow");

    container.innerHTML = `<div>${l.getPhrase("Insufficient funds.")}</div>
           <div class="text-mess">${l.getPhrase("You have insufficient funds to place this bet. To continue, please deposit additional funds.")}</div>
           <div class="but-group-mess">
                <div id="redirectFromBlockWindow" class="but-mess">
                    <div>${l.getPhrase("Deposit")}</div>
                </div>
                <div id="closeBlockWindow" class="but-mess">
                    <div>${l.getPhrase("Close")}</div>
                </div>
           </div>`

    // container.firstChild

    document.querySelector('.app-container').append(container)
    gameContext.components['ui'] && gameContext.components['ui'].disableButtons()



    const redirect = () => window.location.href = redirectAddress
    const buttRedirect = document.getElementById("redirectFromBlockWindow")
    buttRedirect.addEventListener('touchstart', redirect)
    buttRedirect.addEventListener("click", redirect)


    const closeBlockWindow = () => {
        gameContext.components['ui'] && gameContext.components['ui'].enableButtons()
        document.getElementById('blockWindow').remove()
        eventEmitter.emit('closeWindowBetMoreBalance', null)
    }
    const closeButton = document.getElementById("closeBlockWindow")
    closeButton.addEventListener('touchstart', closeBlockWindow)
    closeButton.addEventListener("click", closeBlockWindow)


    return container
}
