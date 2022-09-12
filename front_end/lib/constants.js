import landRegistryAbi from "./LandRegistry.json";
export const saleTypeMap = {
  0: "NEW",
  1: "RESALE",
  2: "INHERITANCE",
  3: "GIFT",
};

export const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      minWidth: '700px'
    },
  };

export const formatAddress = (addr) =>
  addr ? addr.slice(0, 5) + "..." + addr.slice(-5) : null;

export const CONTRACT_ADDRESS = "0xc0F1b92Aa7Bcc79164F13eBf5DD36B65bd598efe";
export const CONTRACT_ABI = landRegistryAbi.abi;
