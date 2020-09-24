const Exchange = require('../lib/index')

test('crud', () => {
    let exchange = new Exchange()
    let order = exchange.buy(10, 2)

    expect(order.id).toBe(1)
    expect(order.executedQuantity).toBe(0)
    expect(exchange.getQuantityAtPrice(2)).toBe(10)

    exchange.buy(5, 3)
    exchange.sell(50, 8)
    exchange.sell(5, 12)

    order = exchange.buy(51, 9)
    expect(order.id).toBe(5)
    expect(order.executedQuantity).toBe(50)

    exchange.sell(10, 12)
    exchange.sell(1, 12)
    exchange.sell(2, 12)

    expect(JSON.stringify(exchange)).toBe(`{"store":{"id":8,"buyOrders":[{"id":5,"isBuyOrder":true,"quantity":51,"price":9,"executedQuantity":50},{"id":2,"isBuyOrder":true,"quantity":5,"price":3,"executedQuantity":0},{"id":1,"isBuyOrder":true,"quantity":10,"price":2,"executedQuantity":0}],"sellOrders":[{"id":3,"isBuyOrder":false,"quantity":50,"price":8,"executedQuantity":50},{"id":4,"isBuyOrder":false,"quantity":5,"price":12,"executedQuantity":0},{"id":6,"isBuyOrder":false,"quantity":10,"price":12,"executedQuantity":0},{"id":7,"isBuyOrder":false,"quantity":1,"price":12,"executedQuantity":0},{"id":8,"isBuyOrder":false,"quantity":2,"price":12,"executedQuantity":0}],"priceQty":{"2":-10,"3":-5,"8":0,"9":-1,"12":18},"orders":[{"id":1,"isBuyOrder":true,"quantity":10,"price":2,"executedQuantity":0},{"id":2,"isBuyOrder":true,"quantity":5,"price":3,"executedQuantity":0},{"id":3,"isBuyOrder":false,"quantity":50,"price":8,"executedQuantity":50},{"id":4,"isBuyOrder":false,"quantity":5,"price":12,"executedQuantity":0},{"id":5,"isBuyOrder":true,"quantity":51,"price":9,"executedQuantity":50},{"id":6,"isBuyOrder":false,"quantity":10,"price":12,"executedQuantity":0},{"id":7,"isBuyOrder":false,"quantity":1,"price":12,"executedQuantity":0},{"id":8,"isBuyOrder":false,"quantity":2,"price":12,"executedQuantity":0}]}}`)
    exchange.buy(15, 13)
    expect(exchange.getQuantityAtPrice(12)).toBe(3)
    expect(exchange.getQuantityAtPrice(13)).toBe(0)
})

test('init', () => {
    let exchange = new Exchange()
    exchange.buy(10, 2)
    exchange.buy(5, 3)
    exchange.sell(50, 8)
    exchange.sell(5, 12)
    exchange.buy(51, 9)
    exchange.sell(10, 12)
    exchange.sell(1, 12)
    exchange.sell(2, 12)
    exchange.buy(15, 13)

    let exchange1 = new Exchange()
    exchange1.sync('test/data')

    expect(JSON.stringify(exchange)).toBe(JSON.stringify(exchange1))

})


test('getOrder', ()=> {
    let exchange = new Exchange()
    exchange.sync('test/data')
    let order = exchange.getOrder(1)
    expect(order.id).toBe(1)
    expect(order.quantity).toBe(10)

    order = exchange.getOrder(3)
    expect(order.id).toBe(3)
    expect(order.quantity).toBe(50)

    order = exchange.getOrder(9)
    expect(order.id).toBe(9)
    expect(order.quantity).toBe(15)

    order = exchange.getOrder(10)
    expect(order).toBe(null)

    order = exchange.getOrder(0)
    expect(order).toBe(null)
})