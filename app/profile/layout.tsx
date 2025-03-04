import Container from "@/components/Container"
import ProfileInfo from "@/components/profile/profile-info";
import ProfileLinks from "@/components/profile/profile-links";
import { getCurrentUser } from "../actions/getCurrentUser";
import ProtectedRoute from "@/components/profile/protected-route";
import { getCollection } from "../actions/collection";
import { checkSubscription } from "@/lib/subscription";

const Profilelayout = async ({
    children,
}: {
    children: React.ReactNode
}) => {
    const currentUser = await getCurrentUser()
    const collections = await getCollection()
    const isSubscribed = await checkSubscription();

    return (
        <Container>
            <ProtectedRoute currentUser={currentUser}>
                <ProfileInfo currentUser={currentUser} />
                <ProfileLinks
                    currentUser={currentUser}
                    collections={collections}
                    isSubscribed={isSubscribed}
                />
                {children}
            </ProtectedRoute>
        </Container>
    );
}

export default Profilelayout;