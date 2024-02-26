'use client'

import React, { useEffect, useState } from 'react'

import useSWR from 'swr';
import { useMobxStore } from 'lib/mobx/store-provider';
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui"
import { Button, Input } from "@repo/ui"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui"
import { ColumnDef } from 'types/table-data'
import { toast } from 'sonner'

interface CreateColumnFormProps {
  // localTable: any;
  setLocalColumns: any;
  setLocalData: any;
}

const typeValues = ["date", "text", "number", "boolean"] as const;

const formSchema = z.object({
  columnname: z.string().min(2, {
    message: "columnname must be at least 2 characters.",
  }),
  type: z.enum(typeValues),
  defaultValue: z.string().optional(),
  referenceTable: z.string().optional(),
  referenceColumn: z.string().optional(),
})

const CreateColumnForm = ({
  // localTable,
  setLocalColumns,
  setLocalData,
}: CreateColumnFormProps ) => {
  const [open, setOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any>( );
  const [columnOfTable, setColumnOfTable] = useState<any[]>();

  // const []
  const {
    tableData: { fetchTables },
    projectData: { currentProjectId },
  } = useMobxStore();

  const { data, isLoading, error, mutate } = useSWR(
    `TABLE_DATA-${currentProjectId}-all`,
    () => fetchTables(),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    if (selectedTable) {
      console.log("Selected Table: ", selectedTable);
      const columns = selectedTable.columns.map(col => ({
        id: col.id,
        label: col.label,
      }));
      setColumnOfTable(columns)
    }
  }, [selectedTable])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    
    const data: ColumnDef = {
      id: values.columnname,
      label: values.columnname,
      type: values.type,
      defaultValue: values.defaultValue,
      isActive: true,
      isPrimaryKey: false,
      isForeignKey: false,
      foreignKeyId: `${values.referenceTable}-${values.referenceColumn}`,
    }

    setLocalData(previous => {
      const newData = previous.map((data) => {
        data[values.columnname] = values.defaultValue;
        return data
      })

      return newData;
    })
    setLocalColumns(previous => [ ...previous, data]);

    form.reset();
    setOpen(false);

    toast.success("Column has been created.", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })
  }

  const references =  data?.map((data) => ({
    id: data.id,
    tablename: data.name,
  }));

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button variant={"default"} onClick={() => setOpen(true)}>
          Add Column
        </Button>
      </SheetTrigger>

      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
              control={form.control}
              name="columnname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Column Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type for column" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="text">text</SelectItem>
                      <SelectItem value="number">number</SelectItem>
                      <SelectItem value="boolean">boolean</SelectItem>
                      <SelectItem value="date">date</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="referenceTable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference Table</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const table = data.find(table => table.id === value);
                      setSelectedTable(table);
                      return field.onChange(value)
                    }}
                    // defaultValue={field.value}
                    // value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {references && references.map((ref, index) => (
                        <SelectItem key={index} value={ref.id}>
                          {ref.tablename}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedTable === undefined ? null : (
              <FormField
                control={form.control}
                name="referenceColumn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Column</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        // setSelectedTable(value)
                        return field.onChange(value)
                      }}
                      // defaultValue={field.value}
                      // value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {columnOfTable && columnOfTable.map((ref, index) => (
                          <SelectItem key={index} value={ref.id}>
                            {ref.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="defaultValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Value</FormLabel>
                  <FormControl>
                    <Input placeholder="DEFAULT" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit"
              disabled={isSubmitting}  
            >Submit</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default CreateColumnForm