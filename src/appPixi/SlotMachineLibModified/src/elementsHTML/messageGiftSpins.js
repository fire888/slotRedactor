import '../stylesheets/messLowBalance.css'

export function showMessageGiftSpins (gameContext, data, callback) {
    const l = gameContext.components.locale

    const container = document.createElement('div')
    container.classList.add('mess-low-balance')
    container.setAttribute("id", "blockWindow");

    container.innerHTML = `<div>${ data.title }</div>
           <div class="text-mess">${ data.text }</div>
           <div class="but-group-mess">
                <div id="closeBlockWindow" class="but-mess">
                    <div>${l.getPhrase("Close")}</div>
                </div>
           </div>`

    document.querySelector('.app-container').append(container)

    const onclick = () => {
        document.getElementById("closeBlockWindow").removeEventListener("mouseup", onclick, false)
        document.getElementById('blockWindow').remove()
        callback()
    }
    document.getElementById("closeBlockWindow").addEventListener ("mouseup", onclick, false);

    return container
}
