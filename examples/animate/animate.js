const { div, br, hr, h1, input, button, label, span, i, ul, li } = redda.dom
const { rnd_id, reduc } = redda.utils
const state = redda.state()

const positions = () => []
const add_position = (positions, new_position) => [...positions, new_position]
const update_positions = (_, positions) => positions

state.add(positions, add_position, update_positions)

const box = ({ x, y, r }) => [
  div,
  {
    class: 'box',
    style: {
      transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`,
      width: `${r}px`,
      height: `${r}px`
    }
  }
]

const boxes = state.conn(
  ({ positions }) => [
    div,
    { class: 'boxes' },
    [span, { class: 'counter' }, positions.length.toString()],
    ...((positions && positions.map((pos) => [box, pos])) || [])
  ],
  positions
)

const app_cont = document.getElementById('app-cont')
const render_app = redda.render(app_cont, [boxes])

state.on_change(() => render_app())

const control = { count: 0, max: 70 }

Array(control.max)
  .fill(null)
  .forEach(() =>
    state.disp(add_position, {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 90 + 30
    })
  )

const update_state = () => (
  (control.count = state.get().positions.length),
  control.count < control.max &&
    state.disp(add_position, {
      x: Math.random() * window.innerWidth,
      y: window.innerHeight,
      r: Math.random() * 90 + 30
    }),
  state.disp(
    update_positions,
    state.get().positions.reduce(
      (acc, { x, y, r }, rand, arand, pos, remove) => (
        (remove = y < -r),
        (!remove &&
          ((rand = (Math.random() * r - r / 2) / 60),
          (arand = Math.abs(rand)),
          (pos = {
            x: x + rand,
            y: y - arand,
            r
          }),
          [...acc, pos])) ||
          acc
      ),
      []
    )
  ),
  requestAnimationFrame(update_state)
)

requestAnimationFrame(update_state)
