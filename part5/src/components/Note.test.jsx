import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  }

  const mockHandler = vi.fn()

  render(<Note note={note} toggleImportance={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)

  // render(<Note note={note} />)
  // screen.debug()

  // const element = screen.getByText(
  //   'Component testing is done with react-testing-library',
  // )
  // screen.debug(element)
  // expect(element).toBeDefined()

  // Con selectores css

  // const { container } = render(<Note note={note} />)

  // const div = container.querySelector('.note')
  // expect(div).toHaveTextContent(
  //   'Component testing is done with react-testing-library',
  // )
  // La prueba falla si getByText no encuentra el elemento que está buscando.
})
