import Restaurant from "../models/Restaurant.js";

const getRestaurant = async (req, res) => {
  if (req.params.restaurantId === undefined)
    return res.status(400).json({
      message: "Error restaurantId",
    });

  const restaurantId = req.params.restaurantId;

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }
    restaurant.imageUrl =
    process.env.VITE_API_BASE_URL + "//uploads/" + restaurant.imageUrl;
    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const searchRestaurant = async (req, res) => {
  try {
    const city = req.params.city;
    const searchQuery = req.query.searchQuery ?? "";
    const selectedCuisines = req.query.selectedCuisines ?? "";
    const sortOption = req.query.sortOption ?? "lastUpdated";
    const page = parseInt(req.query.page ?? "1");
    const pageSize = parseInt(req.query.pageSize ?? "10");

    let query = {};

    query["city"] = new RegExp(city, "i");
    const cityCheck = await Restaurant.countDocuments(query);

    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
      query["cuisines"] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: { $regex: searchRegex } },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const skip = (page - 1) * pageSize;

    // sortOption = "lastUpdated"
    const restaurants = await Restaurant.aggregate([
      { $match: query },
      { $sort: { [sortOption]: 1 } },
      { $skip: skip },
      { $limit: pageSize },
      {
        $project: {
          _id: 1,
          user: 1,
          restaurantName: 1,
          city: 1,
          country: 1,
          deliveryPrice: 1,
          estimatedDeliveryTime: 1,
          cuisines: 1,
          menuItems: 1,
          imageUrl: {
            $concat: [ process.env.VITE_API_BASE_URL + "//uploads/" , "$imageUrl"],
          },
        },
      },
    ]);

    const total = await Restaurant.countDocuments(query);

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };

    console.log(response.pagination.total);

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default { getRestaurant, searchRestaurant };
