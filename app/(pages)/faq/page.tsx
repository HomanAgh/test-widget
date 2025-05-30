import React from "react";

import { PageWrapper, PageTitle, PoweredBy } from "@/app/components/common/style";   
import Header from "@/app/components/Header";
import Collapsible from "@/app/components/league/Collapsible";

const FAQPage = () => {
  return (
    <PageWrapper>
      <Header currentPath="/faq" />
      <div className="container mx-auto px-4 py-8">
        <PageTitle title="Frequently Asked Questions" />
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
          
          <Collapsible title="How do I view league standings?">
            <div className="py-3 px-4 text-gray-700">
              <p className="mb-2">To view league standings:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Navigate to the &quot;League Standings&quot; section from the home menu</li>
                <li>Select the league you want to view (e.g., NHL, SHL, AHL)</li>
                <li>Choose the season you&apos;re interested in</li>
                <li>Browse the standings, which are organized by conference and division where applicable</li>
              </ol>
              <p className="mt-2">
                League standings provide comprehensive information about teams, including:
                wins, losses, overtime losses, points, goals for, goals against, goal differential,
                and more.
              </p>
            </div>
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
          
          <Collapsible title="How do I access tournament alumni information?">
            <div className="py-3 px-4 text-gray-700">
              <p className="mb-2">To access tournament alumni information:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Navigate to the &quot;Tournament Alumni&quot; section from the home menu</li>
                <li>Select a tournament from the available options (e.g., Brick Invitational)</li>
                <li>Choose the leagues you want to filter by (e.g., NHL, AHL)</li>
                <li>View alumni players who participated in the selected tournament and are now playing in the selected leagues</li>
              </ol>
              <p className="mt-2">Tournament alumni tracking allows you to see how players from youth tournaments have progressed to professional leagues.</p>
            </div>
          </Collapsible>
          
          <Collapsible title="How do I view scoring leaders?">
            <div className="py-3 px-4 text-gray-700">
              <p className="mb-2">To view scoring leaders for a league:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Navigate to the &quot;Scoring Leaders&quot; section from the home menu</li>
                <li>Select the league you want to view (e.g., NHL)</li>
                <li>Choose the season you&apos;re interested in</li>
                <li>Browse the list of top scorers, which includes statistics like goals, assists, points, and games played</li>
              </ol>
              <p className="mt-2">The scoring leaders are sorted by total points by default, but you can sort by different statistics by clicking on the column headers.</p>
            </div>
          </Collapsible>
          
          <Collapsible title="How do I view goalie leaders?">
            <div className="py-3 px-4 text-gray-700">
              <p className="mb-2">To view goalie leaders for a league:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Navigate to the &quot;Goalie Leaders&quot; section from the home menu</li>
                <li>Select the league you want to view (e.g., NHL)</li>
                <li>Choose the season you&apos;re interested in</li>
                <li>Browse the list of top goalies, which includes statistics like save percentage, goals against average, wins, and shutouts</li>
              </ol>
              <p className="mt-2">The goalie leaders can be sorted by different statistics to help you identify the top performers in various goaltending categories.</p>
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
                We offer the following widget types:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li><strong>Player Widget</strong>: Display individual player statistics and game information</li>
                <li><strong>Team Widget</strong>: Show a team&apos;s roster and player details</li>
                <li><strong>League Widget</strong>: Present league standings and information</li>
                <li><strong>Scoring Leaders Widget</strong>: Display top scorers for a specific league and season</li>
                <li><strong>Goalie Leaders Widget</strong>: Show leading goalies and their statistics</li>
                <li><strong>Alumni Widget</strong>: Present alumni players from specific teams</li>
                <li><strong>Tournament Alumni Widget</strong>: Display tournament alumni across multiple leagues</li>
              </ul>
              <p className="mt-2">
                Each widget type offers customization options including colors, sizing, and content filters. For detailed documentation and examples, visit our <a href="/embed/docs" className="text-blue-600 hover:underline">widget documentation</a> page.
              </p>
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
      </div>
    </PageWrapper>
  );
};

export default FAQPage;