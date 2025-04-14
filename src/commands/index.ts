import * as about from "./about";
import * as topTeams from "./top-teams/top-teams";
import * as topTeamsByCountry from "./top-teams/top-teams-by-country";
import * as upcomingEvents from "./events/upcoming-events";
import * as event from "./events/event";

export const commands = {
  [about.data.name]: about,
  [topTeams.data.name]: topTeams,
  [topTeamsByCountry.data.name]: topTeamsByCountry,
  [upcomingEvents.data.name]: upcomingEvents,
  [event.data.name]: event,
};
