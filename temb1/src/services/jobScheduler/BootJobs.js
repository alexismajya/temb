import MonthlyReportsJob from './jobs/MonthlyReportsJob';

export const bootJobs = [
  MonthlyReportsJob.scheduleAllMonthlyReports,
];

class BootJobsService {
  static async scheduleJobs() {
    bootJobs.map(async (job) => {
      await job();
    });
  }
}
export default BootJobsService;
