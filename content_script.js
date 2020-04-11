class Controller {
    constructor() {
        console.log("initiating content");
        this.container = document.querySelector("#content");
        this.favCon = document.querySelector("#favcontainer");
        this.pagination = document.querySelector(".pagination");
        this.pageCounter = 1;
        this.favSum = 0;
        this.pageMax = 0;
        this.counterHolder = null;
        this.generateHTML();
        this.getFavSum().then(res => {
            this.favSum = res;
            this.pageMax = Math.ceil(this.favSum / 30);
            this.counterHolder = this.create("div", "counter-holder", `<span class='counter-span'>${this.pageCounter}</span> OF ${this.pageMax} pages`, this.container);
        })
    }

    create = (tag, className, innerHTML, parent) => {
        let body = document.createElement(tag);
        body.classList.add(className);
        if (innerHTML) {
            body.innerHTML = innerHTML;
        }
        if (parent) {
            parent.appendChild(body);
        }
        return body;
    }

    handleUrl = () => {
        return window.location.search ? `${window.location.href}&` : `${window.location.href}?`
    }

    getFavSum = () => {
        return new Promise((resolve, reject) => {
            const loop = setInterval(() => {
                const sumNode = document.querySelector(".count") || this.container.querySelector("h1");
                if (sumNode) {
                    clearInterval(loop); 
                    const contentStr = sumNode.textContent;
                    if (contentStr.includes("(")) {
                        return resolve(parseFloat(sumNode.textContent.substring(1, sumNode.textContent.length-1).replace(/,/g, '')));
                    }
                    else if (contentStr.includes("Results")) {
                        return resolve(Number(contentStr.slice(0, contentStr.length - 7)));
                    }
                    else {
                        return reject();
                    }
                }
            }, 500)
        })
    }

    generateHTML = () => {
        this.pagination.classList.add("hide");
        const more = this.create("button", "more-button", "<i class='fa fa-plus'></i>", this.container);
        more.addEventListener("click", (event) => {
            this.loadMore(event);
        })
    }

    getAttributeP = (ele) => {
        return new Promise((resolve) => {
            while (ele.getAttribute("data-src")) {
                return resolve(ele.getAttribute("data-src"))
            }
        })
    }

    loadMore = (event) => {
        const e = event.currentTarget;
        e.setAttribute("disabled", true);
        e.innerHTML = "<i class='fa fa-spinner fa-spin'></i>";
        if (this.pageMax <= this.pageCounter) {
            e.removeAttribute("disabled");
            e.innerHTML = "<i class='fa fa-plus'></i>";
            alert("no more page");
            return;
        };
        const counter = document.querySelector(".counter-span");
        const xml = new XMLHttpRequest();
        let url = `${this.handleUrl()}page=${this.pageCounter + 1}`;
        xml.open("GET", url);
        xml.send();
        xml.onreadystatechange = () => {
            if (xml.readyState === XMLHttpRequest.DONE) {
                e.removeAttribute("disabled");
                e.innerHTML = "<i class='fa fa-plus'></i>";
                if (xml.status === 200) {
                    this.pageCounter ++;
                    counter.innerHTML = this.pageCounter;
                    const x = document.createElement("html");
                    x.innerHTML = xml.responseText;
                    const newFavNodes = x.querySelectorAll(".gallery-favorite");
                    newFavNodes.forEach(item => {
                        this.favCon.appendChild(item);
                        const img = item.querySelector("img");
                        this.getAttributeP(img).then(res => {
                            img.setAttribute("src", res);
                        })
                    })
                }
            }
        }
    }
}

let controller = new Controller();