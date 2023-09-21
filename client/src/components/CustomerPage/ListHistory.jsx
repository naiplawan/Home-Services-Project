import image from "../../assets/CustomerPhoto/imageIndex.js";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// import Moment from "react-moment";

function ListHistory () {
    const params = useParams();
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getOrderHistoryById(params.userId);
    }, [])

    const getOrderHistoryById = async (userId) => {
        try {
            setLoading(true);
            const result = await axios.get(
                `http://localhost:4000/orderHistory/${userId}`
            );
            setOrder(result.data.result);
            setLoading(false);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    if (loading) {
        return (<div>Loading...</div>);
    }
    console.log(order)
   

    return (
        <div className="flex-col">
            {order.length === 0 ? (
                <div className="p-6 w-[50vw] ml-10 mb-8 bg-white border border-grey300 rounded-lg">
                    <h1 className="text-grey700 text-2xl font-normal text-center">
                        ไม่มีประวัติการซ่อม
                    </h1>
              </div>
            ) : (
                <div>
                    {order.map((data, index) => {
                        return (
                            <div 
                                className="p-6 w-[50vw] ml-10 mb-[28px] bg-white border border-grey300 rounded-lg flex justify-between"
                                key={index}
                            >
                                <div>
                                    <div className="text-xl font-medium leading-normal">
                                        คำสั่งซ่อมรหัส : {data.order_number}
                                    </div>
                                    <div className="h-12 flex flex-col gap-y-[9px] mt-3 mb-5 text-sm font-normal leading-[150%] text-grey700">
                                        <div className="flex gap-x-[15px]">
                                            <img 
                                                className="w-5 h-5" 
                                                src={image.calendarIcon}
                                                alt="Calendar Icon" 
                                            />
                                            <div>
                                              วันเวลาดำเนินการ: 21/09/2023 12:00 น.
                                              {/* <Moment format="DD/MM/YYYY HH:mm">
                                                {data.users.service.sub_service.checkout_quantity.checkout.service_date_time}
                                              </Moment>{" "} */}
                                            </div>
                                        </div>
                                        <div className="flex gap-x-[15px]">
                                            <img 
                                                className="w-5 h-5" 
                                                src={image.personIcon2}
                                                alt="Person Icon" 
                                            />
                                            <div>พนักงาน: สตีฟ จ็อบ</div>
                                        </div>
                                    </div>
                                    <div className="text-base font-normal leading-normal text-grey700">
                                        รายการ: {data.users.service[0].service_name}
                                        <ul className="flex flex-col list-disc ml-3">
                                            {data.users.service[0].sub_service.map((subService, index) => {
                                                return (
                                                    <li
                                                        key={index}
                                                        className="ml-2 my-1 font-normal text-sm text-black"
                                                    >
                                                        {subService.sub_service_name}, {" "}
                                                        {subService.sub_service_quantity} {subService.unit}
                                                    </li>
                                                )
                                            })}
                                            {/* <li className="ml-2 my-1 font-normal text-sm text-black">
                                                ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง
                                            </li> */}
                                        </ul> 
                                    </div>
                                </div>
                                <div className="flex flex-col gap-y-12 items-end justify-between">
                                    <div className="h-[65px] flex flex-col gap-y-[13px]">
                                        <div className="text-grey700 font-normal text-sm leading-[150%] flex gap-x-3 justify-end items-center">
                                            สถานะ:{" "}
                                                <div className="bg-[#DFF9F6] text-grey900 text-sm font-normal px-3 py-[2px] rounded-[99px]">
                                                    ดำเนินการสำเร็จแล้ว
                                                </div>
                                        </div>
                                        <div className="text-grey700 font-normal text-sm leading-normal flex gap-x-5 justify-end items-center">
                                            ราคารวม:
                                            <div className="text-lg text-black font-medium leading-normal">
                                                {parseFloat(data.users.service[0].sub_service[0].checkout_quantity[0].checkout.total_price)
                                                    .toFixed(2)}{" "}
                                                    ฿
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn-primary w-34">
                                        ดูรายละเอียด      
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>  
    );
}

export default ListHistory;