import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Terms and conditions - Pixsider',
}

const TermsOfService = () => {
    return (
        <div className="my-10 p-4">
            <div className=" max-w-4xl mx-auto px-0 font-medium terms">
                <h1>Terms and Conditions</h1>
                <h3>Introduction</h3>
                <p>
                    Welcome to Pixsider ({`"the Service"`}), an AI image gallery website based on a subscription model. By accessing or using our Service, you agree to be bound by these Terms of Service ({`"Terms"`}). If you do not agree with any part of these Terms, you may not use our Service.
                </p>

                <h3>Acceptance of Terms</h3>
                <p>
                    By using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and any future modifications. If you are using the Service on behalf of an organization, you agree to these Terms on behalf of that organization and represent that you have the authority to do so.
                </p>

                <h3>Description of Service</h3>
                <p>
                    Pixsider provides tools for downloading and browsing AI-generated images. Users can also generate captions for images. The Service is provided {`"as is"`} and may be subject to interruptions, errors, or changes.
                </p>

                <h3>User Responsibilities</h3>
                <ul>
                    <li>
                        <span className=" text-stone-800">Account Registration:</span> You may be required to create an account to use certain features of the Service. You agree to provide accurate, current, and complete information during registration and to keep your account information up to date.
                    </li>
                    <li>
                        <span className=" text-stone-800">Use of Service:</span> You agree to use the Service only for lawful purposes and in accordance with these Terms. You are responsible for all activities that occur under your account.
                    </li>
                    <li>
                        <span className=" text-stone-800">Prohibited Uses:</span> You agree not to:
                        <ul className=" mt-5 list-disc mb-10">
                            <li>Use the Service for any illegal or unauthorized purpose.</li>
                            <li>Generate content that is offensive, harmful, or violates the rights of others.</li>
                            <li>Exploit the Service for commercial purposes without proper authorization.</li>
                            <li>Interfere with the operation of the Service or disrupt other users access.</li>
                        </ul>
                    </li>
                </ul>



                <h3>Content Ownership and Use</h3>
                <ul>
                    <li>
                        <span className=" text-stone-800">Company Content:</span> All images available for download on Pixsider are owned or licensed by Pixsider. Users are granted a limited, non-exclusive license to download and use images in accordance with the subscription plan they have purchased. Unauthorized redistribution or resale of images is strictly prohibited.
                    </li>
                    <li>
                        <span className=" text-stone-800">User Content:</span> If you generate captions or provide other content, you retain ownership of that content. By using the Service, you grant Pixsider a non-exclusive, royalty-free, worldwide license to use, host, store, and modify such content for the purpose of operating and improving the Service.
                    </li>
                </ul>


                <h3>Privacy</h3>
                <p>
                    Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and disclose information about you.
                </p>

                <h3>Intellectual Property</h3>
                <p> All intellectual property rights in the Service, including but not limited to software, text, images, and trademarks, are owned by Pixsider or its licensors. You agree not to copy, modify, distribute, or create derivative works based on the Service or any part thereof.</p>

                <h3>Termination</h3>
                <p>
                    Pixsider reserves the right to suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. Upon termination, your right to use the Service will immediately cease, and all data associated with your account may be deleted.
                </p>

                <h3>Disclaimer of Warranties</h3>
                <p> The Service is provided {`"as is"`} and {`"as available"`} without warranties of any kind, either express or implied. Pixsider disclaims all warranties, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.</p>

                <h3>Limitation of Liability</h3>
                <p>
                    To the fullest extent permitted by law, Pixsider shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
                </p>

                <ul className="pl-4 list-disc mb-10">
                    <li>Your use or inability to use the Service.</li>
                    <li>Any unauthorized access to or use of our servers and/or any personal information stored therein.</li>
                    <li>Any interruption or cessation of transmission to or from the Service.</li>
                    <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through our Service by any third party.</li>
                </ul>

                <h3>Indemnification</h3>
                <p> You agree to indemnify and hold harmless Pixsider and its affiliates, officers, agents, employees, and partners from and against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your infringement of any intellectual property or other rights of any third party.
                </p>

                <h2>Governing Law</h2>
                <p>
                    These Terms shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law principles. You agree to submit to the exclusive jurisdiction of the courts located in [Your Country/State] to resolve any legal matter arising from these Terms.
                </p>

                <h3>Changes to Terms</h3>
                <p>  Pixsider reserves the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on our website. Your continued use of the Service after the effective date of any modifications will constitute your acceptance of the modified Terms.</p>

                <h3>Contact Information</h3>
                <p>
                    <span>If you have any questions about these Terms, please contact us at </span>
                    <Link className='text-blue-500 underline' href="mailto:support@pixsider.com">support@pixsider.com</Link>
                </p>
                <hr />
                <p className=" mt-6">By using Pixsider, you acknowledge that you have read, understood, and agreed to these Terms of Service.</p>
            </div>
        </div>
    )
}

export default TermsOfService