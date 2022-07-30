import React, { useState } from "react";
import { uploadToIPFS } from "../lib/ipfs";

function IPFSTestForm() {
  const [imageState, setImageState] = useState();
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    area: 0,
    address: "",
    plotNo: "",
  });
  const [submitting, setSubmitting] = useState(false);

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
    console.log(data);
    setSubmitting(false);
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
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleChangeImage} />
      <input
        type="text"
        value={formState.name}
        placeholder="Name"
        onChange={handleChangeName}
      />
      <textarea
        value={formState.address}
        placeholder="Address"
        onChange={handleChangeAddress}
      ></textarea>
      <textarea
        value={formState.description}
        placeholder="Description"
        onChange={handleChangeDesc}
      ></textarea>
      <input
        type="number"
        value={formState.area}
        placeholder="Area"
        onChange={handleChangeArea}
      />
      <input
        type="text"
        value={formState.plotNo}
        placeholder="Plot No"
        onChange={handleChangePlot}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default IPFSTestForm;
