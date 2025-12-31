import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-300">
        <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">1. Introduction</h2>
          <p>
            TaskerBot Dashboard is committed to transparency regarding the data we collect. 
            This policy outlines exactly what information is stored in our databases and how it is used to provide our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">2. Data We Collect</h2>
          <p className="mb-2">
            We only collect and store the minimum amount of data necessary for the application to function. This includes:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>
              <strong>Account Information:</strong> We store your Discord User ID and Username to authenticate you and link your data to your account.
            </li>
            <li>
              <strong>Objectives Data:</strong> We store the objectives you create, including:
              <ul className="list-circle pl-5 mt-1 text-gray-400">
                <li>Objective Name</li>
                <li>Frequency (e.g., daily, weekly)</li>
                <li>Progress statistics (current streak, last submitted date, last reminder date)</li>
              </ul>
            </li>
            <li>
              <strong>User Settings:</strong> We store your configuration preferences, such as bot message visibility settings.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">3. Local Data Storage</h2>
          <p>
            <strong>Submission Images:</strong> Any images or specific submission details you upload via the dashboard for your &quot;Activity Feed&quot; are stored 
            <strong> locally on your device</strong> using your browser&apos;s storage (IndexedDB). This data is not uploaded to our servers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">4. How We Use Your Data</h2>
          <p>
            The data stored in our databases is used strictly for:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Authenticating your access to the dashboard.</li>
            <li>Tracking and displaying your objective progress and streaks.</li>
            <li>Persisting your application settings across sessions.</li>
            <li>Sending reminders (if enabled) based on your objective frequency.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">5. Data Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal data to outside parties. Your data is used solely for the functionality of TaskerBot.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">6. Contact Us</h2>
          <p>
            If you have questions about your data or would like to request its deletion, please contact the bot administrators.
          </p>
        </section>
      </div>
    </div>
  );
}
