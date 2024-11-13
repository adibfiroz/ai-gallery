
import SettingsClient from '@/components/settings-client';
import { checkSubscription } from '@/lib/subscription';

const SettingsPage = async () => {
    const isSubscribed = await checkSubscription()

    return (
        <div className='mt-10'>
            <SettingsClient isSubscribed={isSubscribed} />
        </div>
    )
}

export default SettingsPage