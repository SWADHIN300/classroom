import { CreateButton } from '@/components/refine-ui/buttons/create'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DEPARTMENT_OPTION } from '@/constants'
import { Subject } from '@/types'
import type { CrudFilters } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import React, { useMemo, useState } from 'react'

const SubjectList = () => {
    const [searchQuery,setSearchQuery] = useState('');
    const [selectDepartment,setSelectDepartment] = useState('all');

    const departmentFilters: CrudFilters = selectDepartment === 'all' ? [] : [
      {field: 'department', operator: 'eq' as const, value: selectDepartment}];
    const searchFilters: CrudFilters = searchQuery ? [
      { field: 'name',operator:'contains' as const,value:searchQuery }
    ]: [];

    
    const subjectTable = useTable<Subject>({
      columns:  useMemo<ColumnDef<Subject>[]>(() =>[
        {
          id: 'code',
          accessorKey: 'code',
          size: 100,
          header: () => <p className='column-title ml-2'>Code</p>,
          cell: ({ getValue}) => <Badge>{getValue<string>()}</Badge>
        },{
          id:'name',
          accessorKey: 'name',
          size:200,
          header: () => <p className='column-title'>Name</p>,
          cell: ({ getValue}) => <span
               className='text-foreground'>{getValue<string>() }</span>,
          filterFn: 'includesString'
        },{
          id:'department',
          accessorKey: 'department',
          size: 150,
          header: () => <p className='column-title'>Department</p>,
          cell: ({ getValue }) => <Badge 
           variant="secondary">{getValue<string>()}</Badge>,
        },{
          id:'description',
          accessorKey: 'description',
          size: 300,
          header: () => <p className='column-title'>Description</p>,
          cell: ({ getValue }) => <span className='truncate line-clamp-2'>{getValue<string>()}</span>
        }
      ],[]),
      refineCoreProps:{
        resource: 'subjects',
        pagination: { pageSize:10 , mode:'server' },
        filters: {
          permanent: [...departmentFilters, ...searchFilters]
        },
        sorters: {
          initial:[
            { field:'id',order:'desc'},
          ]
        },
      }
    });

  return (
   <ListView>
      <Breadcrumb />

      <h1 className='page-title'>Subjects</h1>

      <div className='intro-row'>
          <p>Qucik Access to Essential Metrics</p>

          <div className='actions-row'>
              <div className='search-field'>
                <Search className='search-icon pointer-events-none' />

                <Input
                 type="text"
                 placeholder='Search by name'
                 className='pl-10 w-full'
                 value={searchQuery}
                 onChange={(e)=>setSearchQuery(e.target.value)}
                />
              </div>
              <div className='flex gap-2 w-full sm:w-auto'>
                  <Select 
                    value={selectDepartment}
                    onValueChange={setSelectDepartment}
                  >
                     <SelectTrigger>
                        <SelectValue placeholder="Filter by department" />
                     </SelectTrigger>

                     <SelectContent>
                       <SelectItem value='all'>
                           All Department
                       </SelectItem>
                       {DEPARTMENT_OPTION.map(depart =>(
                        <SelectItem key={depart.value}
                            value={depart.value}>
                                 {depart.Label}
                            </SelectItem>
                       ))}
                     </SelectContent>
                  </Select>

                  <CreateButton />
              </div>
          </div>
      </div>

      <DataTable table={subjectTable} />
   </ListView>
  )
}

export default SubjectList
