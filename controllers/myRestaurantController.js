import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const getRestaurant = async (req, res) => {
  if (req.userId === undefined)
    return res.status(400).json({
      message: "Error userId",
    });

  const userId = req.userId;

  const restaurant = await Restaurant.findOne({ user: userId });
  if (!restaurant) {
    return res.status(204).json({
      message: `No Restaurant matches userId ${req.userId}.`,
    });
  }

  //console.log(findRestaurant);
  restaurant.imageUrl =
    process.env.VITE_API_BASE_URL + "//uploads/" + restaurant.imageUrl;

  res.status(200).json(restaurant);
};

const createRestaurant = async (req, res) => {
  if (req.userId === undefined)
    return res.status(400).json({
      message: "Error userId",
    });

  const userId = req.userId;

  try {
    const existingRestaurant = await Restaurant.findOne({ user: userId });
    if (existingRestaurant) {
      return res
        .status(409)
        .json({ message: "User restaurant already exists" });
    }

    const {
      restaurantName,
      city,
      country,
      deliveryPrice,
      estimatedDeliveryTime,
      cuisines,
      menuItems,
    } = req.body;

    const file = req.files.imageFile[0];
    const fsPromises = fs.promises;
    const filename = "imageFile-" + Date.now();
    const extname = file.originalname.slice(
      file.originalname.lastIndexOf(".") + 1
    );
    const filefullname = filename + "." + extname;
    await fsPromises.writeFile(
      path.join("./public/uploads", filefullname),
      file.buffer
    );

    const restaurant = new Restaurant();
    restaurant.restaurantName = restaurantName;
    restaurant.city = city;
    restaurant.country = country;
    restaurant.deliveryPrice = Number(deliveryPrice);
    restaurant.estimatedDeliveryTime = Number(estimatedDeliveryTime);

    restaurant.cuisines = cuisines;
    restaurant.menuItems = menuItems.map((item) => ({
      ...item,
      _id: mongoose.Types.ObjectId(),
    }));

    restaurant.imageUrl = filefullname;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();

    await restaurant.save();
    restaurant.imageUrl =
      process.env.VITE_API_BASE_URL + "//uploads/" + restaurant.imageUrl;
    res.status(201).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const editRestaurant = async (req, res) => {
  console.log("editRestaurant");
  if (req.userId === undefined)
    return res.status(400).json({
      message: "Error userId",
    });

  const userId = req.userId;

  try {
    const restaurant = await Restaurant.findOne({ user: userId });
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    const {
      restaurantName,
      city,
      country,
      deliveryPrice,
      estimatedDeliveryTime,
      cuisines,
      menuItems,
    } = req.body;

    restaurant.restaurantName = restaurantName;
    restaurant.city = city;
    restaurant.country = country;
    restaurant.deliveryPrice = Number(deliveryPrice);
    restaurant.estimatedDeliveryTime = Number(estimatedDeliveryTime);

    restaurant.cuisines = cuisines;

    const existingMenuItem = restaurant.menuItems.filter((menuItem) =>
      menuItems.map((item) => item._id).includes(menuItem._id.toHexString())
    );
    const deletedMenuItem = restaurant.menuItems.filter(
      (menuItem) =>
        !menuItems.map((item) => item._id).includes(menuItem._id.toHexString())
    );
    const addMenuItem = menuItems.filter((menuItem) => menuItem._id === "");

    console.log(
      "existingMenuItem",
      existingMenuItem,
      "deletedMenuItem",
      deletedMenuItem,
      "addMenuItem",
      addMenuItem
    );
    //restaurant.menuItems.remove(deletedMenuItem);
    //restaurant.menuItems.push(addMenuItem);

    restaurant.menuItems = menuItems.map((item) => ({
      _id: item._id
        ? new mongoose.Types.ObjectId(item._id)
        : mongoose.Types.ObjectId(),
      name: item.name,
      price: item.price,
    }));

    if (req.files.imageFile) {
      const file = req.files.imageFile[0];
      const fsPromises = fs.promises;
      const filename = "imageFile-" + Date.now();
      const extname = file.originalname.slice(
        file.originalname.lastIndexOf(".") + 1
      );
      const filefullname = filename + "." + extname;
      await fsPromises.writeFile(
        path.join("./public/uploads", filefullname),
        file.buffer
      );
      restaurant.imageUrl = filefullname;
    }

    restaurant.lastUpdated = new Date();

    await restaurant.save();
    restaurant.imageUrl =
      process.env.VITE_API_BASE_URL + "//uploads/" + restaurant.imageUrl;

    res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }
    const orders = await Order.aggregate([
      { $match: { restaurant: new mongoose.Types.ObjectId(restaurant._id) } },
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
                process.env.VITE_API_BASE_URL + "//uploads/",
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

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    const restaurant = await Restaurant.findById(order.restaurant);

    if (restaurant?.user?._id.toString() !== req.userId) {
      return res.status(401).send();
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unable to update order status" });
  }
};

export default {
  createRestaurant,
  getRestaurant,
  editRestaurant,
  getRestaurantOrders,
  updateOrderStatus,
};
