document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    const state = {
        toolInputs: {
            charge: { bit2: 0, bit1: 0 },
            out: { bit2: 0, bit1: 0 }
        }
    };

    // --- DOM Elements ---
    const toolOverlay = document.getElementById('tool-overlay');
    const bitBtns = document.querySelectorAll('.bit-btn');
    const resultText = document.getElementById('result-text');

    // --- Tool Logic ---
    bitBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = btn.dataset.type; // "charge" or "out"
            const bit = btn.dataset.bit;   // "2" or "1"
            
            // Toggle value (0 <-> 1)
            const currentVal = state.toolInputs[type][`bit${bit}`];
            const newVal = currentVal === 0 ? 1 : 0;
            state.toolInputs[type][`bit${bit}`] = newVal;
            
            // Update UI
            btn.textContent = newVal === 1 ? '真' : '偽';
            if (newVal === 1) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }

            calculateResult();
        });
    });

    function calculateResult() {
        // Calculate values based on bits
        const valA = (state.toolInputs.charge.bit2 * 2) + state.toolInputs.charge.bit1;
        const valB = (state.toolInputs.out.bit2 * 2) + state.toolInputs.out.bit1;

        // XOR calculation
        const result = valA ^ valB;

        // Reset colors
        resultText.style.color = '#333333';

        // Mapping: 0=踏まない, 1=扇だけ, 2=直線だけ, 3=両方
        switch (result) {
            case 0:
                resultText.textContent = '踏まない';
                resultText.style.color = 'var(--color-none)';
                break;
            case 1:
                resultText.textContent = '扇だけ';
                resultText.style.color = 'var(--color-fan)';
                break;
            case 2:
                resultText.textContent = '直線だけ';
                resultText.style.color = 'var(--color-line)';
                break;
            case 3:
                resultText.textContent = '両方';
                resultText.style.color = 'var(--color-both)';
                break;
            default:
                resultText.textContent = '-';
        }
    }

    // --- Drag and Drop Logic ---
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    toolOverlay.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);

    function dragStart(e) {
        // Prevent dragging when clicking buttons
        if (e.target.closest('.bit-btn')) return;

        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target.closest('#tool-overlay')) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, toolOverlay);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    // Initialize result
    calculateResult();
});
