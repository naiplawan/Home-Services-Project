import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className=" text-9xl"> Hello Admin !! </h1>

        <button
        className="btn primary"
        onClick={() => navigate("/")}
      >
        <span className="text-lg ">👨‍🔧 GO HOME 👩‍🔧</span>

      </button>
      </div>
    </>
  );
}
export default AdminDashboard;