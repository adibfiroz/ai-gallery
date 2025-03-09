import { getSingleImage } from '@/app/actions/image';
import ClientOnly from '@/components/ClientOnly';
import Container from '@/components/Container';
import SingleimageView from '@/components/images/single-image-view';
import { checkSubscription } from '@/lib/subscription';
import React from 'react'

const SingleImagePage = async ({
    params
}: {
    params: { imageId: string }
}) => {
    const { imageId } = params
    const isSubscribed = await checkSubscription();

    const image = await getSingleImage({ imageId })
    return (
        <ClientOnly>
            <Container>
                <SingleimageView
                    isSubscribed={isSubscribed}
                    data={image}
                />
            </Container>
        </ClientOnly>
    )
}

export default SingleImagePage