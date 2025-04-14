import * as test from './test';
import * as topTeams from './top-teams';

export const commands = {
  [test.data.name]: test,
  [topTeams.data.name]: topTeams,
};