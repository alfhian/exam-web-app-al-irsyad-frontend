import { useState } from 'react'
import { Menu } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'

export default function ActionMenu({ userId, onEdit }) {
  return (
    <Menu as="div" className="inline-block text-left">
      <Menu.Button className="p-2 hover:bg-gray-100 rounded-full">
        <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-gray-100' : ''
                } w-full px-4 py-2 text-sm text-gray-700`}
                onClick={() => onEdit(userId)}
              >
                Edit
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  )
}
