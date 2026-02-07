import React from 'react';

interface Props {
	type: 'breakfast' | 'lunch' | 'dinner';
}

const Meals = ({ type }: Props) => {
	return <div>{type}</div>;
};

export default Meals;
