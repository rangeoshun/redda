const { div, br, hr, h1, input, button } = redda.dom
const { rnd_id, reduc } = redda.utils
const state = redda.state()

const todo_form = () => ''
const update_form = (_, new_text) => new_text

state.add(todo_form, update_form)

const todo_input = state.conn(
  ({ todo_form }) => [
    input,
    {
      type: 'text',
      onkeypress: ev => (
        ev.preventDefault(),
        state.disp(update_form, (ev.target.value || '') + ev.key)
      ),
      value: todo_form
    }
  ],
  todo_form
)

const todos = () => ({ list: [] })
const add_todo = ({ list }, new_todo) => ({
  list: [
    ...list,
    {
      id: rnd_id(),
      note: new_todo,
      done: false
    }
  ]
})

const toggle_todo = ({ list }, id) => ({
  list: list.map(
    item => (item.id === id && { ...item, done: !item.done }) || item
  )
})

const remove_todo = ({ list }, id) => ({
  list: list.filter(item => item.id !== id)
})

state.add(todos, add_todo, toggle_todo, remove_todo)

const todo_list = state.conn(
  ({ todos: { list } }) => [
    div,
    { id: 'todo_list' },
    ...reduc(list, [], (acc, { id, note, done }) => [
      ...acc,
      [
        div,
        {
          id,
          style: done
            ? { 'text-decoration': 'line-through', 'font-style': 'italic' }
            : null
        },
        [button, { onclick: () => state.disp(remove_todo, id) }, 'REMOVE'],
        [
          button,
          { onclick: () => state.disp(toggle_todo, id) },
          done ? 'UNDONE' : 'DONE'
        ],
        note
      ],
      [hr]
    ])
  ],
  todos
)

const add_todo_button = state.conn(
  ({ todo_form }) => [
    button,
    {
      disabled: todo_form.length ? null : 'disabled',
      onclick: () =>
        !!todo_form &&
        (state.disp(add_todo, todo_form), state.disp(update_form, ''))
    },
    'ADD TODO'
  ],
  todo_form,
  todos
)

const app = () => [
  div,
  { id: 'todos' },
  [h1, 'REDDA TODO'],
  [br],
  [todo_input],
  [add_todo_button],
  [hr],
  [todo_list]
]

const render_app = redda.render(document.getElementById('app-cont'), [app])

state.on_change(render_app)
