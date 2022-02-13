import { ethers } from "ethers";
import { getAspContract, getMulticallContract } from "utils/contractHelpers";

export interface Call {
  address: string; // Address of the contract
  name: string; // Function name on the contract (example: balanceOf)
  params?: any[]; // Function params
}

const multicall = async <T = any>(abi: any[], calls: Call[]): Promise<T> => {
  try {
    const multi = getMulticallContract();
    const itf = new ethers.utils.Interface(abi);

    const calldata = calls.map((call) => [
      call.address.toLowerCase(),
      itf.encodeFunctionData(call.name, call.params),
    ]);

    const { returnData } = await multi.aggregate(calldata);

    const res = returnData.map((call: ethers.utils.BytesLike, i: number) =>
      itf.decodeFunctionResult(calls[i].name, call)
    );
    return res;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

export default multicall;
