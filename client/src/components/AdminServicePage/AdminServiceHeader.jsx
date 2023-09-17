import "../../styles/App.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUtils } from "../../hooks/utils.js";
import image from "../../assets/AdminPhoto/imageIndex";

const AdminServiceHeader = () => {
    const navigate = useNavigate();
    const {
      category,
      searchService,
      setSearchService,
      setService,
      getCategory,
      orderFilter,
      setOrderFilter,
      categoryFilter,
      setCategoryFilter,
      minFilter, setMinFilter, maxFilter, setMaxFilter
    } = useUtils();

  const searchServiceData = async () => {
    const results = await axios.get(
      `http://localhost:4000/service?keywords=${searchService}&categoryFilter=${categoryFilter}&maxPriceFilter=${maxFilter}&minPriceFilter=${minFilter}`
    );
    setService(results.data.data);
    console.log(results.data.data);
  };

  useEffect(() => {
    let timerId;
    timerId = setTimeout(searchServiceData, 1000);
    return () => {
      clearTimeout(timerId);
    };
  }, []);

    return (
      <header className="sticky top-0 bg-white">
      <div className="pl-60 flex items-center h-20 pr-10 justify-between border-b border-grey300 ">
        <h1 className="text-xl font-medium text-black pl-10">บริการ</h1>
        <h1 className="text-xl font-medium text-black pl-10">บริการ</h1>
        <div className="flex">
          <input
            type="text"
            id="search-text"
            name="search-text"
            placeholder="ค้นหาบริการ..."
            value={searchService}
            onChange={(event) => {
              setSearchService(event.target.value);
            }}
            className="px-4 py-2 border-grey300 border bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300 w-[400px]"
          />
          <button
          alt = "create-service"
            className="flex  btn-primary rounded-lg ml-7  h-[100%] w-[190px] text-white focus:outline-none"
            onClick={() => navigate("/admin-create-service")}
          >
            <p className="t pl-[15%]">เพิ่มบริการ</p>
            <p className="pt-2 pl-[15%]">
            <img src={image.plusSign} alt="Plus Symbol" className=" w-[10px] h-[10px] " />
            </p>
          </button>
        </div>
      </div>
      </div>
    </header>
  );
};

export default AdminServiceHeader;
