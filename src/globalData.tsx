import { IconBaseProps } from "react-icons";
import { FaTelegram, FaTwitter } from "react-icons/fa";

export const siteName = "ASP STAKING PLATFORM";
export const siteUrl = "https://avaxstakingplatform.com/";

export const links = [
  {
    name: "Home",
    to: "/",
  },
  {
    name: "Stake",
    to: "/stake",
  },
  {
    name: "Auction",
    to: "/auctions",
  },
  {
    name: "Referrals",
    to: "/referrals",
  }
];

export const stakingFaqs = [
  {
    question: "What is staking?",
    answer: `You can stake your ASP tokens for a fixed number of days to earn interest on them.
      Make sure to stake more than 5 days to be eligible for bonus days rewards. At the end of
      every day the daily stake pool of ASP tokens will be calculated and allocated proportionally
      between all the open stakes. The allocated ASP tokens and AVAX will be available for users to
      withdraw when the stake ends.`,
  },
  {
    question: "How is stake pool calculated?",
    answer: `[ASP supply * 50000 / 5.42% inflation per year ], this daily pool will be distributed
      between all the Stakers as their stake interest.`,
  },
  {
    question: "Bonus for staking?",
    answer: `You get a bonus reward for your stake, based on the amount and time that you are staking.`,
  },
  {
    question: "What is a reward day?",
    answer: `Every stake will get a bonus day every 5 days, stakes get 2X interest on bonus days.
      Example: creating a stake on day 4 for 15 days gives this stake 3 bonus days on days 10,15,
      and 20.`,
  },
  {
    question: "What if I end my stake early?",
    answer: `You will get a penalty equal to the profit of half the days you committed to.`,
  },
  {
    question: "Do I get AVAX dividends for staking?",
    answer: `Yes! One of the benefits of Staking ASP is AVAX dividends.
      At the end of each day a AVAX dividends pool will be calculated and allocated to all the open
      stakes based on their stake amount. The dividends pool comes from the daily auction lobby total
      entry amount.`,
  },
  {
    question: "How is dividends pool calculated?",
    answer: `97% of all ASP that enters the daily Auction Lobby is pooled and distributed back out to stakers.`,
  },
  {
    question: "When will I recieve my AVAX dividends?",
    answer: `You will receive your ASP dividends after you exit your stake position.`,
  },
];


export const auctionFaqs = [
  {
    question: "What are auction lobbies?",
    answer: `Auction lobbies are Daily Auctions that offer ASP tokens for AVAX based on the ASP
      and AXAV pool at the end of the day.`,
  },
  {
    question: "How much ASP do lobbies pay?",
    answer: `Lobbies ASP pool will start from 5 million ASP per day and goes until 1 million over
      the next 365 days but never goes lower than 1 million tokens per day.`,
  },
  {
    question: "Buying tokens from exchange or participating in auction?",
    answer: `Auction lobbies are another way to buy ASP tokens that might be more profitable
      than purchasing on exchanges. Plus the ASP spent is rewarded back to Stakers.`,
  },
  {
    question: "Where does all the AVAX go?",
    answer: `Dividends, well at least 95% of them!! The other 5% reserve for promotion and
      platform development costs.`,
  },
  {
    question: "When do lobbies end?",
    answer: `Lobbies are daily, Every day at 00:00 UTC`,
  },
];

export type SocialLink = {
  name: string;
  url: string;
  icon: (props: IconBaseProps) => JSX.Element;
};

export interface SocialLinkProps {
  [key: string]: SocialLink;
}

export const socialLinks: SocialLinkProps = {
  twitter: {
    name: "Twitter",
    url: "https://twitter.com/asptokens?s=21",
    icon: (props) => <FaTwitter {...props} />,
  },
  telegram: {
    name: "Telegram",
    url: "https://t.me/aspstake",
    icon: (props) => <FaTelegram {...props} />,
  },
};
