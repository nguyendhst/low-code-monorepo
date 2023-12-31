"use client";

import { useParams } from "next/navigation";
import { TableEditor } from "../components/TableEditor";

export default function Page() {
   const params = useParams();

   return (
      <>
         <TableEditor
            projectId={params["project-id"].toString()}
            tableId={params["table-id"].toString()}
         />
      </>
   );
}
