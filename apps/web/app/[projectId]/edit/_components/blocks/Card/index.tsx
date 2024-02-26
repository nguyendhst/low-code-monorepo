/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { ComponentConfig } from '@measured/puck';
import styles from './styles.module.css';
import getClassNameFactory from 'lib/classname-factory/get-classname-factory';
import dynamic from 'next/dynamic';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

const getClassName = getClassNameFactory('Card', styles);

// eslint-disable-next-line unicorn/no-array-reduce
const icons = Object.keys(dynamicIconImports).reduce((acc, iconName) => {
  const El = dynamic(dynamicIconImports[iconName]);

  return {
    ...acc,
    [iconName]: <El />,
  };
}, {});

const iconOptions = Object.keys(dynamicIconImports).map((iconName) => ({
  label: iconName,
  value: iconName,
}));

export type CardProps = {
  title: string;
  description: string;
  icon?: 'Feather';
  mode: 'flat' | 'card';
};

export const Card: ComponentConfig<CardProps> = {
  fields: {
    title: { type: 'text' },
    description: { type: 'textarea' },
    icon: {
      type: 'select',
      options: iconOptions,
    },
    mode: {
      type: 'radio',
      options: [
        { label: 'card', value: 'card' },
        { label: 'flat', value: 'flat' },
      ],
    },
  },
  defaultProps: {
    title: 'Title',
    description: 'Description',
    icon: 'Feather',
    mode: 'flat',
  },
  render: ({ title, icon, description, mode }) => {
    return (
      <div className={getClassName({ [mode]: mode })}>
        <div className={getClassName('icon')}>{icons[icon!]}</div>
        <div className={getClassName('title')}>{title}</div>
        <div className={getClassName('description')}>{description}</div>
      </div>
    );
  },
};
