// menus component
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roleMenus, menus } from '../constants/menus';
import * as FaIcons from 'react-icons/fa';
import axios from 'axios';

const Menus = ({ role }) => {
	const allowedMenuNames = roleMenus[role] || [];
	const navigate = useNavigate();

	const filteredMenus = menus.filter(menu => allowedMenuNames.includes(menu.name));

	return (
		<ul>
			{filteredMenus.map((menu, index) => {
				const Icon = menu.icon ? FaIcons[menu.icon] : null;
				return (
					<li key={index} className="flex items-center p-4 hover:bg-blue-700 cursor-pointer" onClick={() => {navigate(menu.path);}}>
						{Icon && <Icon className="mr-3" />}
						<span>{menu.title}</span>
					</li>
				);
			})}
		</ul>
	)
}

export default Menus;