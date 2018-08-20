const { div, br, hr, h1, input, button, label, span, i, ul, li } = redda.dom
const { rnd_id, reduc } = redda.utils
const state = redda.state()

const todo_form = () => ''
const update_form = (_, new_text) => new_text

state.add(todo_form, update_form)

const todo_input = state.conn(
  ({ todo_form }) => [
    div,
    { class: 'input-field col s10 inline' },
    [
      input,
      {
        id: 'what_to_do',
        type: 'text',
        onkeydown: ev =>
          setTimeout(() => state.disp(update_form, ev.target.value || '')),
        value: todo_form
      }
    ],
    [label, { for: 'what_to_do' }, 'What to do?']
  ],
  todo_form
)

const todos = () => ({
  list: [
    { id: rnd_id(), note: 'State management', done: true },
    { id: rnd_id(), note: 'Event handling', done: true },
    { id: rnd_id(), note: 'Reuse existing DOM', done: true },
    { id: rnd_id(), note: 'Meaningful error messages', done: false },
    { id: rnd_id(), note: 'Add more tests', done: false },
    { id: rnd_id(), note: 'Other goodies', done: false }
  ]
})

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
    ul,
    { id: 'todo_list', class: `collection z-depth-${list.length ? 2 : 0}` },
    ...reduc(list, [], (acc, { id, note, done }) => [
      ...acc,

      [
        li,
        {
          id,
          class: 'collection-item',
          style: done
            ? { 'text-decoration': 'line-through', 'font-style': 'italic' }
            : null
        },
        [
          button,
          {
            class: 'waves-effect waves-teal btn-flat',
            onclick: () => state.disp(remove_todo, id),
            style: {
              padding: '0 9px',
              'margin-right': '5px',
              'border-radius': '50%'
            }
          },
          [
            i,
            {
              class: 'material-icons center'
            },
            'delete'
          ]
        ],
        [
          div,
          { class: 'secondary-content', style: { 'margin-top': '0.4em' } },
          [
            label,
            [
              input,
              {
                onclick: () => state.disp(toggle_todo, id),
                type: 'checkbox',
                checked: done ? 'checked' : null
              }
            ],
            [span, 'Done']
          ]
        ],
        [span, note]
      ]
    ])
  ],
  todos
)

const add_todo_button = state.conn(
  ({ todo_form }) => [
    button,
    {
      class: 'waves-effect waves-light btn-large col s2',
      disabled: !!todo_form ? null : 'disabled',
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
  { id: 'todos', class: 'container' },
  [
    div,
    { class: 'row' },
    [div, { class: 'col l2' }],
    [
      div,
      { class: 'col l8 m12' },
      [h1, 'REDDA TODOs'],
      [div, { class: 'row' }, [todo_input], [add_todo_button]],
      [todo_list]
    ],
    [div, { class: 'col l2' }]
  ]
]

const app_cont = document.getElementById('app-cont')
const render_app = redda.render(app_cont, [app])

state.on_change(() => (render_app(), M.updateTextFields()))
