import http from 'utils/http'

import { StudentList } from 'types/students.type'

export const getStudents = (page: number | string, limit: number | string) => {
  return http.get<StudentList>('students', {
    params: {
      _page: page,
      _limit: limit
    }
  })
}
