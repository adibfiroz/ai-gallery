import Checkout from '@/components/chechout'
import Container from '@/components/Container'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckIcon } from 'lucide-react'
import React from 'react'
import getCurrentUser from '../actions/getCurrentUser'
import { checkSubscription } from '@/lib/subscription'

const tiers = [
    {
        name: 'Free',
        id: 'tier-hobby',
        href: '#',
        priceMonthly: 0,
        description: "Get started and explore",
        features: ['limited downloads', 'collections upto 5',],
        featured: false,
    },
    {
        name: 'Pro',
        id: 'tier-enterprise',
        href: '#',
        priceMonthly: 5,
        description: 'Unlimited benefits, one plan',
        features: [
            'Unlimited downloads',
            'collections upto 100',
            'browse thousands of images',
            'fast rendering'
        ],
        featured: true,
    },
]

const PricingPage = async () => {
    const currentUser = await getCurrentUser();
    const isSubscribed = await checkSubscription();

    return (
        <div className=' text-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal-900 via-teal-950 to-gray-900'>
            <Container>
                <div className="relative isolate px-6 py-16 sm:py-24 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-teal-400">Pricing</h2>
                    </div>
                    <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-300 sm:text-xl/8">
                        Choose an affordable plan that{`’`}s packed with the best features
                    </p>
                    <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
                        {tiers.map((tier, tierIdx) => (
                            <div
                                key={tier.id}
                                className={cn(
                                    tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white sm:mx-8 lg:mx-0',
                                    tier.featured
                                        ? ''
                                        : tierIdx === 0
                                            ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none'
                                            : 'sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl',
                                    'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10',
                                )}
                            >
                                <h3
                                    id={tier.id}
                                    className={cn(
                                        tier.featured ? 'text-teal-400' : 'text-teal-600',
                                        'text-base font-semibold leading-7',
                                    )}
                                >
                                    {tier.name}
                                </h3>
                                <p className="mt-4 flex items-baseline gap-x-2">
                                    <span
                                        className={cn(
                                            tier.featured ? 'text-white' : 'text-gray-900',
                                            'text-5xl font-semibold tracking-tight',
                                        )}
                                    >
                                        ${tier.priceMonthly}
                                    </span>
                                    <span className={cn(tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base')}>/month</span>
                                </p>
                                <p className={cn(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base leading-7')}>
                                    {tier.description}
                                </p>
                                <ul
                                    role="list"
                                    className={cn(
                                        tier.featured ? 'text-gray-300' : 'text-gray-600',
                                        'mt-8 space-y-3 text-sm leading-6 sm:mt-10',
                                    )}
                                >
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <CheckIcon
                                                aria-hidden="true"
                                                className={cn(tier.featured ? 'text-teal-400' : 'text-teal-600', 'h-6 w-5 flex-none')}
                                            />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                {tier.name === "Free" ?
                                    <Button
                                        aria-describedby={tier.id}
                                        className={cn(
                                            'text-teal-600 bg-transparent hover:bg-transparent ring-1 ring-inset ring-teal-200 hover:ring-teal-300 focus-visible:outline-teal-600 mt-8 block rounded-md px-3.5 w-full text-center text-sm font-semibold focus-visible:outline h-10 focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10'
                                        )}
                                    >
                                        Get Started
                                    </Button>
                                    :
                                    <Checkout
                                        plan={tier.name}
                                        amount={tier.priceMonthly}
                                        currentUser={currentUser}
                                        isSubscribed={isSubscribed}
                                    />
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default PricingPage