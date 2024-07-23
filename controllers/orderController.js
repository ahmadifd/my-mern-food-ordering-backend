import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const stripeWebhookHandler = async (req, res) => {
  console.log('stripeWebhookHandler');
  const { orderId, totalPrice } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.totalAmount = totalPrice;
  order.status = "paid";

  await order.save();

  res.status(200).send();
};

const createCheckoutSession = async (req, res) => {
  console.log("createCheckoutSession");
  try {
    const checkoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      createdAt: new Date(),
    });

    let totalPrice = 0;
    for (let i = 0; i < restaurant.menuItems.length; i++) {
      const cartitem = checkoutSessionRequest.cartItems.find(
        (x) => x.menuItemId === restaurant.menuItems[i]._id.toHexString()
      );

      totalPrice +=
        parseFloat(cartitem.quantity) * restaurant.menuItems[i].price;
    }

    let totalWithDelivery = totalPrice;
    if (restaurant?.deliveryPrice) {
      totalWithDelivery += parseFloat(restaurant.deliveryPrice);
    }

    console.log(totalWithDelivery);

    const order = await newOrder.save();
    res.json({
      url: `http://localhost:5075/pay-page/${order._id}?totalPrice=${totalWithDelivery}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export default {
  getMyOrders,
  createCheckoutSession,
  stripeWebhookHandler,
};
