import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";
import mongoose from "mongoose";

const getMyOrders = async (req, res) => {
  try {
    let qry = {};
    qry["status"] = "paid";
    const orders = await Order.aggregate([
      //{ $match: qry },
      { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurant",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$restaurant",
      },
      {
        $unwind: "$user",
      },
      {
        $addFields: {
          restaurant: {
            imageUrl: {
              $concat: [
                "http://localhost:3800//uploads/",
                "$restaurant.imageUrl",
              ],
            },
          },
        },
      },
    ]);

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const stripeWebhookHandler = async (req, res) => {
  console.log("stripeWebhookHandler");
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
    for (let i = 0; i < checkoutSessionRequest.cartItems.length; i++) {
      const mitem = restaurant.menuItems.find(
        (x) =>
          checkoutSessionRequest.cartItems[i].menuItemId === x._id.toHexString()
      );

    
      totalPrice +=
        parseFloat(mitem.price) * checkoutSessionRequest.cartItems[i].quantity;
    }

 
    let totalWithDelivery = totalPrice;
    if (restaurant?.deliveryPrice) {
      totalWithDelivery += parseFloat(restaurant.deliveryPrice);
    }

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
