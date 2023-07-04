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
        const divChartBx = document.createElement('div');
        divChartBx.className = "chart_box";
        shadow.appendChild(divChartBx);
        const divPieChartBx = document.createElement('div');
        divPieChartBx.className = "pie-chart_box";
        divChartBx.appendChild(divPieChartBx);
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
            div.className = "label";
            div.innerText = label;
            divPieChartBx.appendChild(div);
            return div;
        });
        const divLengendBox = document.createElement('div');
        divLengendBox.className = "legend_box";
        divChartBx.appendChild(divLengendBox);
        this.divLengendBoxRoot = divLengendBox;
        this.labelsList = labels;
        this.colorsList = colors;

        const style = document.createElement("style");
        style.innerHTML = `
            :host {
                display: block;
                position: relative;
            }
            div.chart_box {
                display: flex;
                flex-direction: row;
                align-items: center;
            }
            div.pie-chart_box {
                position: relative;
                height: 150px;
                width: 150px;
                box-sizing: border-box;
            }
            div.legend_box {
                margin-left: 30px;
                display: flex;
                flex-direction: column;
                gap: 20px;
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
            div.label {
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
                opacity: 1 !important;
            }
            div.legend {
                display: flex;
                flex-direction: row;
            }
            span.legend-color {
                display: block;
                position: relative;
                height: 20px;
                width: 20px;
                border-radius: 5px;
                margin-right: 15px;
            }
        `;
        divPieChartBx.appendChild(style);
        divPieChartBx.appendChild(svg);
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
                const color = this.colorsList[k % (this.colorsList.length - 1)];
                console.log(this.labels[k]);
                this.positionLabel(this.labels[k], angle + ratio * Math.PI, ratio);
                this.createLegend(this.divLengendBoxRoot, this.labelsList[k], color, ratio);
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
        label.innerHTML += ' ('+ratio+'%)';
    }

    createLegend(elem, label, color, ratio) {
        if(!elem || !label || !ratio || !color) {
            return;
        }
        ratio = Math.floor(ratio * 100);
        const divLengend = document.createElement('div');
        divLengend.className = "legend";
        elem.appendChild(divLengend);
            const spanLengendColor = document.createElement('span');
            spanLengendColor.className = "legend-color";
            spanLengendColor.style.backgroundColor = color;
            divLengend.appendChild(spanLengendColor);
            const spanLengendTxt = document.createElement('span');
            spanLengendTxt.className = "legend-txt";
            spanLengendTxt.innerHTML = label+" :<br>"+ratio+"%";
            divLengend.appendChild(spanLengendTxt);
    }
};

customElements.define('pie-chart', PieChart);