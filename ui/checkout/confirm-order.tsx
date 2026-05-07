"use client";

import { useEffect, useState } from "react";

type CartItem = {
  id: number; name: string; price: number; image: string;
  size: string; color: string; quantity: number;
};

type ConfirmOrderProps = {
  name: string;
  phone: string;
  city: string;
  cart: CartItem[];
};

export default function ConfirmOrder({
  name,
  phone,
  city,
  cart,
}: ConfirmOrderProps) {

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const number = 1097182681; 

    const productsMessage = cart.map(item => 
      `الEGPنتج: ${item.name}\nSize: ${item.size}\nColor: ${item.color}\nQuantity: ${item.quantity}\nالPrice: ${item.price} EGP\n`
    ).join('\n');

    const message = `
      Order جديد EGPن EGPتجر BLANKO

      ${productsMessage}
        الاسEGP: ${name}
        الEGPوبايل: ${phone}
        Governorate: ${city}
      `;

    const url =
      "https://wa.me/" +
      number +
      "?text=" +
      encodeURIComponent(message);

    // اظهار Popup
    setShowPopup(true);

    // opening WhatsApp بعد 2.5 ثانية
    const timer = setTimeout(() => {
        window.open(url, "_blank");
        setShowPopup(false);
    }, 2500);

    return () => clearTimeout(timer);

  }, [name, phone, city, cart]);

  return (
    <div className="flex items-center justify-center bg-[#f7f7f7] p-6">

      {/* <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8">

        <h1 className="text-2xl font-semibold mb-6 text-center">
          Confirm Order
        </h1>

        <div className="space-y-3 text-sm text-gray-700">

          <p><span className="font-semibold">الاسEGP:</span> {name}</p>
          <p><span className="font-semibold">الEGPوبايل:</span> {phone}</p>
          <p><span className="font-semibold">Governorate:</span> {city}</p>

          {product && <p><span className="font-semibold">الEGPنتج:</span> {product}</p>}
          {size && <p><span className="font-semibold">Size:</span> {size}</p>}
          {color && <p><span className="font-semibold">Color:</span> {color}</p>}

        </div>

      </div> */}

      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center shadow-xl animate-fadeIn">
            <h2 className="text-lg font-semibold mb-2">تEGP استلاEGP Orderك</h2>
            <p className="text-gray-600">processing الآن opening WhatsApp لConfirm Order</p>
          </div>
        </div>
      )}

    </div>
  );
}