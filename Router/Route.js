export default class Route {
    constructor(url, title, pathHtml, PathJS = "") {
        this.url = url;
        this.title = title;
        this.pathHtml = pathHtml;
        this.pathJS = PathJS;
    }
}