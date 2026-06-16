/* Datos, construcción de las gráficas y sus animaciones.           */

const REDUCE = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

const sceneColors = [
    "--pink-strong",  
    "--blue-strong",  
    "--rose",         
    "--rose-deep",    
    "--lav-deep",     
    "--good-ink",     
    "--pink-strong",  
    "--lav-deep"     
];

const css = getComputedStyle(document.documentElement);
const cssVar = name => css.getPropertyValue(name).trim();

/* DATOS                                                            */

const waffleData = [
    {
        value: "77,7%",
        label: "Empezó a jugar antes de los 10 años",
        fill: 78
    },
    {
        value: "52%",
        label: "Se identifica plenamente como gamer",
        fill: 52
    },
    {
        value: "47,4%",
        label: "Se considera entusiasta o aficionada",
        fill: 47
    },
    {
        value: "30,2%",
        label: "Trabaja formalmente en la industria",
        fill: 30
    }
];

/* CONSTRUCCIÓN DEL DOM                                             */
function buildCharts() {

    const container = document.getElementById("waffles1");
    waffleData.forEach(item => {
        const cell = document.createElement("div");
        cell.classList.add("wcell");
        let dots = "";
        for (let i = 0; i < 100; i++) {
            dots += `<span class="dot"></span>`;
        }
        cell.innerHTML = `
            <div class="wnum">
                ${item.value}
            </div>
            <div class="wlab">
                ${item.label}
            </div>
            <div class="wgrid" data-fill="${item.fill}">
                ${dots}
            </div>
        `;
        container.appendChild(cell);
    });

    const waffleSilencio = document.getElementById("waffle-silencio");
    for (let i = 0; i < 100; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        waffleSilencio.appendChild(dot);
    }
}

/* HELPERS DE ANIMACIÓN                                             */

function fillWaffle(grid) {
    const target = Number(grid.dataset.fill);
    const dots = grid.children;
    if (REDUCE) {
        for (let i = 0; i < target; i++) dots[i].classList.add("on");
        return;
    }
    let i = 0;
    (function tick() {
        if (i < target) {
            dots[i].classList.add("on");
            i++;
            setTimeout(tick, 11);
        }
    })();
}
function resetWaffle(grid) {
    Array.from(grid.children).forEach(dot => dot.classList.remove("on"));
}
function growBars(selector, stagger) {
    document.querySelectorAll(selector).forEach((bar, i) => {
        const delay = REDUCE ? 0 : (120 + i * (stagger || 200));
        setTimeout(() => { bar.style.width = bar.dataset.w + "%"; }, delay);
    });
}
function resetBars(selector) {
    document.querySelectorAll(selector).forEach(bar => { bar.style.width = "0"; });
}
function format(value, decimals) {
    return value.toFixed(decimals).replace(".", ",");
}
function countUp(el, target, decimals, suffix) {

    if (REDUCE) {
        el.textContent = format(target, decimals) + suffix;
        return;
    }

    const start = performance.now();
    const duration = 1100;

    function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = format(target * eased, decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);

}

/* DISPATCHERS POR ESCENA                                           */

function animateScene(index) {

    switch (index) {

        case 0:
            document.querySelectorAll("#waffles1 .wgrid").forEach(fillWaffle);
            break;

        case 1:
            growBars(".bar-fill", 200);
            break;

        case 4:
            fillWaffle(document.getElementById("waffle-silencio"));
            countUp(document.getElementById("num-silencio"), 91, 0, "%");
            break;

        case 6:
            countUp(document.getElementById("num-familia"), 59.2, 1, "%");
            setTimeout(() => {
                document.getElementById("fill-familia").style.width = "59.2%";
            }, REDUCE ? 0 : 200);
            break;

        case 7:
            growBars(".peru-fill", 160);
            break;

    }

}

function resetScene(index) {

    switch (index) {

        case 0:
            document.querySelectorAll("#waffles1 .wgrid").forEach(resetWaffle);
            break;

        case 1:
            resetBars(".bar-fill");
            break;

        case 4:
            resetWaffle(document.getElementById("waffle-silencio"));
            document.getElementById("num-silencio").textContent = "91%";
            break;

        case 6:
            document.getElementById("num-familia").textContent = "59,2%";
            document.getElementById("fill-familia").style.width = "0";
            break;

        case 7:
            resetBars(".peru-fill");
            break;

    }

}
