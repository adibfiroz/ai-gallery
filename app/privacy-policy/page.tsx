import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Privacy  Policy - Pixsider',
}

const PrivacyPolicy = () => {

    return (
        <div className="my-10 p-4">
            <div className=" max-w-4xl mx-auto px-0 privacy terms font-medium">
                <h1>Privacy Policy</h1>
                <h3>Introduction</h3>
                <p>Pixsider ({`"we"`}, {`"our"`}, or {`"us"`}) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI image gallery website and caption generation service {`("the Service")`}. By accessing or using our Service, you agree to the collection and use of your information in accordance with this Privacy Policy. If you do not agree with this policy, please do not use our Service.</p>

                <h3>Information We Collect</h3>
                <p>We may collect and process the following types of information:</p>

                <ul className='mb-10'>
                    <li> <span className=" text-stone-800">Personal Information:</span> Information that can be used to identify you as an individual, such as your name, email address, and other contact details.</li>
                    <li> <span className=" text-stone-800">Usage Data:</span> Information about your interactions with the Service, including the IP address, browser type, pages visited, time spent on pages, and other diagnostic data.
                    </li>

                    <li><span className=" text-stone-800">Content Data:</span> Any content you generate or submit through the Service, including text prompts, images, captions, and other interactions.</li>

                    <li><span className=" text-stone-800">Cookies and Tracking Technologies:</span> We use cookies and similar tracking technologies to track activity on our Service and store certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.</li>
                </ul>

                <h3>How We Use Your Information</h3>
                <p>We use the information we collect for the following purposes:</p>

                <ul className='mb-10'>
                    <li><span className=" text-stone-800">To Provide and Maintain Our Service:</span> Ensuring the proper functioning and security of the Service.</li>
                    <li> <span className=" text-stone-800">To Improve Our Service:</span> Analyzing usage data to enhance user experience and develop new features.</li>
                    <li> <span className=" text-stone-800">To Communicate with You:</span> Sending administrative information, updates, and promotional content that you may find interesting.</li>
                    <li><span className=" text-stone-800">To Process Transactions:</span> Managing payments and billing for any paid services or features.</li>
                    <li>  <span className=" text-stone-800">To Ensure Compliance:</span> Enforcing our Terms of Service and complying with legal obligations.</li>
                </ul>


                <h3>Sharing Your Information</h3>
                <p>We do not sell or rent your personal information to third parties. We may share your information in the following circumstances:</p>

                <ul className='mb-10'>
                    <li><span className=" text-stone-800"> Service Providers:</span> We may employ third-party companies and individuals to facilitate our Service, provide the Service on our behalf, perform Service-related activities, or assist us in analyzing how our Service is used. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</li>
                    <li>  <span className=" text-stone-800">Legal Requirements:</span> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
                    <li>   <span className=" text-stone-800">Business Transfers:</span> In the event of a merger, acquisition, or sale of all or a portion of our assets, your personal information may be transferred. We will provide notice before your personal information is transferred and becomes subject to a different privacy policy.</li>
                </ul>


                <h3> Security of Your Information</h3>
                <p> We implement reasonable security measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

                <h3> Your Data Protection Rights</h3>
                <p>   Depending on your location, you may have the following rights regarding your personal information:</p>

                <ul className='mb-10'>
                    <li><span className=" text-stone-800">Access:</span> The right to request copies of your personal information.</li>
                    <li> <span className=" text-stone-800">Rectification:</span> The right to request that we correct any information you believe is inaccurate or incomplete.</li>
                    <li><span className=" text-stone-800">Erasure:</span> The right to request that we erase your personal information, under certain conditions.</li>
                    <li><span className=" text-stone-800">Restriction of Processing:</span> The right to request that we restrict the processing of your personal information, under certain conditions.</li>
                    <li><span className=" text-stone-800">Data Portability:</span> The right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
                    <li>
                        <span>To exercise any of these rights, please contact us at </span>
                        <Link className='text-blue-500 underline' href="mailto:support@pixsider.com">support@pixsider.com</Link>
                    </li>
                </ul>

                <h3>Children{`'`}s Privacy</h3>
                <p> Our Service is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information from our records.</p>

                <h3>Changes to This Privacy Policy</h3>
                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. Changes are effective when they are posted on this page, and your continued use of the Service after the posting of changes constitutes your acceptance of such changes.</p>

                <h3>Contact Us</h3>
                <p>
                    <span>If you have any questions about this Privacy Policy, please contact us at </span>
                    <Link className='text-blue-500 underline' href="mailto:support@pixsider.com">support@pixsider.com</Link>
                </p>
                <hr />
                <p className='mt-7'>By using Pixsider, you acknowledge that you have read, understood, and agreed to this Privacy Policy.</p>
            </div>
        </div>
    )
}

export default PrivacyPolicy