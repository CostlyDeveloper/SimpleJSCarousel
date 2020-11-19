class Carousel {

    ElementID;
    DOMCarouselWrapper;
    DOMCarouselInnerWrapper;
    DOMCarousel;
    DOMBulletWrapper;
    DefaultIndex = 0;
    List = [];

    addBlock(Block) {
        this.List.push(Block);
    }

    ignite() {
        this.DOMCarouselWrapper      = document.querySelector('#' + this.ElementID);
        this.DOMCarouselWrapper.innerHTML += `<button type="button" class="navigation-prev navigation"><</button>`;
        this.DOMCarouselWrapper.innerHTML += `<div class="carousel-inner-wrapper"><div class="carousel"></div></div>`;
        this.DOMCarouselWrapper.innerHTML += `<button type="button" class="navigation-next navigation">></button>`;
        this.DOMCarouselWrapper.innerHTML += `<ul class="bullets-wrapper"></ul>`;
        this.DOMCarousel             = this.DOMCarouselWrapper.children[1].firstChild;
        this.DOMCarouselInnerWrapper = this.DOMCarouselWrapper.children[1];
        this.DOMBulletWrapper        = this.DOMCarouselWrapper.childNodes[this.DOMCarouselWrapper.childNodes.length - 1];


        this.List.forEach((item, index) => {
            this.DOMCarousel.innerHTML += item.Markup;
            this.DOMBulletWrapper.innerHTML += this.createBullets(item, index);
        });
        this.DOMBulletWrapper.addEventListener('click', this.handleBulletClicks());

        this.DOMCarouselWrapper.addEventListener('click', this.handleNavClicks());

        this.calculateSetTranslate(this.DefaultIndex);
    }

    createBullets(item, index) {
        return `<li data-block-index="${index}"><span class="dot"></span></li>`;
    }

    handleNavClicks = () => (event) => {
        if (event.target.classList.contains('navigation-prev')) {

            if(this.DefaultIndex > 0){
                this.DefaultIndex -= 1;
                this.calculateSetTranslate(this.DefaultIndex);
            }

        } else if(event.target.classList.contains('navigation-next')){

            if(this.DefaultIndex +1 < this.List.length){
                this.DefaultIndex += 1;
                this.calculateSetTranslate(this.DefaultIndex);
            }
        }
    };

    handleBulletClicks = () => (event) => {
        if (event.target.nodeName === 'LI') {
            this.DefaultIndex = +event.target.dataset.blockIndex;
            this.calculateSetTranslate(this.DefaultIndex);
        }
    };

    calculateSetTranslate(index){
        let translate = 0;
        const element    = this.DOMCarouselWrapper.children[1].firstChild.children[index];
        const blockWidth = this.getElementFullWidth(element);

        if (index === 0) {
            translate = this.DOMCarouselInnerWrapper.offsetWidth / 2 - blockWidth / 2;
        } else if (this.List.length === (index + 1)) {
            translate = -(this.DOMCarousel.offsetWidth - (this.DOMCarouselInnerWrapper.offsetWidth / 2) - (blockWidth / 2));
        } else {
            let elementsBefore = 0;

            for (let iteration = 0; iteration < index; iteration++) {
                const element = this.DOMCarouselWrapper.children[1].firstChild.children[iteration];
                elementsBefore += this.getElementFullWidth(element);
            }

            translate = this.DOMCarouselInnerWrapper.offsetWidth / 2 - (elementsBefore + blockWidth / 2);

        }
        this.setCarouselStyle(translate)
    }

    setCarouselStyle(translate) {
        this.DOMCarousel.style.transform = `translateX(${translate}px)`;
    }

    getElementFullWidth(element) {
        const elementStyle   = window.getComputedStyle(element);
        const elementWidth   = element.offsetWidth;
        const elementMargin  = parseFloat(elementStyle.marginLeft) + parseFloat(elementStyle.marginRight);
        const elementPadding = parseFloat(elementStyle.paddingLeft) + parseFloat(elementStyle.paddingRight);
        const elementBorder  = parseFloat(elementStyle.borderLeftWidth) + parseFloat(elementStyle.borderRightWidth);
        return elementWidth + elementMargin - elementPadding + elementBorder;
    }

    navigationVisibility(){
        if(this.DefaultIndex === 0){
        // todo
        }
    }

}

class Block {
    Content = null;
    Markup  = null;

    constructor(Content) {
        this.Content = Content
        this.Markup  = `<div class="single-block">${Content}</div>`;
    }
}

const carousel     = new Carousel();
carousel.ElementID = 'carousel1';
carousel.addBlock(new Block(`<div><h3>Naslov</h3><p>paragraf</p> <p>HTML</p> <p>HTML</p></div>`));
carousel.addBlock(new Block(`<img src="assets/images/cat.png"></div>`));
carousel.addBlock(new Block(`Lorem Ipsum is simply dummy text of the printing and typesetting industry.`));
carousel.addBlock(new Block(`Non formatted text block`));
carousel.addBlock(new Block(`Non formatted text block`));
carousel.addBlock(new Block(`Non formatted text block`));
carousel.addBlock(new Block(`Non formatted text block`));



carousel.ignite();
