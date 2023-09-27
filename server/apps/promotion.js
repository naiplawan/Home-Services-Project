import { Router } from "express";
import supabase from "../utils/supabase.js";
// import multer from "multer";

const promotionRouter = Router();

// const multer = require("multer");
// const upload = multer();

promotionRouter.get("/", async (req, res) => {
  try {
    const { keyword } = req.query;
    let data = await supabase.from("promotion").select("*");
    if (keyword) {
      data = data.filter((promo) => promo.promotion_code === keyword);
    }
    return res.json({
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ดู promotion แบบเจาะจง id
promotionRouter.get("/:id", async (req, res) => {
  try {
    const promotionId = req.params.id;

    const { data, error } = await supabase
      .from("promotion")
      .select("*")
      .eq("promotion_id", promotionId);

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

promotionRouter.post("/", async (req, res) => {
  try {
    const {
      promotion_code,
      promotion_types,
      promotion_quota,
      promotion_discount,
      promotion_expiry_date,
      promotion_expiry_time,
    } = req.body;

    console.log(req.body);

    const formattedExpiryDate = new Date(req.body.promotion_expiry_date[1]);
    const formattedExpiryDateAsString = formattedExpiryDate
      .toISOString()
      .split("T")[0];
    const formattedExpiryTime = req.body.promotion_expiry_time[1];

    //item

    const promotionItem = {
      promotion_code,
      promotion_types,
      promotion_quota,
      promotion_expiry_date,
      promotion_expiry_time,
    };

    // Get current date and time
    const currentDateTime = new Date();

    console.log(
      promotion_code,
      promotion_types,
      promotion_quota,
      promotion_discount
    );

    // Insert data into Supabase table
    const { data, error } = await supabase.from("promotion").insert([
      {
        promotion_code,
        promotion_types,
        promotion_quota,
        promotion_discount,
        promotion_expiry_date: formattedExpiryDateAsString,
        promotion_expiry_time: formattedExpiryTime,
        promotion_created_date_time: currentDateTime,
        promotion_edited_date_time: currentDateTime,
      },
    ]);

    if (error) {
      throw error;
    }

    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

promotionRouter.delete("/:id", async (req, res) => {
  try {
    const promotionId = req.params.id;

    const { data, error } = await supabase
      .from("promotion")
      .delete()
      .eq("promotion_id", promotionId);

    if (error) {
      return res.status(500).json({ error: "ไม่สามารถลบได้" });
    }

    if (data && data.length === 0) {
      return res
        .status(404)
        .json({ error: `ไม่พบรายการที่ตรงกับ ${promotionId}` });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "ไม่สามารถลบได้" });
  }
});

export default promotionRouter;

// promotionRouter.put("/:id", async (req, res) => {
//   try {
//     const promotionId = req.params.id;

//     // Extract the fields you want to update from the request body
//     const {
//       promotion_code,
//       promotion_types,
//       promotion_quota,
//       promotion_discount,
//       promotion_expiry_date,
//       promotion_expiry_time,
//     } = req.body;

//     // Update the fields in the Supabase table
//     const { data, error } = await supabase
//       .from("promotion")
//       .update({
//         promotion_code,
//         promotion_types,
//         promotion_quota,
//         promotion_discount,
//         promotion_expiry_date,
//         promotion_expiry_time,
//       })
//       .eq("promotion_id", promotionId);

//     if (error) {
//       throw error;
//     }

//     // Check if any rows were updated
//     if (data && data.length === 0) {
//       return res
//         .status(404)
//         .json({ error: `No promotion with ID ${promotionId} found.` });
//     }

//     return res.status(200).json({ success: true, data });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// });