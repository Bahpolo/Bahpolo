function stringToDom(str) {
    return document.createRange().createContextualFragment(str).firstChild;
}

function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toSvgPath() {
        return `${this.x} ${this.y}`;
    }

    static formAngle(angle) {
        return new Point(Math.cos(angle), Math.sin(angle));
    }
}

/**
 * @property {number[]} data
 * @property {SVGPathElement[]} paths
 */ 
class PieChart extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        const labels = this.getAttribute("labels")?.split(';') ?? [];
        const donut = this.getAttribute("donut") ?? "0";
        const colors = this.getAttribute("colors")?.split(';') ?? ["#820f68", "#2487a6", "#fd8b3d", "#b75838"];
        this.data = this.getAttribute("data").split(';').map(v => parseFloat(v));
        const svg = stringToDom(`<svg viewBox="-1 -1 2 2">
            <g mask="url(#graphMask)"></g>
            <mask id="graphMask">
                <rect fill="white" x="-1" y="-1" width="2" height="2"/>
                <circle r="${donut}" fill="black"/>
            </mask>
        </svg>`);
        const pathGroup = svg.querySelector('g');
        const maskGroup = svg.querySelector('mask');
        const gap = this.getAttribute("gap") ?? "0.04";

        // On crée les chemins
        this.paths = this.data.map((_, k) => {
            const color = colors[k % (colors.length - 1)];
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', color);
            pathGroup.appendChild(path);
            path.addEventListener('mouseover', () => this.handlePathHover(k));
            path.addEventListener('mouseout', () => this.handlePathOut(k));
            return path;
        });
        this.lines = this.data.map(() => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('stroke', "#000");
            line.setAttribute('stroke-width', gap);
            line.setAttribute('x1', "0");
            line.setAttribute('y1', "0");
            maskGroup.appendChild(line);
            return line;
        });
        this.labels = labels.map((label) => {
            const div = document.createElement('div');
            div.innerText = label;
            shadow.appendChild(div);
            return div;
        });

        const style = document.createElement("style");
        style.innerHTML = `
            :host {
                display: block;
                position: relative;
            }
            svg {
                width: 100%;
                height: 100%;
            }
            path {
                cursor: pointer;
                transition: opacity .3s;
            }
            path:hover {
                opacity: 0.6;
            }
            div {
                position: absolute;
                top: 0;
                left: 0;
                font-size: .8rem;
                padding: .2rem .4rem;
                transform: translate(-50%, -50%);
                background-color: var(--tooltip-bg, #fff);
                opacity: 0;
                transition: opacity .3s;
            }
            .is-active {
                opacity: 1;
            }
        `;
        shadow.appendChild(style);
        shadow.appendChild(svg);
    }

    connectedCallback() {
        let now = Date.now();
        const duratio = 800;
        const draw = () => {
            const t = (Date.now() - now) / duratio;
            if(t < 1) {
                this.draw(easeOutExpo(t));
                window.requestAnimationFrame(draw);
            } else {
                this.draw(1);
            }
        }
        window.requestAnimationFrame(draw);
    }

    draw(progress = 1) {
        const total = this.data.reduce((acc, v) => acc + v, 0);
        let angle = Math.PI / -2;
        let start = new Point(0, -1);
        for (let k = 0; k < this.data.length; k++) {
            this.lines[k].setAttribute('x2', start.x);
            this.lines[k].setAttribute('y2', start.y);
            const ratio = (this.data[k] / total) * progress;
            if (progress===1) {
                this.positionLabel(this.labels[k], angle + ratio * Math.PI, ratio);
            }
            angle += ratio  * 2 * Math.PI;
            const end = Point.formAngle(angle);
            const largeFlag = ratio > .5 ? '1' : '0';
            this.paths[k].setAttribute('d', `M 0 0 L ${start.toSvgPath()} A 1 1 0 ${largeFlag} 1 ${end.toSvgPath()} L 0 0`);
            start = end;
        }
    }


    /**
     * Gère l'effet de hover sur les sections du graph.
     * @param {Number} k Index de l'élément survolé
     */ 
    handlePathHover(k) {
        this.labels[k]?.classList.add("is-active");
    }
    handlePathOut(k) {
        this.labels[k]?.classList.remove("is-active");
    }

    /**
     * Positionne le label en fonction de l'angle
     * @param {HTMLDivElement|undefined} label
     * @param {Number} angle
     */ 
    positionLabel(label, angle, ratio) {
        if(!label || !angle) {
            return;
        }
        ratio = Math.floor(ratio * 100);
        const point = Point.formAngle(angle);
        label.style.setProperty('top', `${(point.y * 1.25 * 0.5 + 0.5) * 100}%`);
        label.style.setProperty('left', `${(point.x * 1.25 * 0.5 + 0.5) * 100}%`);
        label.innerHTML += ' ('+ratio+'%)'
    }
};

customElements.define('pie-chart', PieChart);