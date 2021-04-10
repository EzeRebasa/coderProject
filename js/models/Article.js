export class Article {

    constructor(id, category, name, size, price) {
        this.id = id;
        this.category = category;
        this.name = name;
        this.size = size;
        this.price = price;
        this.fullPrice = this.price;
    }
}