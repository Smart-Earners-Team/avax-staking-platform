import React from "react";
import Layout from "components/Layout";
import SEO from "components/SEO";
import StakingTable from "components/Table/StakingTable";
import FaqAccordion from "components/widgets/Accordion/FaqAccordion";
import { stakingFaqs } from "globalData";
import StakeAction from "components/Table/StakeAction";
import { usePoolsWithUserData } from "state/pools/hooks";

export default function Stake() {
  // fetch user data async;
  usePoolsWithUserData();

  return (
    <Layout>
      <SEO
        slug="/stake"
        title="Stake to earn more"
        pageDescription="Stake your ASP tokens within the Staking Portal and earn daily interest.
            Additionally, Stakers are rewarded AVAX tokens from the daily Lobbies based off the
            percentage of total tokens beign staked."
      />
      <div className="px-4 max-w-screen-2xl mx-auto">
        <div
          className="px-8 py-16 mx-auto bg-[url('../public/images/stake.png')]
          bg-no-repeat bg-left-bottom bg-contain"
        >
          <div className="max-w-4xl mx-auto bg-white p-5">
            <h1>Stake ASP and earn AVAX tokens daily!</h1>
            <p>
              Stake your ASP tokens within the Staking Portal and earn daily
              interest. Additionally, Stakers are rewarded AVAX tokens from the
              daily Lobbies based off the percentage of total tokens beign
              staked.
            </p>
          </div>
        </div>
        <div
          className="bg-white shadow-md flex flex-col sm:flex-row justify-between divide-y
          sm:divide-y-0 p-5"
        >
          <div className="text-lg text-gray-500">
            SHARE RATE{" "}
            <span className="inline-block ml-2 text-2xl font-semibold text-gray-500">
              0/ASP
            </span>
          </div>
          <div className="text-lg text-gray-500">
            AVERAGE DIVIDENDS POOL{" "}
            <span className="inline-block ml-2 text-2xl font-semibold text-gray-500">
              0
            </span>
          </div>
        </div>
        <div className="my-8">
          <div className="flex flex-col items-center lg:flex-row-reverse md:items-start gap-4">
            <div className="w-full overflow-x-auto">
              <h3 className="text-center text-gray-600">MY STAKES</h3>
              <StakingTable />
              <StakeAction />
            </div>
            <div className="w-full max-w-sm lg:max-w-xs flex-shrink-0 p-2 mx-auto">
              <h3 className="text-center text-gray-600">Stake FAQ</h3>
              <FaqAccordion
                faqs={stakingFaqs}
                expandedUuids={["what_is_staking"]}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
