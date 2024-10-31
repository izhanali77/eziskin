"use client";

import { useState } from "react";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const people = [
  { id: 1, name: "Level 1 - $90" },
  { id: 2, name: "Level 2 - $180" },
  { id: 3, name: "Level 3 - $270" },
  { id: 4, name: "Level 4 - $360" },
  { id: 5, name: "Level 5 - $450" },
  { id: 6, name: "Level 6 - $540" },
];

export default function ModalSelect() {
  const [selected, setSelected] = useState(people[3]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <Listbox.Label className="block text-sm font-medium leading-6 text-gray-300 text-center">
        Select Level:
      </Listbox.Label>
      <div className="relative mt-2">
        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6">
          <span className="block truncate">{selected.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {people.map((person) => (
            <Listbox.Option
              key={person.id}
              value={person}
              className={({ active }) =>
                `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? "bg-blue-600 text-white" : "text-gray-900"}`
              }
            >
              {({ selected, active }) => (
                <>
                  <span
                    className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}
                  >
                    {person.name}
                  </span>
                  {selected ? (
                    <span
                      className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? "text-white" : "text-blue-600"}`}
                    >
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
