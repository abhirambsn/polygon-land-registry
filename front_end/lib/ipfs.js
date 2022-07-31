import { NFTStorage } from "nft.storage";
const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE });

export const uploadToIPFS = async (
  name,
  description,
  image,
  area,
  address,
  plotNo
) => {
  const blob = new Blob([image?.data], { type: image?.type });
  const imgCid = await client.storeBlob(blob);
  const metdataJson = {
    name,
    description,
    image: `https://ipfs.io/ipfs/${imgCid}`,
    attributes: [
      {
        trait_type: "Area",
        value: area,
      },
      {
        trait_type: "Address",
        value: address,
      },
      {
        trait_type: "Plot/Unit No.",
        value: plotNo,
      },
    ],
  };

  const mJsonDataBlob = new Blob([JSON.stringify(metdataJson)], {
    type: "text/json",
  });
  const jsonIPFS = await client.storeBlob(mJsonDataBlob);
  return {
    imgIPFS: `https://ipfs.io/ipfs/${imgCid}`,
    metadataIPFS: `https://ipfs.io/ipfs/${jsonIPFS}`,
  };
};