import http from 'utils/http'

import { Student, StudentList } from 'types/students.type'

export const getStudents = (page: number | string, limit: number | string) =>
  http.get<StudentList>('students', {
    params: {
      _page: page,
      _limit: limit
    }
  })

export const addStudent = (student: Omit<Student, 'id'>) => http.post<Student>('students', student)
