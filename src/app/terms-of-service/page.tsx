import React from 'react';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-white">Terms of Service</h1>
      
      <div className="space-y-6 text-gray-300">
        <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the TaskerBot Dashboard and the associated Discord bot (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). 
            If you disagree with any part of the terms, then you may not access the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">2. Description of Service</h2>
          <p>
            TaskerBot is a productivity tool designed to help users track objectives and habits via Discord and this web dashboard. 
            The Service allows users to set goals, track progress, and view statistics.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">3. User Accounts</h2>
          <p>
            To use the Service, you must authenticate via your Discord account. You are responsible for maintaining the confidentiality of your Discord account 
            and for all activities that occur under your account. We reserve the right to refuse service or restrict access to the dashboard at our sole discretion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">4. User Conduct</h2>
          <p>
            You agree not to use the Service to:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Upload or transmit any content that is unlawful, harmful, threatening, abusive, harassing, or otherwise objectionable.</li>
            <li>Interfere with or disrupt the integrity or performance of the Service.</li>
            <li>Attempt to gain unauthorized access to the Service or its related systems or networks.</li>
            <li>Use the Service for any illegal purpose.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">5. Open Source License</h2>
          <p>
            TaskerBot is open-source software licensed under the <strong>BSD 3-Clause License</strong>. 
            Copyright (c) 2025, rsomonte. All rights reserved.
          </p>
          <p className="mt-2">
            Redistribution and use in source and binary forms, with or without modification, are permitted provided that the conditions of the license are met.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">6. Access Restriction</h2>
          <p>
            We may suspend or restrict your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. 
            Since your account is managed by Discord, we cannot terminate your account, but we can block your access to TaskerBot services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">7. Disclaimer</h2>
          <p>
            The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties of any kind, whether express or implied, 
            including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">8. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, 
            you agree to be bound by the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">9. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact the bot administrators via Discord.
          </p>
        </section>
      </div>
    </div>
  );
}
