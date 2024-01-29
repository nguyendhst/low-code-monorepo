'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Button,
  Label,
  Separator,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  CardButtonWithIcon,
} from '@repo/ui';

import { Database, Download, PlusSquare, Table, User } from 'react-feather';
import {
  DataTable,
  columns,
  mockTableData,
} from './_components/table-list/table-list';
import { TextWithIcon } from 'components/text/text-with-icon';
import { OptionDialog } from './_components/table-list/options-cards';
import { useMobxStore } from '../../../lib/mobx/store-provider';
import React from 'react';

export default function Page() {
  const {
    projectData: { currentProjectId },
  } = useMobxStore();

  console.log('currentProjectId', currentProjectId);
  return (
    <>
      <DatabaseTabs />
    </>
  );
}

const ButtonWithIcon = ({ children, icon, ...props }) => (
  <Button className="flex items-center space-x-2" {...props}>
    {icon}
    {children}
  </Button>
);

//const CardButtonWithIcon = React.forwardRef<
//HTMLDivElement,
//React.HTMLAttributes<HTMLDivElement>>({ children, icon, onClick, ...props }, ref) => (
//  <button
//    onClick={onClick}
//    className="rounded-custom transition-colors duration-200"
//  >
//    <Card
//      className="flex items-start space-x-2 w-64 h-32 hover:bg-gray-200"
//      {...props}
//    >
//      <CardHeader className="flex flex-col space-y-4">
//        <>{icon}</>
//        <CardDescription>{children}</CardDescription>
//      </CardHeader>
//    </Card>
//  </button>
//);

const HorizontalList = ({ children, ...props }) => (
  <ul className="flex space-x-4" {...props}>
    {children}
  </ul>
);

export function DatabaseTabs() {
  return (
    <Tabs defaultValue="tables" className="w-11/12 m-4">
      <TabsList className="flex justify-start space-x-28">
        <TabsTrigger value="tables">
          <TextWithIcon icon={<Table />}>Tables</TextWithIcon>
        </TabsTrigger>
        <TabsTrigger value="members">
          <TextWithIcon icon={<User />}>Members</TextWithIcon>
        </TabsTrigger>
        <TabsTrigger value="sources">
          <TextWithIcon icon={<Download />}>Data Sources</TextWithIcon>
        </TabsTrigger>
      </TabsList>

      <Separator className="my-4" />

      <TabsContent value="tables">
        <div className="container mx-auto">
          <HorizontalList>
            <OptionDialog
              trigger={
                <CardButtonWithIcon
                  className="flex flex-col justify-between items-start space-y-2 w-64 h-32 p-4 hover:bg-gray-200 "
                  icon={<PlusSquare size={40} />}
                  onClick={() => console.log('Card')}
                >
                  <span className="text-xl font-light">Add Table</span>
                </CardButtonWithIcon>
              }
            >
              <DialogHeader>
                <DialogTitle>Create Table</DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <Button>Save</Button>
              </DialogFooter>
            </OptionDialog>

            <CardButtonWithIcon
              className="flex flex-col justify-between items-start space-y-2 w-64 h-32 p-4 hover:bg-gray-200 "
              icon={<Download size={40} />}
              onClick={() => console.log('Card')}
            >
              <span className="text-xl font-light">Import</span>
            </CardButtonWithIcon>
            <CardButtonWithIcon
              className="flex flex-col justify-between items-start space-y-2 w-64 h-32 p-4 hover:bg-gray-200 "
              icon={<Database size={40} />}
              onClick={() => console.log('Card')}
            >
              <span className="text-xl font-light">Add Data Source</span>
            </CardButtonWithIcon>
          </HorizontalList>

          <Separator className="my-4" />

          <DataTable columns={columns} data={mockTableData} />
        </div>
      </TabsContent>
      <TabsContent value="members">
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              Change your members here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current members</Label>
              <Input id="current" type="members" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New members</Label>
              <Input id="new" type="members" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save members</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="sources">d</TabsContent>
    </Tabs>
  );
}
