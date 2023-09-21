import {
  Form,
  Input,
  Upload,
  Select,
  message,
  InputNumber,
  Image,
  Button,
  Modal
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import arrow from "../../assets/AdminPhoto/arrow.png";

function ServiceEditForm() {
  //render component and package area
  const navigate = useNavigate();
  const params = useParams();
  const { Dragger } = Upload;

  //state for category
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("เลือกหมวดหมู่");


  //state for all
  const [data, setData] = useState([]);

  //state for sub_category
  const [service, setService] = useState([]);

  //state for name
  const [editableServiceName, setEditableServiceName] = useState(
    service.service_name
  );

   //state for sub_service
   const [subService, serSubService] = useState([])

    //state for image
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [currentImage, setCurrentImage] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false);

 

  const handleFileChange = (file) => {

    console.log('file', file)
    const reader = new FileReader();

    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };

    reader.readAsDataURL(file);
    return false;
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setCurrentImage(null)
  };

  const handleOk = () => {
    setIsModalVisible(false);
 };

 const handleCancel = () => {
    setIsModalVisible(false);
 };


  // const handleInputChange = (e) => {
  //   const { key, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [key]: value,
  //   });
  // };

  // function area

  // fetch data area

  // const getCategory = async () => {
  //   const result = await axios("http://localhost:4000/category");
  //   setCategory(result.data.data);
  //   console.log("category", result.data.data);
  // };

  console.log(category.data); // array of object

  const getService = async (serviceId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/service/${serviceId}`
      );
      setService(response.data.data);
      setEditableServiceName(response.data.data.service_name);
      setData(response.data.data)
      setCurrentImage(response.data.data.service_photo)
      console.log('what is this', response.data.data);
      // setSelectedImage(response.data.image_url);
      // setFileList([
      //   {
      //     uid: "-1",
      //     name: "image.png",
      //     status: "done",
      //     url: response.data.image_url,
      //   },
      // ]);
    } catch (error) {
      console.error("Error fetching service data:", error);
    }
  };

  console.log(currentImage)

  // put data API area
  const handleSubmitEdit = async (values) => {
    try {
      const selectedCategoryId = category.find(
        (categoryItem) => categoryItem.category_name === selectedCategory
      )?.category_id;

      const formData = new FormData();
      formData.append("service_name", values.service_name);
      formData.append("category_id", selectedCategoryId);
      formData.append("file", fileList[0]);

      values.items.forEach((item, index) => {
        formData.append(
          "items",
          JSON.stringify({
            sub_service_name: item.name,
            unit: item.unit,
            price_per_unit: item.cost,
          })
        );
      });

      const response = await axios.put(
        `http://localhost:4000/service/${params.serviceId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        message.success("Successfully update service");
      } else {
        message.error("Cannot update service");
      }
      navigate("/admin-service");
    } catch (error) {
      console.error(error);
      message.error("Error updating service");
    }
  };

 

  // use effect
  // get category to map
  useEffect(() => {
    axios
      .get("http://localhost:4000/category")
      .then((response) => {
        setData(response.data.data); // Store data in state
        setCategory(response.data.data);
        console.log(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    getService(params.serviceId);
  }, [params.serviceId]);

  console.log('all data', data)

  return (
    <>
      <Form
        labelCol={{ span: 100 }}
        wrapperCol={{ span: 24 }}
        layout="horizontal"
        onFinish={handleSubmitEdit}
      >
        <div className="bg-grey100 h-full pb-4% md:pb-0 md:pl-60">
          {/* header */}
          <div key={service.service_id}>
            <div className="header-detail justify-between  flex items-center h-20 px-10 mt-0 pt-[20px] py-[10px] w-[100%] bg-white  text-grey600 pb-[20px] border-b border-grey300">
              <div className="flex gap-[14px] h-12 w-fit">
                <img
                  src={arrow}
                  className=" h-[40px] w-[40px] cursor-pointer hover:scale-110 transition"
                  onClick={() => navigate("/admin-service")}
                />
                <div className="Header-name">
                  <p className="service-text text-xs">บริการ</p>
                  <h1
                    name={service.serviceDetail}
                    className="text-black   font-semibold text-xl"
                  >
                    {service.service_name}
                  </h1>
                </div>
              </div>
              <div className="flex">
                <button
                  className="btn-secondary flex items-center justify-center text-base font-medium w-28 h-11"
                  onClick={() => navigate("/admin-service")}
                >
                  ยกเลิก
                </button>
                <button
                  className="btn-primary flex items-center justify-center ml-6 text-base font-medium w-28 h-11"
                  type="submit"
                >
                  ยืนยัน
                </button>
              </div>
            </div>
            {/* content */}
            <div className="bg-white mx-10 mt-10 p-6 border border-grey200 rounded-lg">
              <Form.Item
                label="ชื่อบริการ"
                rules={[
                  {
                    required: true,
                    message: "โปรดกรอกชื่อบริการ",
                  },
                ]}
              >
                <Input
                  style={{ width: "50%" }}
                  name="service_name"
                  type="text"
                  required
                  value={editableServiceName}
                  onChange={(e) => setEditableServiceName(e.target.value)}
                />
              </Form.Item>

              <Form.Item label={<span>หมวดหมู่</span>} colon={false}>
                <Select
                 value={
                 selectedCategory
                }
                  style={{ width: "50%" }}
                  onChange={(value) => setSelectedCategory(value)}
                >
                  {data &&
                    data.data &&
                    data.data.map((categoryItem) => (
                      <Select.Option
                        key={categoryItem.category_id}
                        value={categoryItem.category_name}
                      >
                        {categoryItem.category_name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <div className="h-40 w-8/12 pr-16 mb-10 flex justify-between ">
                <div className="text-grey700 w-52 text-base font-medium ">
                  รูปภาพ
                </div>
               
                <div className="w-3/4 h-40 relative">
                <img src={currentImage}/>
                  <Upload.Dragger
                    name="file"
                    accept=".png,.jpg,.jpeg"
                    beforeUpload={(file) => {
                      setFileList([file]);
                      handleFileChange(file);
                      return false;
                    }}
                    maxFileSize={5 * 1024 * 1024}
                    showUploadList={false}
                    className="relative"
                    // disabled={selectedImage===null}
                  >
                    
                    {selectedImage && (
                      <div>
                        <Image src={service.service_photo} alt="uploaded" width={144} />
                       
                      </div>
                    )}
                    <div>
                      {!selectedImage && (
                        <>
                          <InboxOutlined style={{ fontSize: "36px" }} />
                          <p className="ant-upload-text">อัพโหลดรูปภาพ</p>
                          <p className="ant-upload-hint">
                            PNG, JPG ขนาดไม่เกิน 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </Upload.Dragger>
                  <div className="text-grey700 text-xs z-0 mt-1">
                    ขนาดภาพที่แนะนำ: 1440 x 225 PX
                    <span> <Button onClick={handleDeleteImage}>Delete</Button></span>
                  </div>
                </div>
                
              </div>

              <hr className="mb-10 text-grey300 "></hr>

              <div className="mb-10 text-grey700 text-base font-medium ">
                รายการบริการย่อย
              </div>
              <Form.List name="items">
                {(fields, { add, remove }) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {fields.map((field) => (
                      <div
                        key={field.key}
                        style={{ display: "flex", gap: "16px" }}
                      >
                        <div style={{ flex: "1" }}>
                          <Form.Item
                            colon={false}
                            label="ชื่อรายการ"
                            name={[field.name, "name"]}
                            labelAlign="top"
                            labelCol={{ span: 24 }}
                          >
                            <Input
                              name="sub_service_name"

                              // value={formData.sub_service_name}
                              // onChange={handleChange}
                            />
                          </Form.Item>
                        </div>
                        <div style={{ flex: "1" }}>
                          <Form.Item
                            colon={false}
                            label="ค่าบริการ / 1 หน่วย"
                            name={[field.name, "cost"]}
                            labelAlign="top"
                            labelCol={{ span: 24 }}
                          >
                            <InputNumber
                              formatter={(value) =>
                                `฿ ${value}`.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ","
                                )
                              }
                              parser={(value) =>
                                value.replace(/฿\s?|(,*)/g, "")
                              }
                              name="price_per_unit"
                              // value={formData.price_per_unit}
                              // onChange={(value) =>
                              //   setFormData({
                              //     ...formData,
                              //     price_per_unit: value,
                              //   })
                              // }
                            />
                          </Form.Item>
                        </div>
                        <div style={{ flex: "1" }}>
                          <Form.Item
                            colon={false}
                            label="หน่วยการบริการ"
                            name={[field.name, "unit"]}
                            labelAlign="top"
                            labelCol={{ span: 24 }}
                          >
                            <Input
                              name="unit"
                              // value={formData.unit}
                              // onChange={handleChange}
                            />
                          </Form.Item>
                        </div>
                        <div
                          style={{
                            flex: "1",
                            display: "flex",
                            alignItems: "flex-end",
                          }}
                        >
                          <Form.Item colon={false} label="">
                            <a
                              onClick={() => {
                                remove(field.name);
                              }}
                            >
                              ลบรายการ
                            </a>
                          </Form.Item>
                        </div>
                      </div>
                    ))}

                    <button
                      className="btn-secondary flex items-center justify-center text-base font-medium w-56 h-11"
                      type="button"
                      onClick={() => add()}
                    >
                      + เพิ่มรายการ
                    </button>
                  </div>
                )}
              </Form.List>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}

export default ServiceEditForm;
