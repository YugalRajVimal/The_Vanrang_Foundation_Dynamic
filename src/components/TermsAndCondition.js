import { useState } from "react";

const sections = [
  {
    id: "interpretation",
    title: "Interpretation & Definitions",
    content: (
      <>
        <p>
          The words of which the initial letter is capitalized have meanings defined under the following
          conditions. The following definitions shall have the same meaning regardless of whether they
          appear in singular or in plural.
        </p>
        <h3>Definitions</h3>
        <p>For the purposes of these Terms and Conditions:</p>
        <ul>
          <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
          <li><strong>Country</strong> refers to: India</li>
          <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to The Vanrang Foundation (Section 8 Company).</li>
          <li><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
          <li><strong>Service</strong> refers to the Website.</li>
          <li><strong>Terms and Conditions</strong> (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
          <li><strong>Third-party Social Media Service</strong> means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.</li>
          <li>
            <strong>Website</strong> refers to The Vanrang Foundation, accessible from{" "}
            <a href="https://thevanrangfoundation.org/" target="_blank" rel="noreferrer">
              https://thevanrangfoundation.org/
            </a>
          </li>
          <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
        </ul>
      </>
    ),
  },
  {
    id: "acknowledgment",
    title: "Acknowledgment",
    content: (
      <>
        <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
        <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
        <p>By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p>
        <p>You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.</p>
        <p>Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.</p>
      </>
    ),
  },
  {
    id: "ip",
    title: "Intellectual Property Rights",
    content: (
      <>
        <p>All content available on this Website, including but not limited to text, images, graphics, logos, icons, designs, layout, audio, video, documents, and any other material, is the exclusive property of The Vanrang Foundation, unless otherwise stated.</p>
        <p>Such content is protected under applicable intellectual property laws, including copyright, trademark, and other proprietary rights.</p>
        <p>You are strictly prohibited from copying, reproducing, modifying, republishing, uploading, posting, transmitting, distributing, or commercially exploiting any content from this Website, in whole or in part, without prior written permission from the Company.</p>
        <p>Any unauthorized use of the Website content may result in legal action under applicable laws.</p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "User Accounts",
    content: (
      <>
        <p>If You create an account on the Website:</p>
        <ul>
          <li>You are responsible for maintaining the confidentiality of your account credentials, including your username and password, and for all activities that occur under your account.</li>
          <li>You agree to provide accurate, current, and complete information during registration and to update such information as necessary to keep it accurate and up to date.</li>
          <li>You must not use another person's account without permission or impersonate any individual or entity.</li>
          <li>The Company reserves the right to suspend, restrict, or terminate your account at its sole discretion, without prior notice, if any information provided is found to be false, misleading, or if the account is used in violation of these Terms or for any unlawful or unauthorized purpose.</li>
        </ul>
      </>
    ),
  },
  {
    id: "links",
    title: "Links to Other Websites",
    content: (
      <>
        <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.</p>
        <p>The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance any such content, goods or services available on or through any such web sites or services.</p>
        <p>We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit.</p>
      </>
    ),
  },
  {
    id: "termination",
    title: "Termination",
    content: (
      <>
        <p>We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.</p>
        <p>Upon termination, Your right to use the Service will cease immediately.</p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content: (
      <>
        <p>Notwithstanding any damages that You might incur, the entire liability of The Vanrang Foundation and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 INR if You haven't purchased anything through the Service.</p>
        <p>To the maximum extent permitted by applicable law, in no event shall The Vanrang Foundation or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if The Vanrang Foundation or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.</p>
        <p>Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each party's liability will be limited to the greatest extent permitted by law.</p>
      </>
    ),
  },
  {
    id: "disclaimer",
    title: '"AS IS" and "AS AVAILABLE" Disclaimer',
    content: (
      <>
        <p>The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, The Vanrang Foundation, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice.</p>
        <p>Without limitation to the foregoing, The Vanrang Foundation provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.</p>
        <p>Without limiting the foregoing, neither The Vanrang Foundation nor any of its providers makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of The Vanrang Foundation are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.</p>
        <p>Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to You. But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law.</p>
      </>
    ),
  },
  {
    id: "law",
    title: "Governing Law",
    content: (
      <p>The laws of India, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.</p>
    ),
  },
  {
    id: "disputes",
    title: "Disputes Resolution",
    content: (
      <p>If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting The Vanrang Foundation.</p>
    ),
  },
  {
    id: "severability",
    title: "Severability and Waiver",
    content: (
      <>
        <h3>Severability</h3>
        <p>If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.</p>
        <h3>Waiver</h3>
        <p>Except as provided herein, the failure to exercise a right or to require performance of an obligation under this Terms shall not affect a party's ability to exercise such right or require such performance at any time thereafter nor shall be the waiver of a breach constitute a waiver of any subsequent breach.</p>
      </>
    ),
  },
  {
    id: "translation",
    title: "Translation Interpretation",
    content: (
      <p>These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute.</p>
    ),
  },
  {
    id: "changes",
    title: "Changes to These Terms and Conditions",
    content: (
      <>
        <p>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.</p>
        <p>By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.</p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    content: (
      <>
        <p>If you have any questions about these Terms and Conditions, You can contact us:</p>
        <div className="contact-card">
          <p>By email: <a href="mailto:info@thevanrangfoundation.org">info@thevanrangfoundation.org</a></p>
          <p>By visiting: <a href="https://thevanrangfoundation.org" target="_blank" rel="noreferrer">https://thevanrangfoundation.org</a></p>
          <p>By phone: <a href="tel:+919256741759">+91 9256741759</a></p>
        </div>
      </>
    ),
  },
];

export default function TermsAndConditions() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8 pt-28 font-sans text-gray-900">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs text-gray-400 mb-1">The Vanrang Foundation</p>
        <h1 className="text-2xl font-medium mb-1">Terms and Conditions</h1>
        <p className="text-sm text-gray-500">Please read these terms and conditions carefully before using our service.</p>
      </div>

      {/* Table of Contents */}
      <div className="bg-gray-50 rounded-lg px-5 py-4 mb-10">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Contents</p>
        <ol className="list-none p-0 m-0 space-y-1 counter-reset-[toc]">
          {sections.map((section, index) => (
            <li key={section.id} className="flex items-baseline gap-2 border-b border-gray-200 pb-1 last:border-0 last:pb-0">
              <span className="text-xs text-gray-300 min-w-[18px]">{index + 1}.</span>
              <button
                onClick={() => scrollToSection(section.id)}
                className="text-sm text-blue-600 hover:underline bg-transparent border-0 p-0 cursor-pointer text-left"
              >
                {section.title}
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div
          key={section.id}
          id={section.id}
          className="mb-8 scroll-mt-4
            [&_h2]:text-base [&_h2]:font-medium [&_h2]:mb-3 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-gray-200
            [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mt-4 [&_h3]:mb-2
            [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-gray-600 [&_p]:mb-3
            [&_ul]:pl-5 [&_ul]:mb-3
            [&_ul_li]:text-sm [&_ul_li]:leading-relaxed [&_ul_li]:text-gray-600 [&_ul_li]:mb-1
            [&_a]:text-blue-600 [&_a]:no-underline hover:[&_a]:underline
            [&_.contact-card]:bg-gray-50 [&_.contact-card]:rounded-lg [&_.contact-card]:px-4 [&_.contact-card]:py-3
            [&_.contact-card_p]:text-xs [&_.contact-card_p]:mb-0 [&_.contact-card_p]:leading-7
          "
        >
          <h2>{section.title}</h2>
          {section.content}
        </div>
      ))}
    </div>
  );
}