import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllBids, GetProductById } from "../../apicalls/products";
import { setLoader } from "../../redux/loadersSlice";
import Divider from "../../components/Divider";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { Button, message } from "antd";
import BidModal from "./BidModal";

function ProductInfo() {
  const { user } = useSelector((state) => state.users);
  const [showAddNewBid, setShowAddNewBid] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const { id } = useParams();

  const getData = async () => {
    try {
      dispatch(setLoader(true));
      const response = await GetProductById(id);
      dispatch(setLoader(false));
      if (response.success) {
        const bidsResponse = await GetAllBids({ product: id });
        setProduct({
          ...response.data,
          bids: bidsResponse.data,
        });
      }
    } catch (error) {
      dispatch(setLoader(false));
      // message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    product && (
      <div className="p-3 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
          {/* images */}
          <div className="flex flex-col gap-5">
            <img
              className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[500px] object-cover rounded-md"
              src={product.images[selectedImageIndex]}
              alt=""
            />

            <div className="flex flex-wrap gap-3">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md cursor-pointer ${
                    selectedImageIndex === index
                      ? "border-2 border-blue-400 border-solid p-1"
                      : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                  src={image}
                  alt=""
                />
              ))}
            </div>

            <Divider />

            <div>
              <h1 className="font-semibold text-gray-600">Added On</h1>
              <span className="text-gray-600">
                {moment(product.createdAt).format("MMM D YYYY, HH:mm A")}
              </span>
            </div>
          </div>

          {/* details */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold text-red-800">
                {product.name}
              </h1>
              <span>{product.description}</span>
            </div>

            <Divider />

            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold text-red-800">
                Product Details
              </h1>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Price</span>
                <span>₹{product.price}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Category</span>
                <span className="uppercase">{product.category}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Bill Available</span>
                <span>{product.billAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Box Available</span>
                <span>{product.boxAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Accessories Available</span>
                <span>{product.accessoriesAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Warranty Available</span>
                <span>{product.warrantyAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Purchased Year</span>
                <span>
                  {moment().subtract(product.age, "years").format("YYYY")} (
                  {product.age} {product.age === 1 ? "year" : "years"} ago)
                </span>
              </div>
            </div>

            <Divider />

            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold text-red-800">
                Seller Details
              </h1>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Name</span>
                <span>{product.seller.name}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Email</span>
                <span>{product.seller.email}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Hostel</span>
                <span>H - {product.hostel}</span>
              </div>
            </div>

            <Divider />

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold text-red-800">Bids</h1>
                <Button
                  onClick={() => setShowAddNewBid(!showAddNewBid)}
                  disabled={user._id === product.seller._id}
                >
                  New Bid
                </Button>
              </div>

              {product.showBidsOnProductPage &&
                product?.bids?.map((bid, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 border-solid p-3 rounded mt-4 text-sm sm:text-base"
                  >
                    <div className="flex justify-between text-gray-700">
                      <span>Name</span>
                      <span>{bid.buyer.name}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Bid Amount</span>
                      <span>₹ {bid.bidAmount}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Bid Placed On</span>
                      <span>
                        {moment(bid.createdAt).format("MMM D YYYY, HH:mm A")}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {showAddNewBid && (
          <BidModal
            product={product}
            reloadData={getData}
            showBidModal={showAddNewBid}
            setShowBidModal={setShowAddNewBid}
          />
        )}
      </div>
    )
  );
}

export default ProductInfo;
