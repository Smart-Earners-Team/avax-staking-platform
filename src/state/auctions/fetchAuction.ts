import { SerializedAuction } from 'state/types'
import fetchPublicFarmData from './fetchPublicAuctionData'

const fetchFarm = async (id: number): Promise<SerializedAuction> => {
  const auctionPublicData = await fetchPublicFarmData(id)
  return { ...auctionPublicData }
}

export default fetchFarm
