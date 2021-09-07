import '../stylesheets/messLowBalance.css'

export function messServerError (gameContext, text, href) {
    const l = gameContext.components.locale

    const container = document.createElement('div')
    container.classList.add('mess-low-balance')
    container.setAttribute("id", "blockWindow");

    container.innerHTML = `
           <div><div>${l.getPhrase("Error.")}</div></div>
           <div class="text-mess">${ text }</div>
           <div class="but-group-mess">
                <div id="redirectFromBlockWindow" class="but-mess">
                    <div>Try restart game</div>
                </div>
           </div>`

    document.querySelector('.app-container').append(container)

    gameContext.components['ui']
        && gameContext.components['ui'].disableButtons
        && gameContext.components['ui'].disableButtons()

    const buttRedirect = document.getElementById("redirectFromBlockWindow")
    const redirect = () => window.location.href = href
    buttRedirect.addEventListener('touchstart', redirect);
    buttRedirect.addEventListener("click", redirect);
}

