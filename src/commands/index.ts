import * as test from './test';
import * as topTeams from './top-teams';
import * as topTeamsByCountry from './top-teams-by-country';

export const commands = {
  [test.data.name]: test,
  [topTeams.data.name]: topTeams,
  [topTeamsByCountry.data.name]: topTeamsByCountry,
};