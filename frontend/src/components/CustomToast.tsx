import { ToastContainer } from "react-toastify";

export const CustomToast = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      toastStyle={{
        backgroundColor: "black",
        color: "white",
        fontSize: "14px",
        padding: "8px",
        border: "1px solid #666666",
        borderRadius: "5px",
      }}
    />
  );
};
