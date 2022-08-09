import React, { useContext, useState } from "react";
import { LRContext } from "../context/LRContext";
import { uploadToIPFS } from "../lib/ipfs";

function IPFSLandRegisterForm({closeModal}) {
  const [imageState, setImageState] = useState();
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    area: 0,
    address: "",
    plotNo: "",
    owner: "",
    price: "0",
  });
  const [submitting, setSubmitting] = useState(false);

  const { registerLand } = useContext(LRContext);

  const handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    alert(JSON.stringify({ ...formState, image: imageState }, null, 2));
    const data = await uploadToIPFS(
      formState.name,
      formState.description,
      { data: imageState, type: "image/jpeg" },
      formState.area,
      formState.address,
      formState.plotNo
    );

    const price = (
      parseFloat(formState?.price) * parseFloat(Math.pow(10, 18))
    ).toString();
    try {
      const result = await registerLand(data?.metadataIPFS, formState.owner, price);
      alert(`Land Registered w/ id: ${result.toString()}`);
      if (!result) {
        alert('Error Occurred');
        return;
      }
    } catch (err) {
      console.error(err);
      return;
    }
    setSubmitting(false);
    setFormState({
      name: "",
      description: "",
      area: 0,
      address: "",
      plotNo: "",
      owner: "",
      price: "0",
    });
    closeModal();
  };

  const resolveImage = (imageObj) => {
    const promise = new Promise((resolve, reject) => {
      const reader = new FileReader(imageObj);
      reader.readAsArrayBuffer(imageObj);
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
    });
    promise
      .then((data) => {
        setImageState(data);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeName = (e) =>
    setFormState({ ...formState, name: e.target.value });
  const handleChangeDesc = (e) =>
    setFormState({ ...formState, description: e.target.value });
  const handleChangeArea = (e) =>
    setFormState({ ...formState, area: parseInt(e.target.value) });
  const handleChangeAddress = (e) =>
    setFormState({ ...formState, address: e.target.value });
  const handleChangePlot = (e) =>
    setFormState({ ...formState, plotNo: e.target.value });
  const handleChangeImage = (e) => resolveImage(e.currentTarget.files[0]);
  const handleChangeOwner = (e) =>
    setFormState({ ...formState, owner: e.target.value });
  const handleChangePrice = (e) =>
    setFormState({ ...formState, price: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          for="image"
        >
          Upload Image File
        </label>
        <input
          className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          onChange={handleChangeImage}
          id="image"
          type="file"
        />
      </div>
      <div className="relative z-0 mb-6 w-full group">
        <input
          type="text"
          value={formState.name}
          name="floating_name"
          id="floating_name"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          onChange={handleChangeName}
        />
        <label
          for="floating_name"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Name
        </label>
      </div>

      <div className="relative z-0 mb-6 w-full group">
        <textarea
          type="text"
          value={formState.address}
          name="floating_address"
          id="floating_address"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          onChange={handleChangeAddress}
        ></textarea>
        <label
          for="floating_address"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Address
        </label>
      </div>

      <div className="relative z-0 mb-6 w-full group">
        <textarea
          type="text"
          value={formState.description}
          name="floating_description"
          id="floating_address"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          onChange={handleChangeDesc}
        ></textarea>
        <label
          for="floating_description"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Description
        </label>
      </div>

      <div className="relative z-0 mb-6 w-full group">
        <input
          type="text"
          value={formState.area}
          name="floating_area"
          id="floating_area"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          onChange={handleChangeArea}
        />
        <label
          for="floating_area"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Area
        </label>
      </div>

      <div className="relative z-0 mb-6 w-full group">
        <input
          type="text"
          value={formState.plotNo}
          name="floating_plotno"
          id="floating_plotno"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          onChange={handleChangePlot}
        />
        <label
          for="floating_plotno"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Plot No.
        </label>
      </div>

      <div className="relative z-0 mb-6 w-full group">
        <input
          type="text"
          value={formState.owner}
          name="floating_owner"
          id="floating_owner"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          onChange={handleChangeOwner}
        />
        <label
          for="floating_owner"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Owner
        </label>
      </div>

      <div className="relative z-0 mb-6 w-full group">
        <input
          type="text"
          value={formState.price}
          name="floating_price"
          id="floating_price"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          onChange={handleChangePrice}
        />
        <label
          for="floating_price"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Price
        </label>
      </div>

      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="submit"
        disabled={submitting}
      >
        Register Land
      </button>
    </form>
  );
}

export default IPFSLandRegisterForm;
