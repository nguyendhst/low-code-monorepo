"use client";

import { ColumnHelper } from "@tanstack/react-table";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Reducer, useEffect, useReducer, useRef, useState } from "react";
import { TableData, ColumnProps } from "../../../../interfaces/TableData";
import { ColumnConfigMenu } from "./ColumnConfigMenu";
import { RowConfigMenu } from "./RowConfigMenu";
import "./style.css";
import { TableCanva } from "./TableCanva";
import { TableEditorSidebar } from "./TableEditorSidebar";

import { Key } from "react-feather";

const mockApiBuilder = (projectId: string) => {
   const base = process.env["NEXT_PUBLIC_BASE_URL"];
   return `${base}/api/mock/${projectId}`;
};

type CanvaAction =
   | { type: "open-config-add-column" }
   | { type: "open-config-insert-row" }
   | { type: "close-config" }
   | { type: "open-config" }
   | { type: "edit-config" }
   | {
        type: "add-column";
        isSaved?: boolean;
        isError?: boolean;
     }
   | { type: "add-row" }
   | { type: "remove-column" }
   | { type: "remove-row" }
   | { type: "select-table"; tableId: string }
   | { type: "set-data"; payload?: TableData; isError?: boolean };

type CanvaState = {
   isLoaded?: boolean;
   isLoading?: boolean;
   isSaving?: boolean;
   isModified?: boolean;

   isRowConfigOpen?: boolean;
   isColumnConfigOpen?: boolean;

   isError?: boolean;
   errorMessage?: string;

   tableId: string;
   projectId: string;
   data?: TableData;
};

type TableEditorProps = {
   projectId: string;
   tableId: string;
};

export type TableCanvaProps = {
   state: CanvaState;
   dispatch: any;
};

const canvaReducer: Reducer<CanvaState, CanvaAction> = (state, action) => {
   switch (action.type) {
      case "open-config-add-column":
         return { ...state, isColumnConfigOpen: true };
      case "open-config-insert-row":
         return { ...state, isRowConfigOpen: true };
      case "close-config":
         return { ...state, isColumnConfigOpen: false, isRowConfigOpen: false };
      case "edit-config":
         return { ...state };
      case "add-row":
         return { ...state };
      case "remove-column":
         return { ...state };
      case "remove-row":
         return { ...state };
      case "select-table": // change table
         return {
            ...state,
            tableId: action.tableId,
            isColumnConfigOpen: false,
            isRowConfigOpen: false,
         };
      case "set-data":
         return { ...state, data: action.payload };

      case "add-column":
         console.log("add-column", action.isSaved);
         return {
            ...state,
            isModified: action.isSaved,
         };
      default:
         throw new Error();
   }
};

const fetchTable = async (projectId: string, tableId: string) => {
   const data = await axios
      .get(`${mockApiBuilder(projectId)}/data/${tableId}`)
      .then((res) => res.data);
   return data;
};

const fetchTableData = async (projectId, tableId, dispatch) => {
   console.log("fetching table data");
   if (projectId && tableId) {
      try {
         const data = await fetchTable(projectId, tableId);
         dispatch({
            type: "set-data",
            payload: data,
         });
      } catch (error) {
         console.error(error);
         dispatch({
            type: "set-data",
            isError: true,
         });
      }
   }
};

const useTableEditor = (projectId, tableId) => {
   const [canvaState, canvaDispatch] = useReducer(canvaReducer, {
      tableId: tableId,
      projectId: projectId,
   });

   const [updateTrigger, setUpdateTrigger] = useState(false);

   const dispatchWithTrigger = (action) => {
      canvaDispatch(action);
      setUpdateTrigger((prev) => !prev); // Toggle the trigger state
   };

   useEffect(() => {
      fetchTableData(projectId, tableId, canvaDispatch);
   }, [projectId, tableId, canvaDispatch, updateTrigger]);
   // we return two dispatches, one with trigger and one without
   // the one with trigger is used when we want to force trigger a re-fetch of table data
   return [canvaState, canvaDispatch, dispatchWithTrigger] as const;
};

//const FilterToolbarItem = () => (
//   <div className="filter-toolbar-item" style={{ margin: "10px" }}>
//      <Dropdown
//         title={"Filter"}
//         options={[
//            { value: "filter", label: "Filter" },
//            { value: "sort", label: "Sort" },
//         ]}
//         onSelect={(value) => console.log(value)}
//      />
//   </div>
//);

const InsertToolbarItem = ({ dispatch }) => (
   <div className="insert-toolbar-item" style={{ margin: "10px" }}>
      <Dropdown
         title={"Insert"}
         dispatch={dispatch}
         options={[
            {
               value: "column",
               label: "Column",
               description: "Add New Column",
               dispatcher: "open-config-add-column",
            },
            {
               value: "row",
               label: "Row",
               description: "Add New Row",
               dispatcher: "open-config-insert-row",
            },
         ]}
         onSelect={() => dispatch({ type: "close-config" })}
      />
   </div>
);

const Dropdown = ({ title, dispatch, options, onSelect }) => {
   const [isOpen, setIsOpen] = useState(false);

   const dropdownRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
         ) {
            setIsOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   return (
      <div ref={dropdownRef} className={`dropdown ${isOpen ? "show" : ""}`}>
         <style jsx>{`
            .dropdown {
               position: relative;
               display: inline-block;
            }

            .dropdown-header {
               padding: 10px;
               font-size: 16px;
               cursor: pointer;
            }

            .dropdown-header:hover,
            .dropdown-header:focus {
               background-color: var(--puck-color-rose-8);
               border-radius: 20px;
            }

            .dropdown-list {
               display: none;
               position: absolute;
               background-color: #f9f9f9;
               padding: 10px;
               min-width: 160px;
               box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
               z-index: 1;
            }

            .dropdown-list div {
               color: black;
               padding: 20px 16px;
               text-decoration: none;
               display: block;
               font-size: 14px;
               border-bottom: 1px solid #ccc;
            }

            .dropdown-list div:hover {
               background-color: #f1f1f1;
            }

            .dropdown.show .dropdown-list {
               display: block;
            }
         `}</style>
         <div
            className="dropdown-header"
            tabIndex={0}
            onClick={() => setIsOpen((prev) => !prev)}
            onKeyDown={(event) => {
               if (event.key === "Enter" || event.key === " ") {
                  setIsOpen((prev) => !prev);
               }
            }}
         >
            {title}
         </div>
         {isOpen && (
            <div className="dropdown-list">
               {options.map((option) => (
                  <DropdownOption
                     key={option.value}
                     value={option.value}
                     onSelect={(value) => {
                        onSelect();
                        dispatch({
                           type: option.dispatcher,
                        });
                        setIsOpen(false);
                     }}
                  >
                     {option.label}
                     <div style={{ fontSize: "12px" }}>
                        {option.description}
                     </div>
                  </DropdownOption>
               ))}
            </div>
         )}
      </div>
   );
};

const DropdownOption = ({ value, children, onSelect }) => (
   <div
      className="dropdown-option"
      onClick={() => onSelect(value)}
      onKeyDown={(e) => {
         if (e.key === "Enter") {
            onSelect(value);
         }
      }}
   >
      {children}
   </div>
);
export function CanvaToolbar({ dispatch }) {
   const [selectedTool, setSelectedTool] = useState(null);

   return (
      <div
         className="canva-toolbar"
         style={{
            backgroundColor: "var(--puck-color-rose-7)",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "10px",
            borderRadius: "10px",
         }}
      >
         {/*<FilterToolbarItem />*/}
         <InsertToolbarItem dispatch={dispatch} />
      </div>
   );
}
const columnRoleIconMapping = (role: string) => {
   switch (role) {
      case "primary":
         return <Key size={12} />;
      default:
         return null;
   }
};

export const parseColumns = (
   columnsHelper: ColumnHelper<unknown>,
   columns: ColumnProps[],
   onAddColumn?: any
) => {
   const cols = columns.map((column) => {
      return columnsHelper.accessor(column.key, {
         id: column.key,
         header: () => {
            return column.role ? (
               <div
                  style={{
                     padding: "5px",
                     display: "flex",
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "flex-start",
                  }}
               >
                  {columnRoleIconMapping(column.role)}
                  {column.label}
                  <span
                     style={{
                        fontSize: "12px",
                        paddingLeft: "5px",
                     }}
                  >
                     {column.type}
                  </span>
               </div>
            ) : (
               <div
                  style={{
                     padding: "5px",
                     display: "flex",
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "flex-start",
                  }}
               >
                  {column.label}
                  <span
                     style={{
                        fontSize: "12px",
                        paddingLeft: "5px",
                     }}
                  >
                     {column.type}
                  </span>
               </div>
            );
         },
         cell: (props) => {
            return <div>{props.getValue()}</div>;
         },
      });
   });

   const addCol = columnsHelper.accessor("add-column", {
      id: "add-column",
      header: () => (
         <button
            onClick={() => {
               onAddColumn({ type: "open-config-add-column" });
            }}
         >
            Add Column
         </button>
      ),
      cell: () => {
         return <div style={{ border: "1px dotted black" }}></div>;
      },
   });

   return [...cols, addCol];
};

function checkDuplicateColumnLabel(label, cols: ColumnProps[]): boolean {
   return cols.some((col) => col.label === label);
}

export function TableEditor({
   projectId,
   tableId,
}: Readonly<TableEditorProps>) {
   const [canva, canvaDispatch, dispatchWithTrigger] = useTableEditor(
      projectId,
      tableId
   );

   const router = useRouter();

   useEffect(() => {
      if (canva.tableId != tableId) {
         // [projectId/data/[tableId]]
         router.push(
            `${window.location.origin}/${projectId}/data/${canva.tableId}`
         );
      }
   }, [canva]);

   return (
      <div className="editor-container">
         {/* Shows list of tables available */}
         <TableEditorSidebar
            projectId={projectId}
            tableId={canva.tableId}
            onChange={canvaDispatch}
         />
         {/* Canva for editing selected table */}
         {tableId ? (
            <TableCanva state={canva} dispatch={canvaDispatch} />
         ) : (
            <div
               style={{
                  display: "flex",
                  justifyContent: "center",
                  flexGrow: 1,
                  alignItems: "center",
                  height: "100vh",
                  fontSize: "20px",
                  color: "#333",
                  backgroundColor: "#f5f5f5",
               }}
            >
               Select a Table
            </div>
         )}

         <RowConfigMenu
            projectId={projectId}
            tableId={tableId}
            rowProps={canva.data?.columns ?? []}
            duplicationCheck={(val) =>
               checkDuplicateColumnLabel(val, canva.data?.columns ?? [])
            }
            isOpen={canva.isRowConfigOpen}
            dispatch={canvaDispatch}
            dispatchWithTrigger={dispatchWithTrigger}
         />
         <ColumnConfigMenu
            projectId={projectId}
            tableId={tableId}
            isOpen={canva.isColumnConfigOpen}
            duplicationCheck={(val) =>
               checkDuplicateColumnLabel(val, canva.data?.columns ?? [])
            }
            dispatch={canvaDispatch}
            dispatchWithTrigger={dispatchWithTrigger}
         />
      </div>
   );
}