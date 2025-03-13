import React from "react";

import { PageWrapper, PageTitle, PoweredBy } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";     
import Header from "@/app/components/Header";
import Collapsible from "@/app/components/league/Collapsible";

const FAQPage = () => {
  return (
    <PageWrapper>
      <Header currentPath="/faq" />
      <PageTitle title="Frequently Asked Questions" />
      <AuthCheck>
        <div className="space-y-4">
          <Collapsible title="What is this application for?">
            <p className="py-3 px-4 text-gray-700">
              This application provides hockey statistics and information from EliteProspects. 
              It allows you to view player stats, team rosters, league standings, alumni information, 
              and more in a convenient and user-friendly interface.
            </p>
          </Collapsible>
          
          <Collapsible title="How do I search for a player?">
            <div className="py-3 px-4 text-gray-700">
              <p className="mb-2">To search for a player:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Navigate to the &quot;Players&apos; Last Games&quot; section from the home menu</li>
                <li>Use the search bar to enter the player&apos;s name</li>
                <li>Select the player from the search results</li>
                <li>View the player&apos;s statistics and recent game information</li>
              </ol>
            </div>
          </Collapsible>
          
          <Collapsible title="How do I view team rosters?">
            <div className="py-3 px-4 text-gray-700">
              <p className="mb-2">To view a team&apos;s roster:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Navigate to the &quot;Team Roster&quot; section from the home menu</li>
                <li>Search for the team you&apos;re interested in</li>
                <li>Select the team from the search results</li>
                <li>The roster will display with player information and statistics</li>
              </ol>
            </div>
          </Collapsible>
          
          <Collapsible title="What information is available in the league standings?">
            <p className="py-3 px-4 text-gray-700">
              League standings provide comprehensive information about teams in a league, including:
              wins, losses, overtime losses, points, goals for, goals against, goal differential,
              and more. Standings are organized by conference and division where applicable.
            </p>
          </Collapsible>
          
          <Collapsible title="How do I access alumni information?">
            <div className="py-3 px-4 text-gray-700">
              <p className="mb-2">To access alumni information:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Navigate to the &quot;Team Alumni&quot; section from the home menu</li>
                <li>Search for the team you&apos;re interested in</li>
                <li>Select the team from the search results</li>
                <li>View alumni players who have played for that team</li>
              </ol>
              <p className="mt-2">You can also access tournament alumni through the &quot;Tournament Alumni&quot; section.</p>
            </div>
          </Collapsible>
          
          <Collapsible title="How often is the data updated?">
            <p className="py-3 px-4 text-gray-700">
              The data is sourced from EliteProspects and is updated regularly. Most statistics 
              are updated daily, but some information may have different update frequencies 
              depending on the source leagues and tournaments.
            </p>
          </Collapsible>
          
          <Collapsible title="Can I embed widgets on my own website?">
            <div className="py-3 px-4 text-gray-700">
              <p>
                Yes, you can embed our widgets on your own website. To do this:
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-2 mt-2">
                <li>Navigate to the section you want to embed (player stats, team roster, etc.)</li>
                <li>Look for the embed button or option</li>
                <li>Copy the provided embed code</li>
                <li>Paste the code into your website&apos;s HTML</li>
              </ol>
              <p className="mt-2">
                If you need a custom widget, you can use the &quot;Suggest Widget&quot; option from the home menu.
              </p>
            </div>
          </Collapsible>
          
          <Collapsible title="How do I contact support?">
            <p className="py-3 px-4 text-gray-700">
              For support inquiries, feature requests, or to report issues, please use the 
              &quot;Suggest Widget&quot; option from the home menu. This form allows you to send messages 
              to our support team who will assist you with any questions or concerns.
            </p>
          </Collapsible>
        </div>
        <PoweredBy />
      </AuthCheck>
    </PageWrapper>
  );
};

export default FAQPage;