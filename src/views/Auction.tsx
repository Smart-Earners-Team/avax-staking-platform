import React from "react";
import Layout from "components/Layout";
import SEO from "components/SEO";
import FaqAccordion from "components/widgets/Accordion/FaqAccordion";
import { auctionFaqs } from "globalData";
import AuctionTable from "components/Table/AuctionTable";
import { useAuctionsWithUserData } from "state/auctions/hooks";

export default function Auction() {
  // fetch user data async;
  useAuctionsWithUserData();

  return (
    <Layout>
      <SEO
        slug="/auctions"
        title="Stake to earn more"
        pageDescription="Stake your AVAX tokens within the Auction Portal and earn daily interest.
            Additionally, Stakers are rewarded ASP tokens from the daily Lobbies based off the
            percentage of total tokens being staked."
      />
      <div className="px-4 pt-20 max-w-screen-2xl mx-auto">
        <div className=" px-4 md:px-8 py-16 mx-auto">
          <div className="max-w-4xl mx-auto bg-white/70 p-5">
            <h1>Daily Auction Lobby!</h1>
            <p>
              One of the benefits of Staking ASP is AVAX dividends. At the end
              of each day the AVAX dividends pool will be calculated and
              allocated to all the open stakes based on their stake amount. The
              ASP dividends pool comes from the total daily entry of auction
              lobby.The only way to receive AVAX Dividends is having open
              stakes.
            </p>
          </div>
        </div>
        <div className="my-8">
          <div className="flex flex-col items-center lg:flex-row-reverse md:items-start gap-4">
            <div className="w-full overflow-x-auto">
              <h3 className="text-center text-gray-600">Auctions</h3>
              <hr />
              <AuctionTable />
            </div>
            <div className="max-w-sm lg:max-w-xs p-2 mx-auto">
              <h3 className="text-center text-gray-600">Auction FAQ</h3>
              <FaqAccordion
                faqs={auctionFaqs}
                expandedUuids={["what_are_auction_lobbies"]}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
