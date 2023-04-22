import { Select } from '@chakra-ui/react'

import { setFilter } from '../store'
import { useDispatch, useSelector } from 'react-redux'

const TodoFilter = () => {
  const dispatch = useDispatch()
  const { filter } = useSelector((state) => state.todo)

  return (
    <Select
      value={filter}
      onChange={(e) => dispatch(setFilter(e.target.value))}
      mt="1rem"
    >
      <option value="all">All</option>
      <option value="completed">Completed</option>
      <option value="active">Uncompleted</option>
    </Select>
  )
}
export default TodoFilter
