import React from 'react';

type Props = {};

const SideBar = (props: Props) => {
  return (
    <section className="fixed left-0 top-0 z-20 hidden h-full w-52 border-r-[1px] border-neutral-300 bg-white lg:block">
      <div className="flex h-20 items-center justify-center px-10">
        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded bg-slate-600 p-1 font-mono uppercase text-white">
          J
        </div>
        <h2 className="font-mono text-2xl font-bold">Jaarin</h2>
      </div>
      <div className="mt-8 flex pl-9">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <p>Settings</p>
      </div>
    </section>
  );
};

export default SideBar;
