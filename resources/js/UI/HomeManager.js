import Core from "../Core";
import PageManager from "./PageManager";

export default class HomeManager extends PageManager {
    constructor() {
        super("home");
        console.log("Home Manager instatiated");
    }

    async load() {
        // any data that needs to be loaded on the page
        this.data = {
            title: "Home",
            description: "Home Page",
        };
    }

    async init() {
        this.primaryCarouselLoader();
    }

    setListners() {
        console.log("listners set");
    }

    actions() {
        console.log("actions implemented");
    }

    /**
     * @description
     * load the primary carousel - menu
     *
     * @param {Array} dataList - the data list for the carousel
     */
    primaryCarouselLoader() {
        var swiper = new Swiper(".mySwiper", {
            slidesPerView: "auto",
            centeredSlides: true,
            spaceBetween: 30,
            initialSlide: 1, // Start from the 2nd slide (index 1)
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
        });
        return swiper;
    }
}
