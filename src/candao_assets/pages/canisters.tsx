import type { NextPage } from "next";
import { Nav } from "../components/Nav";
import PageHeading from "../components/PageHeading"

const Canisters: NextPage = () => {
    return (
        <div className="h-screen bg-gray-100">
            <Nav current="Canisters" />
            <PageHeading crumbs={["Dashboard", "Canisters"]} pageTitle="Canisters" />
        </div>
    );
};

export default Canisters;
