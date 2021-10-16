import type { NextPage } from "next";
import { Nav } from "../components/Nav";
import PageHeading from "../components/PageHeading"

const Members: NextPage = () => {
    return (
        <div className="h-screen bg-gray-100">
            <Nav current="Members"></Nav>
            <PageHeading crumbs={["Dashboard", "Members"]} pageTitle="Members" ></PageHeading>
        </div>
    );
};

export default Members;
