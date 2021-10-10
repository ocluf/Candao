import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>CanDao</title>
        <meta name="description" content="Dao for controlling canisters" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl mt-44 text-center">Candao</h1>

      <ul className="text-center mt-12">
        <li>Backend canister id: {process.env.CANDAO_CANISTER_ID}</li>
        <li>Frontend canister id: {process.env.CANDAO_ASSETS_CANISTER_ID}</li>
        <li>
          Internet Identity canister id:{" "}
          {process.env.INTERNET_IDENTITY_CANISTER_ID}
        </li>
      </ul>
    </div>
  );
};

export default Home;
