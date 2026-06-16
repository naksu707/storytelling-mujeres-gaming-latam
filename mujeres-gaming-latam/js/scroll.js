/* Controla qué escena está activa según el scroll y mueve el spine.*/

function initScroll() {

    const panels    = Array.from(document.querySelectorAll(".panel"));
    const steps     = Array.from(document.querySelectorAll(".step"));
    const spineFill = document.getElementById("spine-fill");
    const scrolly   = document.querySelector(".scrolly");
    let current = -1;

    function setActive(index) {

        if (index === current) return;

        panels.forEach((panel, i) => {
            const isOn = (i === index);
            panel.classList.toggle("active", isOn);
            if (!isOn) resetScene(i);
        });

        if (panels[index]) {
            resetScene(index);
            requestAnimationFrame(() => animateScene(index));
        }

        if (sceneColors[index]) {
            spineFill.style.background = cssVar(sceneColors[index]);
        }

        current = index;

    }

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const index = Number(entry.target.dataset.step);

                steps.forEach(step => {
                    step.classList.toggle("active", step === entry.target);
                });

                setActive(index);

            }
        });

    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

    steps.forEach(step => observer.observe(step));

    function onScroll() {

        const rect = scrolly.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const progress = Math.min(Math.max(-rect.top / (total || 1), 0), 1);

        spineFill.style.height = (progress * 100) + "%";

    }

    window.addEventListener("scroll", onScroll, { passive: true });

    onScroll();
    setActive(0);

}
