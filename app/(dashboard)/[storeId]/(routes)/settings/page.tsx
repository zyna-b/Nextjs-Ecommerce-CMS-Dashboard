import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

import SettingsForm from "./components/settings-form";

interface SettingsPageProps {
    params: {
        storeId: string;
    }
};

// COMPONENT
// This component is responsible for rendering the settings page

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {

    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { storeId } = await params;

    const store = await prismadb.store.findFirst({
        where: {
            id: storeId,
            userID: userId
        }
    });

    // If the store does not exist, redirect to the home page i.e., Dashboard
    if (!store) {
        redirect("/");
    }


    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store}/>
            </div>
        </div>
    );
}

export default SettingsPage;