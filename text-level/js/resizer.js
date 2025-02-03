export function initResizer() {
    const resizer = document.getElementById("editor-resizer");
    const container = document.querySelector(".editor-container");
    
    if (!resizer || !container) return;

    let isResizing = false;
    let startX;
    let startWidth;
    let totalWidth;

    function startResize(e) {
        const x = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
        isResizing = true;
        startX = x;

        const containerRect = container.getBoundingClientRect();
        totalWidth = containerRect.width;
        
        const leftPanel = container.querySelector(".editor-panel");
        startWidth = leftPanel.getBoundingClientRect().width;

        resizer.classList.add("active");
        document.body.classList.add("resizing");
    }

    function resize(e) {
        if (!isResizing) return;

        const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
        const diffX = x - startX;
        const newLeftWidth = ((startWidth + diffX) / totalWidth) * 100;

        if (newLeftWidth >= 20 && newLeftWidth <= 80) {
            container.style.gridTemplateColumns = `${newLeftWidth}% auto ${100 - newLeftWidth - 2}%`;
            localStorage.setItem("editorSplit", newLeftWidth);
        }
    }

    function stopResize() {
        isResizing = false;
        resizer.classList.remove("active");
        document.body.classList.remove("resizing");
    }

    // Mouse Events
    resizer.addEventListener("mousedown", startResize);
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);

    // Touch Events
    resizer.addEventListener("touchstart", startResize, { passive: true });
    document.addEventListener("touchmove", resize, { passive: true });
    document.addEventListener("touchend", stopResize);
    document.addEventListener("touchcancel", stopResize);

    // Gespeicherte Position wiederherstellen
    const savedSplit = localStorage.getItem("editorSplit");
    if (savedSplit) {
        container.style.gridTemplateColumns = `${savedSplit}% auto ${100 - savedSplit - 2}%`;
    }
}