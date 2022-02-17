import React from "react";
import Layout from "components/Layout";
import Link from "components/Link";
import SEO from "components/SEO";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import { socialLinks } from "globalData";
import { FaRegCalendarCheck } from "react-icons/fa";
import CountdownTimer from "components/widgets/Utils/CountdownTimer";

export default function HomePage() {
  return (
    <Layout>
      <SEO
        slug="/"
        pageDescription="Stake your ASP tokens within the Staking Portal and earn daily
          interest. Additionally, Stakers are rewarded AVAX tokens from the
          daily Lobbies based off the percentage of total tokens being
          staked."
      />
      {/* Hero header */}
      <div className="bg-primary-500 md:bg-[url('logo-large-background.png')] md:bg-no-repeat md:bg-right-top">
        <div
          className="h-screen max-h-[900px] md:max-w-screen-lg lg:max-w-screen-2xl mx-auto flex flex-col justify-center
            -my-0 px-8 lg:px-20 bg-primary-500/20"
        >
          <div className="w-full max-w-3xl -mt-20 md:mt-0 text-center md:text-left">
            <h1 className="text-white">
              ASP Community Staking Platform built on AVALANCHE
            </h1>
            <p className="my-4 py-2 text-white">
              The community has taken on this project and we're here to help it
              succeed! Daily Auction Lobby, Daily AVALANCHE Dividends, Lucrative
              Staking System, Completely Decentralized.
            </p>
            <div className="my-4 -mx-4">
              <Link
                to="/stake"
                className="mx-4 mb-4 md:mb-0 lg:w-auto bg-primary-50/20 ring-gray-100 !text-white
                  hover:bg-white hover:!text-primary focus:!bg-white focus:!text-primary"
                button
              >
                Stake Now
              </Link>
              <Link
                target="_blank"
                to="https://snowtrace.io/address/0xb3127298c77b6d389217d985f4b7197388334df4"
                className="mx-4 lg:w-auto ring-primary-400 text-primary hover:bg-primary-50/20
                  hover:text-white hover:ring-gray-100 focus:bg-primary-50/20 focus:text-white focus:ring-gray-100"
                button
              >
                View Contract
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="py-16 px-4 max-w-6xl mx-auto flex flex-col lg:flex-row items-center
          lg:items-start justify-center">
          <div className="max-w-xs md:max-w-sm lg:mx-10 my-4">
            <div className="flex justify-start items-center mx-auto">
              <div className="h-8 w-8 mr-2">
                <FaRegCalendarCheck className="w-8 h-8 text-primary-700" />
              </div>
              <h2 className="text-xl m-0">Lucrative Staking System</h2>
            </div>
            <p>
              Stake your ASP tokens within the Staking Portal and earn daily
              interest. Additionally, Stakers are rewarded AVAX tokens from the
              daily Lobbies based off the percentage of total tokens being
              staked.
            </p>
          </div>
          <div className="max-w-xs md:max-w-sm lg:mx-10 my-4">
            <div className="flex justify-start items-center mx-auto">
              <div className="h-8 w-8 mr-2">
                <RiMoneyDollarBoxLine className="w-8 h-8 text-primary-700" />
              </div>
              <h2 className="text-xl m-0">Daily Auction Lobby</h2>
            </div>
            <p>
              Our Daily Auctions will start from 5 million ASP tokens per day
              and will be distributed between the users that participated in
              Auction based on their purchase amount. This will reduce over the
              next 365 days
            </p>
          </div>
          <div className="max-w-xs md:max-w-sm lg:mx-10 my-4">
            <div className="flex justify-start items-center mx-auto">
              <div className="h-8 w-8 mr-2">
                <RiMoneyDollarBoxLine className="w-8 h-8 text-primary-700" />
              </div>
              <h2 className="text-xl m-0">Daily AVAX Dividends</h2>
            </div>
            <p>
              Everyday 95% of the previous day's AVAX that was spent in the
              Auction Lobby will be pooled and allocated to users based upon
              their completed stake terms.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div
          className="px-4 md:px-8 h-[400px] max-w-6xl mx-auto
            flex flex-col justify-center items-center md:flex-row md:justify-between"
        >
          <div className="text-center md:text-left">
            <h2>Ongoing Auctions</h2>
            <p className="mb-4">
              Be the highest Auction bidder in the auction pool
            </p>
          </div>
          <div className="font-bold flex flex-col items-center text-4xl md:mr-8">
            <CountdownTimer />
            <Link
              to="/auctions"
              button
              className="block mt-5 bg-primary !text-white text-lg hover:!bg-white focus:!bg-white
                hover:!text-primary focus:text-primary"
            >
              View Auctions
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-primary-500">
        <div
          id="contact-us"
          className="px-4 md:px-8 h-[400px] max-w-6xl mx-auto flex justify-center items-center"
        >
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h2 className="text-white">Join Our Community</h2>
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <p className="mb-4 text-white">
                Learn more about the project, interract with the team and take a
                part in shaping the future of ASP Staking Platform
              </p>
              <Link
                to={socialLinks.telegram.url}
                className="lg:w-auto ring-primary-400 text-primary hover:bg-primary-50/20 px-8
                  hover:text-white hover:ring-gray-100 focus:bg-primary-50/20 focus:text-white focus:ring-gray-100"
                button
              >
                Telegram
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
