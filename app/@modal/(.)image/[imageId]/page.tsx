
import { getSingleImage } from '@/app/actions/image'
import ClientOnly from '@/components/ClientOnly'
import ImageModal from '@/components/images/image-modal'
import { checkSubscription } from '@/lib/subscription'

const ImagePageModal = async ({
    params
}: {
    params: { imageId: string }
}) => {
    const { imageId } = params
    const isSubscribed = await checkSubscription();

    const image = await getSingleImage({ imageId })

    return (
        <ClientOnly>
            <ImageModal
                isSubscribed={isSubscribed}
                imageId={imageId}
                data={image}
            />
        </ClientOnly>
    )
}

export default ImagePageModal