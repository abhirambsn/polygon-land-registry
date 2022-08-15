import React, { useContext, useState } from "react";
import { LRContext } from "../context/LRContext";

const emptyState = {
  seller: "",
  buyer: "",
  salePrice: "",
  saleType: 0,
  landToken: "",
};

const NewSaleForm = ({closeModal}) => {
  const { executeSale } = useContext(LRContext);
  const [formState, setFormState] = useState(emptyState);
  const [submitting, setSubmitting] = useState(false);

  const handleChangeSeller = (e) =>
    setFormState({ ...formState, seller: e.target.value });
  const handleChangeBuyer = (e) =>
    setFormState({ ...formState, buyer: e.target.value });
  const handleChangeSalePrice = (e) =>
    setFormState({ ...formState, salePrice: e.target.value });
  const handleChangeSaleType = (e) =>
    setFormState({ ...formState, saleType: e.target.value });
  const handleChangeLandToken = (e) =>
    setFormState({ ...formState, landToken: e.target.value });

  const handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    const confirmed = confirm('Confirm Sale Execution! Once Done Cannot be reverted!!');
    if (!confirmed) return;
    try {
      const price = (
        parseFloat(formState.salePrice) * parseFloat(Math.pow(10, 18))
      ).toString();
      const res = await executeSale(
        formState.seller,
        formState.buyer,
        parseInt(formState.landToken),
        parseInt(formState.saleType),
        price
      );
      if (!res) {
        alert("Error");
        setSubmitting(false);
        return;
      }
      alert("Sale Executed Successfully");
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setFormState(emptyState);
    }
    closeModal();
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
      <div className="relative z-0 mb-6 w-full group mt-2">
        <input
          type="text"
          value={formState.buyer}
          name="floating_buyer"
          id="floating_buyer"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          onChange={handleChangeBuyer}
        />
        <label
          for="floating_buyer"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Buyer Wallet Address
        </label>
      </div>
      <div className="relative z-0 mb-6 w-full group">
        <input
          type="text"
          value={formState.seller}
          name="floating_seller"
          id="floating_seller"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          onChange={handleChangeSeller}
        />
        <label
          for="floating_seller"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Seller Wallet Address
        </label>
      </div>
      <div className="relative z-0 mb-6 w-full group">
        <input
          type="number"
          value={formState.landToken}
          name="floating_landToken"
          id="floating_landToken"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          onChange={handleChangeLandToken}
        />
        <label
          for="floating_landToken"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Land Token ID
        </label>
      </div>
      <div>
        <label
          htmlFor="saleType"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
        >
          Select Sale Type
        </label>
        <select
          id="saleType"
          value={formState?.saleType}
          onChange={handleChangeSaleType}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value={0}>New</option>
          <option value={1}>Resale</option>
          <option value={2}>Inheritance</option>
          <option value={3}>Gift</option>
        </select>
      </div>
      <div className="relative z-0 mb-6 w-full group">
        <input
          type="number"
          value={formState.salePrice}
          name="floating_salePrice"
          id="floating_salePrice"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          onChange={handleChangeSalePrice}
        />
        <label
          for="floating_salePrice"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Sale Price (in MATIC)
        </label>
      </div>

      <button
        className={`mt-2 ${submitting && 'disabled'} text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
        type="submit"
        disabled={submitting}
      >
        Execute Sale
      </button>
    </form>
  );
};

export default NewSaleForm;
