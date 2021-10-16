import type { NextPage } from "next";
import { Nav } from "../components/Nav";
import PageHeading from "../components/PageHeading"

const Proposals: NextPage = () => {
    return (
        <div className="h-screen bg-gray-100">
            <Nav current="Proposals"></Nav>
            <PageHeading crumbs={["Dashboard", "Proposals"]} pageTitle="Proposals" ></PageHeading>
        </div>
    );
};

export default Proposals;
