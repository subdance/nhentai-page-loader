class Controller {
    constructor() {
        console.log("initiating content");
        this.container = document.querySelector("#content");
        this.favCon = document.querySelector("#favcontainer");
        this.pagination = document.querySelector(".pagination");
        this.pageCounter = this.getCurrentPage();
        this.favSum = 0;
        this.pageMax = 0;
        this.counterHolder = null;
        this.generateHTML();
        this.getFavSum().then(res => {
            this.favSum = res;
            this.pageMax = Math.ceil(this.favSum / 25);
            this.counterHolder = this.create("div", "counter-holder", `<span class="start-page hide">${this.pageCounter}</span><span class='counter-span'>${this.pageCounter}</span> OF ${this.pageMax} pages <span id="face">(｡･ω･｡)ﾉ♡</span>`, this.container);
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
        const search = window.location.search;
        if (!search) {
            return `${window.location.href}?page=${this.pageCounter + 1}`;
        }
        else {
            const para = new URLSearchParams(window.location.search);
            if (!para.get("page")) {
                console.log("with search no page")
                return `${window.location.href}&page=${this.pageCounter + 1}`;
            }
            else {
                para.set("page", this.pageCounter + 1);
                console.log("with search with page")
                return `https://${location.hostname}/favorites/?${para.toString()}`
            }
        }
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

    getCurrentPage = () => {
        const para = window.location.search;
        if (!para) {
            console.log("1")
            return 1
        }
        else {
            const page = new URLSearchParams(para).get("page");
            if (page) {
                console.log(page);
                return Number(page);
            }
            else {
                console.log("1")
                return 1
            }
        }
    }

    generateHTML = () => {
        const id = chrome.runtime.id;
        const more = this.create("div", "more-button", "<i class='fa fa-plus'></i>", this.container);
        more.style.backgroundImage = `url(chrome-extension://__MSG_@@${id}/images/chibi.png)`
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
        e.innerHTML = "<i class='fa fa-refresh fa-spin'></i>";
        if (this.pageMax <= this.pageCounter) {
            e.removeAttribute("disabled");
            e.innerHTML = "<i class='fa fa-plus'></i>";
            alert("no more page");
            return;
        };
        const counter = document.querySelector(".counter-span");
        const xml = new XMLHttpRequest();
        // let url = `${this.handleUrl()}page=${this.pageCounter + 1}`;
        let url = this.handleUrl();
        console.log(url);
        xml.open("GET", url);
        xml.send();
        xml.onreadystatechange = () => {
            if (xml.readyState === XMLHttpRequest.DONE) {
                e.classList.remove("processing");
                e.innerHTML = "<i class='fa fa-plus'></i>";
                const s = document.querySelector(".start-page");
                s.classList.remove("hide");
                if (xml.status === 200) {
                    this.pageCounter ++;
                    this.swap();
                    counter.innerHTML = this.pageCounter;
                    const x = document.createElement("html");
                    x.innerHTML = xml.responseText;
                    const newFavNodes = x.querySelectorAll(".gallery-favorite").length ? x.querySelectorAll(".gallery-favorite") : x.querySelectorAll(".gallery");
                    console.log(newFavNodes.length)
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