const startDate = 'AAAAAA';
const endDate = 'BBBBBB';
const workHours = 'CCC-DDD';
const id = 12;

const fellow = {
  id: 1,
  slackId: 'FFFFFF',
  email: 'BBBBBB.CCCCCC@localhost'
};
const partner = {
  name: 'GGGGGG',
  id: 1
};
const fellowId = fellow.id;
const partnerId = partner.id;

const updateStartDate = 'AAAAAA';
const updateEndDate = 'BBBBBB';
const updateWorkHours = 'CCC-DDD';
export const engagement = {
  id,
  startDate,
  endDate,
  workHours,
  fellowId,
  partnerId,
  fellow,
  partner
};
export const updateEngagement = {
  ...engagement,
  startDate: updateStartDate,
  endDate: updateEndDate,
  workHours: updateWorkHours
};
