import Restaurant from "../models/Restaurant.js";
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
  restaurant.imageUrl = "http://localhost:3800//uploads/" + restaurant.imageUrl;
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
    restaurant.menuItems = menuItems;

    restaurant.imageUrl = filefullname;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();

    await restaurant.save();
    restaurant.imageUrl =
      "http://localhost:3800//uploads/" + restaurant.imageUrl;
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
    restaurant.menuItems = menuItems;

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
      "http://localhost:3800//uploads/" + restaurant.imageUrl;

    res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default { createRestaurant, getRestaurant, editRestaurant };
