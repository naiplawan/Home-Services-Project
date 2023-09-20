import { Router } from "express";
import supabase from "../utils/supabase.js";
import multer from "multer";

const serviceRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API route to service listing page
serviceRouter.get("/", async (req, res) => {
  
  const keywords = req.query.keywords || "";
  const categoryFilter = req.query.categoryFilter || "";
  const maxPriceFilter = req.query.maxPriceFilter || Number.MAX_SAFE_INTEGER;
  const minPriceFilter = req.query.minPriceFilter || 0;
  const orderFilter = req.query.orderFilter || "";

  try {
    const data = await supabase.from("service").select("*, sub_service(*), category(*)");
    return res.json({
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

//API route to one service item page
serviceRouter.get("/:id", async (req, res) => {
  const serviceId = req.params.id;

  try {
    const { data, error } = await supabase
      .from("service")
      .select("*")
      .eq("service_id", serviceId);

    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Error fetching data from Supabase" });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }

    return res.status(200).json({ data: data[0] }); // Return the first (and only) result
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

serviceRouter.post("/", upload.single("file"), async (req, res) => {
  try {

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newServiceItem = {
      service_name: req.body.service_name,
      category_id: req.body.category_id,
      service_photo: file.originalname,
      service_created_date: new Date(),
      service_edited_date: new Date(),
    };

    console.log(newServiceItem);

    const uploadResult = await supabase.storage
      .from("home_service")
      .upload(`service_photo/${Date.now()}${file.originalname}`, file.buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.mimetype,
      });
      console.log('uploadresult', uploadResult)

      if (!uploadResult.error) {
        // Get public URL for the uploaded file
        const servicePhotourl =  `https://tqjclbmprqjrgdrvylqd.supabase.co/storage/v1/object/public/home_service/${uploadResult.data.path}`;
        console.log(uploadResult.data.path);

      
        // Assign the URL directly to service_photo
        newServiceItem["service_photo"] = servicePhotourl;
      } else {
        console.error("Error uploading file to Supabase storage", uploadResult.error);
        return res.status(500).json({ message: "Error uploading file to Supabase storage" });
      }

    console.log(newServiceItem["service_photo"]);
    console.log({ uploadResult: uploadResult });

    const { data: serviceData, error: serviceError } = await supabase
      .from("service")
      .insert([newServiceItem]);

    if (serviceError) {
      console.error("Error inserting data to Supabase", serviceError);
      return res
        .status(500)
        .json({ message: "Error inserting data to Supabase" });
    }

    const { data: latestService } = await supabase
      .from("service")
      .select("service_id")
      .order("service_id", { ascending: false })
      .limit(1);

    const service_id = latestService[0].service_id;

    for (const subServiceItem of subServiceItems) {
      subServiceItem.service_id = service_id; // Add service_id to each subServiceItem
    }

    if (!service_id) {
      console.error("Failed to retrieve service_id from database");
      return res
        .status(500)
        .json({ message: "Failed to retrieve service_id from database" });
    }

    // Insert sub-services
    const { data: insertedSubserviceData, error: subServiceError } =
      await supabase.from("sub_service").insert(subServiceItems);

    if (subServiceError) {
      console.error(
        "Error inserting sub_service data to Supabase",
        subServiceError
      );

      return res
        .status(500)
        .json({
          message: "Error inserting sub_service data to Supabase",
        });
    }

    return res.status(200).send("Service DATA uploaded successfully");
  } catch (error) {
    console.error("Error on DATA uploading", error);
    return res.status(500).json({ message: "Can't upload file to Supabase" });
  }
});

//API ROUTE to delete exisitng service item
serviceRouter.delete("/:id", async (req, res) => {

  try {
    const serviceId = req.params.id;

    const { data, error } = await supabase
      .from("service")
      .delete()
      .eq("service_id", serviceId);

    if (error) {
      return res.status(500).json({ error: "ไม่สามารถลบได้" });
    }

    if (data && data.length === 0) {
      return res
        .status(404)
        .json({ error: `ไม่พบรายการที่ตรงกับ ${serviceId}` });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "ไม่สามารถลบได้" });
  }
});


export default serviceRouter;
