class Carousel {

    ElementID;
    DefaultIndex = 0;
    Infinity     = true;
    List         = [];

    CarouselWidth = 0;
    DOMCarouselWrapper;
    DOMCarouselInnerWrapper;
    DOMCarousel;
    DOMBulletWrapper;
    DOMPrevButton;
    DOMNextButton;

    ignite() {
        this.DOMCarouselWrapper      = document.querySelector('#' + this.ElementID);
        this.DOMCarouselWrapper.innerHTML += `<button type="button" class="navigation-prev navigation"><</button>`;
        this.DOMCarouselWrapper.innerHTML += `<div class="carousel-inner-wrapper"><div class="carousel"></div></div>`;
        this.DOMCarouselWrapper.innerHTML += `<button type="button" class="navigation-next navigation">></button>`;
        this.DOMCarouselWrapper.innerHTML += `<ul class="bullets-wrapper"></ul>`;
        this.DOMCarousel             = this.DOMCarouselWrapper.children[1].firstChild;
        this.DOMCarouselInnerWrapper = this.DOMCarouselWrapper.children[1];
        this.DOMPrevButton           = this.DOMCarouselWrapper.children[0];
        this.DOMNextButton           = this.DOMCarouselWrapper.children[2];
        this.DOMBulletWrapper        = this.DOMCarouselWrapper.childNodes[this.DOMCarouselWrapper.childNodes.length - 1];

        this.List.forEach((item, index) => {
            this.DOMCarousel.innerHTML += item.Markup;
            this.DOMBulletWrapper.innerHTML += this.createBullets(item, index);
            const element = this.DOMCarouselWrapper.children[1].firstChild.children[index];
            this.CarouselWidth += this.getElementFullWidth(element);
            console.log(' this.CarouselWidth', this.CarouselWidth);
        });

        console.log(' this.CarouselWidth', this.CarouselWidth);

        this.DOMBulletWrapper.addEventListener('click', this.handleBulletClicks());

        this.DOMCarouselWrapper.addEventListener('click', this.handleNavClicks());

        this.DOMCarouselWrapper.addEventListener('keydown', this.handleKeys());


        this.carouselMove(this.DefaultIndex);
    }

    addBlock(Block) {
        this.List.push(Block);
    }

    createBullets(item, index) {
        return `<li class="li-dot" data-block-index="${index}"><span class="dot"></span></li>`;
    }

    scrollNext() {
        if (this.DefaultIndex + 1 < this.List.length) {
            this.DefaultIndex += 1;
            this.carouselMove(this.DefaultIndex);
        } else if (this.Infinity) {
            this.DefaultIndex = 0;
            this.carouselMove(this.DefaultIndex);
        }
    }

    scrollPrev() {
        if (this.DefaultIndex > 0) {
            this.DefaultIndex -= 1;
            this.carouselMove(this.DefaultIndex);
        } else if (this.Infinity) {
            this.DefaultIndex = this.List.length - 1;
            this.carouselMove(this.DefaultIndex);
        }

    }

    carouselMove(index) {

        let translate    = 0;
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
        this.dotHighlight();
        this.navigationVisibility();
        this.setCarouselStyle(translate)
    }

    setCarouselStyle(translate) {
        this.DOMCarousel.style.transform = `translateX(${translate}px)`;
        this.DOMCarousel.style.width     = `${this.CarouselWidth}px`;
    }

    dotHighlight() {
        const elementNodeList = document.querySelectorAll('#' + this.ElementID + ' .li-dot');
        const elementList     = Array.from(elementNodeList);

        elementList.forEach(item => {
            if (+item.dataset.blockIndex === this.DefaultIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

    }

    navigationVisibility() {
        if (!this.Infinity) {
            if (this.DefaultIndex === this.List.length - 1) {
                this.DOMNextButton.classList.add('hide-me');
            } else {
                this.DOMNextButton.classList.remove('hide-me');
            }

            if (this.DefaultIndex === 0) {
                this.DOMPrevButton.classList.add('hide-me');
            } else {
                this.DOMPrevButton.classList.remove('hide-me');
            }
        }
    }

    getElementFullWidth(element) {
        const elementStyle   = window.getComputedStyle(element);
        const elementWidth   = element.offsetWidth;
        const elementMargin  = parseFloat(elementStyle.marginLeft) + parseFloat(elementStyle.marginRight);
        const elementPadding = parseFloat(elementStyle.paddingLeft) + parseFloat(elementStyle.paddingRight);
        const elementBorder  = parseFloat(elementStyle.borderLeftWidth) + parseFloat(elementStyle.borderRightWidth);
        return elementWidth + elementMargin - elementPadding + elementBorder;
    }

    /*** event handler functions ***/
    handleNavClicks = () => (event) => {
        if (event.target.classList.contains('navigation-prev')) {
            this.scrollPrev();
        } else if (event.target.classList.contains('navigation-next')) {
            this.scrollNext();
        }
    };

    handleBulletClicks = () => (event) => {
        if (event.target.nodeName === 'LI') {
            this.DefaultIndex = +event.target.dataset.blockIndex;
            this.carouselMove(this.DefaultIndex);
        }
    };

    handleKeys = () => (event) => {
        console.log('event', event);
        switch (event.key) {
            case "ArrowLeft":
                this.scrollPrev();
                break;
            case "ArrowRight":
                this.scrollNext();
                break;
        }
    };
}

class Block {
    Content = null;
    Markup  = null;

    constructor(Content) {
        this.Content = Content
        this.Markup  = `<div class="single-block">${Content}</div>`;
    }
}

/* Carousel 1 */
const carousel     = new Carousel();
carousel.ElementID = 'carousel1';
carousel.addBlock(new Block(`<div style="width: 400px; text-align:center"><h3>HTML block</h3><p>First Paragraph</p> <p>Second Paragraph, Lorem Ipsum is simply dummy text.</p> </div>`));
carousel.addBlock(new Block(`<img src="assets/images/cat.png" alt="cat picture"></div>`));
carousel.addBlock(new Block(`Lorem Ipsum is simply dummy text of the printing and typesetting industry.`));
carousel.addBlock(new Block(`Non formatted text block`));
carousel.addBlock(new Block(`Non formatted text block`));
carousel.addBlock(new Block(`Non formatted text block`));
carousel.addBlock(new Block(`Non formatted text block`));
carousel.ignite();


/* Carousel 2 */
const carousel2        = new Carousel();
carousel2.ElementID    = 'carousel2';
carousel2.DefaultIndex = 2;
carousel2.Infinity     = false;

carousel2.addBlock(new Block(`<div style="width: 400px; text-align:center"><h3>HTML block</h3><p>First Paragraph</p> <p>Second Paragraph, Lorem Ipsum is simply dummy text.</p> </div>`));
carousel2.addBlock(new Block(`<img src="assets/images/cat.png" alt="cat picture"></div>`));
carousel2.addBlock(new Block(`Lorem Ipsum is simply dummy text of the printing and typesetting industry.`));
carousel2.addBlock(new Block(`Non formatted text block`));
carousel2.addBlock(new Block(`Non formatted text block`));
carousel2.addBlock(new Block(`Non formatted text block`));
carousel2.addBlock(new Block(`Non formatted text block`));
carousel2.ignite();
