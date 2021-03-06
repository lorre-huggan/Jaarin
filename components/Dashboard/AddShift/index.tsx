import React, { useState } from 'react';
import Section from '../DashboardSection';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { DatePicker } from '@mantine/dates';
import { getUnixTime } from 'date-fns';
import { jobRoutes } from 'utils/api-routes';
import { useSWRConfig } from 'swr';
import { useLocalStorage } from 'utils/hooks/useLocalStorage';
import { useToasts } from 'react-toast-notifications';
import { Job } from 'utils/types/job-types';
import useJob from 'utils/hooks/useJob';
import { NumberInput } from '@mantine/core';
import { HandleCurrency } from 'utils/helpers';
import { BsClockHistory } from 'react-icons/bs';

interface Values {
  date: number;
  hours_worked: number;
}

const AddShiftSchema = Yup.object().shape({
  date: Yup.number().required('Required'),
  hours_worked: Yup.number().min(1, 'Invalid').max(24, 'Invalid'),
});

const AddShift = () => {
  const { token } = useLocalStorage();
  const [value, setValue] = useState<Date | null>(new Date());
  const [tipsEarned, setTipsEarned] = useState<number | undefined>(0);
  const [shiftLength, setShiftLength] = useState<number | undefined>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate } = useSWRConfig();
  const { addToast } = useToasts();

  console.log(tipsEarned, shiftLength);

  return (
    <Section>
      <div className="mb-4">
        <h4 className="text-2xl font-bold">Add Shift</h4>
      </div>
      <Formik
        initialValues={{
          date: 0,
          hours_worked: 0,
          tips: 0,
        }}
        onSubmit={async (values: Values, { resetForm }) => {
          setLoading(true);
          try {
            const res = await fetch(jobRoutes.createShift, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token!,
              },
              body: JSON.stringify({
                tips: tipsEarned,
                hours_worked: shiftLength,
                date: getUnixTime(value!),
              }),
            });
            const data: Job = await res.json();
            mutate([jobRoutes.base, token]);
            resetForm();
            addToast(`${data.user} Added Shift,`, {
              appearance: 'success',
              autoDismiss: true,
              autoDismissTimeout: 2500,
              newestOnTop: true,
            });
            setShiftLength(0);
            setTipsEarned(0);
          } catch (error: any) {
            setError(error.message);
          }

          setLoading(false);
        }}
        //validationSchema={AddShiftSchema}
      >
        {({ errors, touched }) => (
          <Form className="mx-auto mt-2 w-full">
            <label htmlFor="date" className="text-sm text-slate-500">
              Enter Date
            </label>
            <DatePicker
              dropdownType="modal"
              className="my-2"
              value={value}
              onChange={setValue}
              // styles={{
              //   input: {
              //     backgroundColor: '#94A3B8',
              //     color: '#ffffff',
              //     fontSize: '1rem',
              //     padding: '1.25rem 1rem',
              //   },
              // }}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="tips" className=" text-sm text-slate-500">
                  Tips Earned
                </label>
                <NumberInput
                  decimalSeparator="."
                  defaultValue={0.0}
                  precision={2}
                  step={0.1}
                  value={tipsEarned}
                  onChange={(val) => setTipsEarned(val)}
                  icon={<p>{HandleCurrency()}</p>}
                />
              </div>
              <div>
                <label
                  htmlFor="hours_worked"
                  className="text-sm text-slate-500"
                >
                  Shift Length
                </label>
                <NumberInput
                  decimalSeparator="."
                  defaultValue={0}
                  precision={2}
                  step={0.5}
                  value={shiftLength}
                  onChange={(val) => setShiftLength(val)}
                  icon={<p>{<BsClockHistory />}</p>}
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-slate-00 mt-4 w-full rounded bg-slate-300 p-2 text-center uppercase transition-colors duration-300 ease-in-out hover:bg-pink-400"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </Section>
  );
};

export default AddShift;
