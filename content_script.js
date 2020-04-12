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
            this.pageMax = Math.ceil(this.favSum / 25);
            this.counterHolder = this.create("div", "counter-holder", `<span class='counter-span'>${this.pageCounter}</span> OF ${this.pageMax} pages <span id="face">(｡･ω･｡)ﾉ♡</span>`, this.container);
        });
        this.face = [
            "(๑•̀ㅂ•́)و✧",
            "(｡･ω･｡)ﾉ♥",
            "(*ෆ´ ˘ `ෆ*)♡",
            "ฅ՞•ﻌ•՞ฅ",
            "(ฅ◑ω◑ฅ)",
            "(ฅ• . •ฅ)ﻌﻌﻌ♥",
            "(๑Ő௰Ő๑)",
            "o(*≥▽≤)ツ",
            "_(´ཀ`」 ∠)_"
        ];
        Number.prototype.isBetween = function(min, max) {
            return ((this-min)*(this-max) <= 0);
        }
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
        // const more = this.create("button", "more-button", "<i class='fa fa-plus'></i>", this.container);
        const more = this.create("div", "more-button", "<i class='fa fa-plus'></i>", this.container);
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
        e.classList.add("processing");
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
                e.classList.remove("processing");
                e.innerHTML = "<i class='fa fa-plus'></i>";
                if (xml.status === 200) {
                    this.pageCounter ++;
                    this.swap();
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

    isBetween = (x, min, max) => {
        return ((x-min)*(x-max) <= 0);
    }

    swap = () => {
        let face = document.querySelector("#face");
        if (this.pageCounter.isBetween(2, 4)) {
            face.textContent = this.face[this.pageCounter - 2]; 
        }
        else if (this.pageCounter.isBetween(5, 7)) {
            face.textContent = this.face[3]; 
        }
        else if (this.pageCounter.isBetween(8, 11)) {
            face.textContent = this.face[4]; 
        }
        else if (this.pageCounter.isBetween(12, 16)) {
            face.textContent = this.face[5]; 
        }
        else if (this.pageCounter.isBetween(17, 22)) {
            face.textContent = this.face[6]; 
        }
        else if (this.pageCounter.isBetween(23, 29)) {
            face.textContent = this.face[7]; 
        }
        else {
            face.textContent = this.face[8]; 
        }
    }
}

let controller = new Controller();