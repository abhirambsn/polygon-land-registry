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

export const CONTRACT_ADDRESS = "0x0AafE4EAF95aAaF0C19Eb223432F6b780eA99059";
export const CONTRACT_ABI = landRegistryAbi.abi;
