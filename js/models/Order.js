export class Order {
    constructor(firstName, lastName, email, phoneNumber, address, house, order) {
        this.firstName = firstName || '';
        this.lastName = lastName || '';
        this.email = email || '';
        this.phoneNumber = phoneNumber || '';
        this.address = address || '';
        this.house = house || '';
        this.order = order || '';
    }
    /** Completar setters... */

    setOrder = () => {
        this.orderMessage = `*Cliente*: _${this.firstName}_ _${this.lastName}_%0A *Email*: ${this.email}%0A *Cel*: ${this.phone}%0A *Domicilio*: ${this.address} ${this.house}%0A *Pedido*: ${this.order}`
    }
}