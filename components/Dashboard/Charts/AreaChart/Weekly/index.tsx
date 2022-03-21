import React, { useState } from 'react';
import { ResponsiveContainer, Tooltip, AreaChart, Area, XAxis } from 'recharts';
import { Wage } from 'utils/types/job-types';
import {
  fullDayName,
  HandleCurrency,
  numberReducer,
  shortDayName,
} from 'utils/helpers';
import useTips from 'utils/hooks/useTips';
import { TiInfoLarge } from 'react-icons/ti';
import { Popover, Switch } from '@mantine/core';

type Props = {
  wages: Wage[];
};
interface ITips {
  currentWeekTips?: number[];
  currentWeekHours?: number[];
  weekData: WageData[];
  thisWeek: boolean;
  setThisWeek: React.Dispatch<React.SetStateAction<boolean>>;
}

interface WageData {
  name: string;
  tips: number;
  hours: number;
}

interface WageWeekData {
  weekData: WageData[];
  thisWeeksTips: WageData[];
  thisWeek: boolean;
}

const WeeklyAreaChart: React.FC<Props> = ({ wages }) => {
  const [thisWeek, setThisWeek] = useState(true);
  const {
    currentWeekTips,
    currentWeekHours,
    weekData,
    thisWeeksTips,
    thisWeekData,
  } = useTips(wages);

  const data = weekData!.map((week) => {
    const days = week.map((day, i) => {
      return { ...day, name: shortDayName[i] };
    });
    return days;
  });

  const WeekDataArray = fullDayName.map((day, i) => {
    return {
      tips: data[i].map((arg) => {
        return arg.tips;
      }),
      hours: data[i].map((arg) => {
        return arg.hours_worked;
      }),
      date: data[i].map((arg) => {
        return arg.date;
      }),
      name: data[i].map((arg) => {
        return arg.name;
      }),
    };
  });

  const totalWeekData = shortDayName.map((day, i) => {
    return {
      name: shortDayName[i],
      tips: Number(numberReducer(WeekDataArray[i].tips).toFixed(2)),
      hours: Number(numberReducer(WeekDataArray[i].hours).toFixed(0)),
    };
  });

  const _thisWeekData = thisWeekData!.map((week) => {
    const days = week.map((day, i) => {
      return { ...day, name: shortDayName[i] };
    });
    return days;
  });

  const _thisWeekDataArray = fullDayName.map((day, i) => {
    return {
      tips: _thisWeekData[i].map((arg) => {
        return arg.tips;
      }),
      hours: _thisWeekData[i].map((arg) => {
        return arg.hours_worked;
      }),
      date: _thisWeekData[i].map((arg) => {
        return arg.date;
      }),
      name: _thisWeekData[i].map((arg) => {
        return arg.name;
      }),
    };
  });

  const _totalThisWeekData = shortDayName.map((day, i) => {
    return {
      name: shortDayName[i],
      tips: Number(numberReducer(_thisWeekDataArray[i].tips).toFixed(2)),
      hours: Number(numberReducer(_thisWeekDataArray[i].hours).toFixed(0)),
    };
  });

  return (
    <section className="mx-auto my-6 w-[90%] overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-100 pt-4 shadow-lg">
      <Details
        currentWeekHours={currentWeekHours}
        currentWeekTips={currentWeekTips}
        weekData={totalWeekData}
        thisWeek={thisWeek}
        setThisWeek={setThisWeek}
      />
      <Weekly
        weekData={totalWeekData}
        thisWeeksTips={_totalThisWeekData}
        thisWeek={thisWeek}
      />
    </section>
  );
};

export default WeeklyAreaChart;

const Details: React.FC<ITips> = ({
  currentWeekTips,
  currentWeekHours,
  weekData,
  thisWeek,
  setThisWeek,
}) => {
  const [opened, setOpened] = useState(false);
  const weekTips = weekData.map((week) => {
    return week.tips;
  });

  const highestTips = Math.max.apply(null, weekTips);

  const highestTipsDay = weekData.filter((week) => {
    return week.tips === highestTips;
  });

  return (
    <div className="relative mb-8 flex items-center justify-between px-4">
      <div>
        <div className="flex">
          <Switch
            color="pink"
            styles={{
              input: { backgroundColor: 'rgb(129 140 248)' },
            }}
            onChange={(event) => setThisWeek(event.currentTarget.checked)}
          />
          <p className="ml-2 text-sm text-slate-400">
            {thisWeek ? 'This weeks tips' : 'All tips'}
          </p>
        </div>
        <div className="flex">
          <div className="flex items-center">
            <div className="mr-1 h-2 w-2 rounded-full bg-pink-400"></div>
            <p className="text-xs text-pink-400">Total/Tips</p>
          </div>
          <div className="ml-2 flex items-center">
            <div className="mr-1 h-2 w-2 rounded-full bg-indigo-400"></div>
            <p className="text-xs text-indigo-400">Total/Hours</p>
          </div>
        </div>
      </div>

      <Popover
        opened={opened}
        onClose={() => setOpened(false)}
        target={
          <button onClick={() => setOpened((o) => !o)}>
            <TiInfoLarge size={24} />
          </button>
        }
        width={160}
        position="left"
      >
        <div className="mb-4 flex  justify-center">
          <div>
            <div className="rounded-xl bg-green-400/50 p-1">
              <p className="text-center text-base text-green-800">{`${HandleCurrency()}${numberReducer(
                currentWeekTips!
              ).toFixed(2)}`}</p>
            </div>
            <p className=" text-xs text-slate-400">Received this week</p>
          </div>
        </div>
        <div className="mb-4 flex justify-center">
          <div>
            <div className="w-full rounded-xl bg-green-400/50 p-1">
              <p className="text-center text-base text-green-800">
                {numberReducer(currentWeekHours!).toFixed(1)}hr
              </p>
            </div>
            <p className=" text-xs text-slate-400">Shift Hours this week</p>
          </div>
        </div>
        <div className="flex justify-center">
          <div>
            <div className="rounded-xl bg-green-400/50 p-1">
              <p className="text-center text-base text-green-800">
                {highestTips === 0 ? 'N/A' : highestTipsDay[0].name}
              </p>
            </div>
            <p className=" text-xs text-slate-400">Top Earnings Day</p>
          </div>
        </div>
      </Popover>
    </div>
  );
};

const Weekly: React.FC<WageWeekData> = ({
  weekData,
  thisWeeksTips,
  thisWeek,
}) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        width={400}
        height={400}
        data={thisWeek ? thisWeeksTips : weekData}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="_tips" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgb(249 168 212)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="rgb(249 168 212)" stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id="hours" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#818CF8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#818CF8" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <Tooltip />
        <XAxis dataKey="name" hide={false} />

        <Area
          type="monotone"
          dataKey="tips"
          stroke="rgb(244 114 182)"
          fill="url(#_tips)"
          fillOpacity={0.95}
          strokeWidth={0}
          animationEasing="ease-in-out"
        />
        <Area
          type="monotone"
          dataKey="hours"
          stroke="#818CF8"
          fill="url(#hours)"
          fillOpacity={0.95}
          strokeWidth={0}
          animationEasing="ease-in-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
