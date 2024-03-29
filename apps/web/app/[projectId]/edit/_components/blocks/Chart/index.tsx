import styles from './style.module.css';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { getClassNameFactory } from 'lib';
import { Type, ChevronDown } from 'react-feather';

import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { ChartTypeRegistry } from 'chart.js/auto';

const getClassNameInput = getClassNameFactory('Input', styles);

export type ChartsProps = {
  config: {
    url: string;
    title: string;
    chartType: string;
    width: string;
    height: string;
  };
};

const chartTypes = [
  'bar',
  'line',
  'pie',
  'doughnut',
  'polarArea',
  'radar',
  'scatter',
  'bubble',
];

const cssValueCheck = (value: string) =>
  /\d+(\.\d+)?(%|px|em|rem|(d|s|l)v(w|h))/g.test(value);

export const Charts: ComponentConfig<ChartsProps> = {
  fields: {
    config: {
      type: 'custom',
      render: ({ value, onChange }) => {
        const Select = ({ prop, name }) => {
          return (
            <label className={getClassNameInput()}>
              <div className={getClassNameInput('label')}>
                <div className={getClassNameInput('labelIcon')}>
                  <ChevronDown size={16} />
                </div>
                {name as string}
              </div>
              <select
                className={getClassNameInput('input')}
                onChange={(e) => {
                  const clone = structuredClone(value);
                  clone[prop] = e.currentTarget.value;

                  onChange(clone);
                  console.log(clone);
                }}
                value={value[prop]}
              >
                {chartTypes.map((option) => (
                  <option key={option} label={option} value={option} />
                ))}
              </select>
            </label>
          );
        };

        const Input = ({
          prop,
          name,
          checkCallback,
        }: {
          prop: string;
          name: string;
          // eslint-disable-next-line no-unused-vars
          checkCallback?: (value: string) => boolean;
        }) => {
          return (
            <label className={getClassNameInput()}>
              <div className={getClassNameInput('label')}>
                <div className={getClassNameInput('labelIcon')}>
                  <Type size={16} />
                </div>
                {name}
              </div>
              <input
                type="text"
                className={getClassNameInput('input')}
                autoComplete="off"
                onBlur={(e) => {
                  const clone = structuredClone(value);
                  clone[prop] = e.currentTarget.value;

                  if (!checkCallback || checkCallback(e.currentTarget.value))
                    onChange(clone);
                }}
                defaultValue={value[prop]}
              />
            </label>
          );
        };
        return (
          <div>
            <Input prop="title" name="Title" />
            <Select prop="chartType" name="Chart Type" />
            <Input
              prop="width"
              name="Width (in %, px, em, etc)"
              checkCallback={cssValueCheck}
            />
            <Input
              prop="height"
              name="Height (in %, px, em, etc)"
              checkCallback={cssValueCheck}
            />
            <Input prop="url" name="Data source URL" />
          </div>
        );
      },
    },
  },
  defaultProps: {
    config: {
      url: '',
      title: 'Title',
      chartType: 'bar',
      width: '100%',
      height: '600px',
    },
  },
  render: ({ config }) => {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          padding: '20px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            width: config.width,
            height: config.height,
          }}
        >
          <Chart
            type={config.chartType as keyof ChartTypeRegistry}
            data={{
              labels: [],
              datasets: [
                {
                  label: '',
                  data: [],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
            }}
          />
        </div>
        <div
          style={{
            fontSize: '1.5rem',
          }}
        >
          {config.title}
        </div>
      </div>
    );
  },
};
