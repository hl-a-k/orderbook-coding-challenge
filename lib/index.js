const fs = require('fs')

class Exchange {
  constructor() {
    this.store = {
        id: 0,
        buyOrders:[],
        sellOrders:[],
        priceQty:{},
        orders: []
    }
  }

  setPriceQty(price, qty) {
      let _qty = this.store.priceQty[price]
      if(_qty === undefined) {
          _qty = 0
      }
      _qty += qty
      this.store.priceQty[price] = _qty

  }

  sync(fileName) {
      let data = fs.readFileSync(fileName, 'utf8')
      this.store = JSON.parse(data).store
  }

  buy(quantity, price) {
      let order = {
          id: 1 + this.store.id++,
          isBuyOrder: true,
          quantity,
          price,
          executedQuantity:0
      }

      this.setPriceQty(price, -quantity)

      for(let i=0; i<this.store.sellOrders.length; i++) {
          let sellOrder = this.store.sellOrders[i];
          if(sellOrder.price>price) {
              break;
          }
          let minQty = Math.min(order.quantity - order.executedQuantity, sellOrder.quantity - sellOrder.executedQuantity)
          order.executedQuantity += minQty
          sellOrder.executedQuantity += minQty

          this.setPriceQty(price, minQty)
          this.setPriceQty(sellOrder.price, -minQty)
      }
      let i = 0;
      for(; i<this.store.buyOrders.length;i++){
          if(price > this.store.buyOrders[i].price){
              break
          }
      }


      this.store.buyOrders.splice(i,0,order);
      this.store.orders.push(order)
      return  order
  }

  sell(quantity, price) {
      let order = {
          id: 1 + this.store.id++,
          isBuyOrder: false,
          quantity,
          price,
          executedQuantity:0
      }

      this.setPriceQty(price, quantity)

      for(let i=0; i<this.store.buyOrders.length; i++) {
          let buyOrder = this.store.buyOrders[i];
          if(buyOrder.price<price) {
              break;
          }
          let minQty = Math.min(order.quantity - order.executedQuantity, buyOrder.quantity - buyOrder.executedQuantity)
          order.executedQuantity += minQty
          buyOrder.executedQuantity += minQty


          this.setPriceQty(price, -minQty)
          this.setPriceQty(buyOrder.price, minQty)
      }
      let i = 0;
      for(; i<this.store.sellOrders.length;i++){
          if(price < this.store.sellOrders[i].price){
              break
          }
      }

      this.store.sellOrders.splice(i,0,order);
      this.store.orders.push(order)
      return  order
  }

  getQuantityAtPrice(price) {
      let qty = this.store.priceQty[price] || 0
      return Math.abs(qty)
  }

  getOrder(id) {
      if(id > this.store.id || id <= 0)
          return null
      return this.store.orders[id - 1]
  }
}

module.exports = Exchange;
