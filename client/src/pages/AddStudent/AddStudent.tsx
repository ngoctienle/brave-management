import React, { useMemo, useState } from 'react'
import { useMatch, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { Student } from 'types/students.type'
import { addStudent, editStudent, getStudentInfo } from 'apis/students.api'
import { isAxiosError } from 'utils/hooks'

type FormStateType = Omit<Student, 'id'> | Student
type FormError =
  | {
    [key in keyof FormStateType]: string
  }
  | null
const initialFormState: FormStateType = {
  email: '',
  country: '',
  first_name: '',
  last_name: '',
  avatar: '',
  gender: 'other',
  btc_address: ''
}

export default function AddStudent() {
  const [formState, setFormState] = useState<FormStateType>(initialFormState)
  const addMatch = useMatch('/students/add')
  const { id } = useParams()
  const queryClient = useQueryClient()
  const isAdd = Boolean(addMatch)

  const addStudentMutation = useMutation({
    mutationFn: (body: FormStateType) => {
      return addStudent(body)
    }
  })

  useQuery({
    queryKey: ['StudentInfo', id],
    queryFn: () => getStudentInfo(id as string),
    enabled: id !== undefined,
    onSuccess: (data) => setFormState(data.data)
  })

  const editStudentMutation = useMutation({
    mutationFn: (_) => editStudent(id as string, formState as Student),
    onSuccess: (data) => {
      queryClient.setQueryData(['StudentInfo', id], data)
    }
  })

  const errorForm: FormError = useMemo(() => {
    const error = isAdd ? addStudentMutation.error : editStudentMutation.error

    if (isAxiosError<{ error: FormError }>(error) && error.response?.status) {
      return error.response?.data.error
    }
    return null
  }, [addStudentMutation.error, isAdd, editStudentMutation.error])

  const handleChange = (name: keyof FormStateType) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [name]: event.target.value }))
    if (addStudentMutation.data || addStudentMutation.error) {
      addStudentMutation.reset()
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isAdd) {
      addStudentMutation.mutate(formState, {
        onSuccess: () => {
          setFormState(initialFormState)
          toast.success('Add th??nh c??ng!')
        }
      })
    } else {
      editStudentMutation.mutate(undefined, {
        onSuccess: (_) => toast.success('Update th??nh c??ng!')
      })
    }
  }

  return (
    <div>
      <h1 className='text-lg'>{isAdd ? 'Add' : 'Edit'} Student</h1>
      <form className='mt-6' onSubmit={handleSubmit} noValidate>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='email'
            name='floating_email'
            id='floating_email'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
            placeholder=' '
            value={formState.email}
            onChange={handleChange('email')}
            required
          />
          <label
            htmlFor='floating_email'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
          >
            Email address
          </label>

          {errorForm && (
            <p className='mt-2 text-sm text-red-600'>
              <span className='font-medium'>L???i!</span>
              {errorForm.email}
            </p>
          )}
        </div>

        <div className='group relative z-0 mb-6 w-full'>
          <div className='mb-4 flex items-center'>
            <input
              id='gender-1'
              type='radio'
              name='gender'
              value='male'
              checked={formState.gender === 'male'}
              onChange={handleChange('gender')}
              className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500'
            />
            <label htmlFor='gender-1' className='ml-2 text-sm font-medium text-gray-900'>
              Male
            </label>
          </div>
          <div className='mb-4 flex items-center'>
            <input
              id='gender-2'
              type='radio'
              name='gender'
              value='female'
              checked={formState.gender === 'female'}
              onChange={handleChange('gender')}
              className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500'
            />
            <label htmlFor='gender-2' className='ml-2 text-sm font-medium text-gray-900'>
              Female
            </label>
          </div>
          <div className='flex items-center'>
            <input
              id='gender-3'
              type='radio'
              name='gender'
              value='other'
              checked={formState.gender === 'other'}
              onChange={handleChange('gender')}
              className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500'
            />
            <label htmlFor='gender-3' className='ml-2 text-sm font-medium text-gray-900'>
              Other
            </label>
          </div>
        </div>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='country'
            value={formState.country}
            onChange={handleChange('country')}
            id='country'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
            placeholder=' '
            required
          />
          <label
            htmlFor='country'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
          >
            Country
          </label>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='tel'
              name='first_name'
              value={formState.first_name}
              onChange={handleChange('first_name')}
              id='first_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
              placeholder=' '
              required
            />
            <label
              htmlFor='first_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
            >
              First Name
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='last_name'
              id='last_name'
              value={formState.last_name}
              onChange={handleChange('last_name')}
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
              placeholder=' '
              required
            />
            <label
              htmlFor='last_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
            >
              Last Name
            </label>
          </div>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='avatar'
              id='avatar'
              value={formState.avatar}
              onChange={handleChange('avatar')}
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
              placeholder=' '
              required
            />
            <label
              htmlFor='avatar'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
            >
              Avatar Base64
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='btc_address'
              id='btc_address'
              value={formState.btc_address}
              onChange={handleChange('btc_address')}
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
              placeholder=' '
              required
            />
            <label
              htmlFor='btc_address'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
            >
              BTC Address
            </label>
          </div>
        </div>

        <button
          type='submit'
          className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto'
        >
          {isAdd ? 'Add' : 'Update'}
        </button>
      </form>
    </div>
  )
}
