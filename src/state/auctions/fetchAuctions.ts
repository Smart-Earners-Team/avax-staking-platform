import fetchAuction from "./fetchAuction";

const fetchAuctions = async (ids: number[]) => {
  const data = await Promise.all(
    ids.map(async (id) => {
      const auc = await fetchAuction(id);
      const serializedAuction = { ...auc };
      return serializedAuction;
    })
  );
  return data;
};

export default fetchAuctions;
