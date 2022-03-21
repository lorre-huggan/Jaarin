import React from 'react';
import HTMLHead from '@components/Head';
import UserCard from '@components/Dashboard/Overview';
import AddShift from '@components/Dashboard/AddShift';
import ShiftCard from '@components/Dashboard/ShiftCard';
import useSWR from 'swr';
import WeeklyAreaChart from '@components/Dashboard/Charts/AreaChart/Weekly';
import { AuthenticatedUser } from 'utils/types/user-types';
import { UseAuth } from 'utils/hooks/useAuth';
import { jobRoutes } from 'utils/api-routes';
import { Job } from 'utils/types/job-types';
import WeeklyRadialBarChart from '@components/Dashboard/Charts/RadialBarChart/Weekly';
import { useLocalStorage } from 'utils/hooks/useLocalStorage';
import MonthlyAreaChart from '@components/Dashboard/Charts/AreaChart/Monthly';
import { Loader } from '@mantine/core';

const Dashboard = () => {
  const { token } = useLocalStorage();
  const { authenticatedUser: user }: { authenticatedUser: AuthenticatedUser } =
    UseAuth();
  const { data, error } = useSWR<Job>([jobRoutes.base, token]);

  if (!data) {
    return (
      <main className="flex h-screen w-full items-center justify-center">
        <Loader color="gray" size="xl" />
      </main>
    );
  }
  if (error) {
    return <p>Error...</p>;
  }

  if (data) {
    return (
      <>
        <HTMLHead title="Dashboard" />
        <main className="pb-10">
          <UserCard job={data} user={user} />
          <AddShift />
          <WeeklyAreaChart wages={data.wages} />
          <MonthlyAreaChart wages={data.wages} />
          <WeeklyRadialBarChart wages={data.wages} />
          <ShiftCard wages={data.wages} jobID={data._id} />
        </main>
      </>
    );
  }
};

export default Dashboard;
