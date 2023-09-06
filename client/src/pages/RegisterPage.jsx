import { Button, Form, Input, Checkbox, message } from "antd";
import Navbar from "/src/components/NavBar.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import { useAuth } from "../contexts/authentication.jsx";
import axios from "axios";

function RegisterPage() {
  // const { register } = useAuth();
  const navigate = useNavigate();

  const layout = {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const inputStyle =
    "border rounded-lg border-gray-300 w-full h-11 px-4 py-2.5";

  const formStyle = {
    display: "flex",
    width: "440px",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4px",
  };

  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values) => {
    if (!isSubmitting) {
      try {
        setIsSubmitting(true);
        console.log(values);

        const data = {
          fullName: values.fullName, // Access the field directly by its name
          phoneNumber: values.phoneNumber,
          email: values.email,
          password: values.password,
          role: "customer",
        };

        // Debugging: Log the data being sent to the API
        console.log("Data sent to API:", data);

        const response = await axios.post("http://localhost:4000/auth/register", data);

        // Debugging: Log the entire response from the API
        console.log("API Response:", response);

        if (response.status === 200) {
          message.success("ลงทะเบียนสำเร็จ");
        } else {
          message.error("ลงทะเบียนล้มเหลว");
        }
      } catch (error) {
        console.error(error);
        message.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex w-1440px min-h-screen justify-center bg-bg ">
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          className="border border-grey300 bg-white mt-12 h-[50%] p-20 pt-12 rounded-lg"
        >
          {/* Name */}
          <h1 className="text-blue950 text-center text-[30px] prompt font-bold">
            ลงทะเบียน
          </h1>

          <Form.Item
            className="flex flex-col mt-5"
            name="fullName"
            style={{
              formStyle,
            }}
            rules={[
              {
                required: true,
                message: "กรุณากรอกชื่อ-นามสกุล",
              },
              {
                validator: (rule, value) => {
                  if (!/^[-a-zA-Z'.ก-๙\s]+$/.test(value)) {
                    return Promise.reject("กรุณากรอกชื่อ นามสกุลให้ถูกต้อง");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <div className="prompt">
            ชื่อ-นามสกุล 
              </div>
            <Input
              className="w-[400px]"
              placeholder="กรุณากรอกชื่อ - นามสกุล"
              
            />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item
            className="mt-5"
            name="phoneNumber"
            style={{
              formStyle,
            }}
            rules={[
              {
                required: true,
                message: "กรุณากรอกเบอร์โทรศัพท์",
              },
              {
                validator: (rule, value) => {
                  if (!/^0[6-9]{1}[0-9]{8}$/.test(value)) {
                    return Promise.reject("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <div className="prompt">
            เบอร์โทรศัพท์
              </div>
            <Input
              className="w-[400px]"
              placeholder="กรุณากรอกเบอร์โทรศัพท์"
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            className="mt-5"
            name="email"
            style={{
              formStyle,
            }}
            rules={[
              {
                type: "email",
                message: "กรุณากรอกอีเมลให้ถูกต้อง",
              },
              {
                required: true,
                message: "กรุณากรอกอีเมล",
              },
              {
                validator: (rule, value) => {
                  if (
                    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/i.test(
                      value
                    )
                  ) {
                    return Promise.reject(
                      "กรุณากรอกอีเมลให้ถูกต้อง (email-validator)"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <div className="prompt">
            อีเมล
              </div>
            <Input className="w-[400px]" placeholder="กรุณากรอกอีเมล" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            className="mt-5"
            name="password"
            style={{
              formStyle,
            }}
            rules={[
              {
                required: true,
                message: "กรุณากรอกรหัสผ่าน",
              },
              {
                validator: (rule, value) => {
                  if (
                    !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(
                      value
                    )
                  ) {
                    return Promise.reject("กรุณากรอกรหัสผ่านให้ถูกต้อง");
                  }
                  if (!/[A-Z]/.test(value)) {
                    return Promise.reject("ต้องมี Uppercase อย่างน้อย 1 ตัว");
                  }
                  if (!/[a-z]/.test(value)) {
                    return Promise.reject("ต้องมี Lowercase อย่างน้อย 1 ตัว");
                  }
                  if (!/[0-9]/.test(value)) {
                    return Promise.reject("ต้องมีตัวเลขอย่างน้อย 1 ตัว");
                  }
                  if (!/[!@#$%^&*]/.test(value)) {
                    return Promise.reject("ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว");
                  }
                  if (value.length < 8) {
                    return Promise.reject("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <div className="prompt">
            รหัสผ่าน
              </div>
            <Input.Password
              className="w-[400px]"
              placeholder="กรุณากรอกรหัสผ่าน"
            />
          </Form.Item>

          {/* Accept Terms and Conditions */}
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 3 }}>
            <div className="mt-5">
              <label className="flex items-center">
                <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
                <span className="ml-2">
                  ยอมรับ{" "}
                  <a href="#" className="underline text-blue500">
                    ข้อตกลงและเงื่อนไข
                  </a>{" "}
                  และ{" "}
                  <a href="#" className="underline text-blue500">
                    นโยบายความเป็นส่วนตัว
                  </a>
                </span>
              </label>
            </div>

            <Button
              className={`btn-blue-950 w-full my-5 ${
                !isChecked || isSubmitting
                  ? "disabled:opacity-50 cursor-not-allowed"
                  : ""
              }`}
              htmlType="submit"
              disabled={!isChecked || isSubmitting}
            >
              {isSubmitting ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
            </Button>
            <div className="text-center text-blue500 underline">
              <a className="btn-ghost" onClick={() => navigate("/login")}>
                กลับไปหน้าเข้าสู่ระบบ
              </a>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
